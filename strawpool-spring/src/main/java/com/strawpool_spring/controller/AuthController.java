package com.strawpool_spring.controller;

import com.strawpool_spring.constant.ApplicationConstants;
import com.strawpool_spring.dto.LoginResponse;
import com.strawpool_spring.dto.LoginRequest;
import com.strawpool_spring.dto.UserDto;
import com.strawpool_spring.entity.RefreshToken;
import com.strawpool_spring.entity.Role;
import com.strawpool_spring.entity.User;
import com.strawpool_spring.exception.TokenRefreshException;
import com.strawpool_spring.repository.UserRepository;
import com.strawpool_spring.service.PollService;
import com.strawpool_spring.service.RefreshTokenService;
import com.strawpool_spring.util.JwtTokenUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtTokenUtil jwtTokenUtil;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;
    private final UserRepository userRepository;
    private final PollService pollService;

    @GetMapping("/init")
    public ResponseEntity<String> init(){
        return ResponseEntity.ok().body("Successfully initialized");
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody LoginRequest loginRequest,
                                          @RequestAttribute(name = "anonymousId") String anonymousId,
                                          HttpServletResponse response) {
        try{
            Authentication authenticationRequest = UsernamePasswordAuthenticationToken.unauthenticated(loginRequest.username(),loginRequest.password());
            Authentication authenticationResponse = authenticationManager.authenticate(
                    authenticationRequest
            );
            SecurityContextHolder.getContext().setAuthentication(authenticationResponse);
            String authorities = authenticationResponse.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority).collect(Collectors.joining(","));
            String accessToken = jwtTokenUtil.generate(authenticationResponse.getName(),authorities);

            User authenticatedUser = userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            refreshTokenService.deleteAllRefreshTokensByUserId(authenticatedUser.getId());
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(authenticatedUser.getId());

            refreshTokenService.writeToCookie(refreshToken,response);

            pollService.saveAnonymousPolls(anonymousId,authenticatedUser);
            var userDto = new UserDto(authenticatedUser.getEmail(),authenticatedUser.getRoles());
            return ResponseEntity.ok(new LoginResponse(accessToken,userDto,"Bearer"));
        }catch(BadCredentialsException | UsernameNotFoundException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials!");
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred during authentication");
        }
    }

    @PostMapping("/refreshToken")
    public ResponseEntity<?> refreshToken(HttpServletRequest request,HttpServletResponse response){
        Optional<Cookie> refreshTokenCookie = Arrays.stream(request.getCookies() != null ? request.getCookies() : new Cookie[0])
                .filter(cookie -> cookie.getName().equals("refresh_token"))
                .findFirst();
        if (refreshTokenCookie.isEmpty()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token not found");
        }
        String refreshToken = refreshTokenCookie.get().getValue();
        String jtiOfRefreshToken;
        try{
            jtiOfRefreshToken = refreshTokenService.getJtiFromRefreshToken(refreshToken);
        }catch (TokenRefreshException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }

        return refreshTokenService.findByJti(jtiOfRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(existingRefreshToken -> {
                    User user = existingRefreshToken.getUser();
                    refreshTokenService.delete(existingRefreshToken);
                    String authorities = user.getRoles().stream()
                            .map(Role::getName)
                            .collect(Collectors.joining(","));
                    String newAccessToken = jwtTokenUtil.generate(user.getEmail(),authorities);
                    RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user.getId());
                    refreshTokenService.writeToCookie(newRefreshToken,response);
                    var userDto = new UserDto(user.getEmail(),user.getRoles());
                    return ResponseEntity.ok(new LoginResponse(newAccessToken,userDto,"Bearer"));
                })
                .orElseThrow(() -> {
                    String username = refreshTokenService.getUsername(refreshToken);
                    User user = userRepository.findByEmail(username).orElse(null);
                    if (user != null){
                        refreshTokenService.deleteAllRefreshTokensByUserId(user.getId());
                    }
                    return new TokenRefreshException("Refresh token is invalid or was used previously. Please make a new sign in request");
                });
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(Authentication authentication,HttpServletRequest request,HttpServletResponse response){
        if (authentication == null || !authentication.isAuthenticated()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
        }
        try{
            Arrays.stream(request.getCookies())
                    .filter(cookie -> cookie.getName().equals(ApplicationConstants.REFRESH_TOKEN))
                    .forEach(cookie -> {
                        Cookie expiredCookie = new Cookie(cookie.getName(), "");
                        expiredCookie.setMaxAge(0);
                        expiredCookie.setPath(cookie.getPath());
                        expiredCookie.setHttpOnly(cookie.isHttpOnly());
                        expiredCookie.setSecure(cookie.getSecure());
                        response.addCookie(expiredCookie);
                    });
            String username = authentication.getName();
            User authenticatedUser = userRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
            System.out.println(authenticatedUser.getId());
            refreshTokenService.deleteAllRefreshTokensByUserId(authenticatedUser.getId());
            SecurityContextHolder.clearContext();
            return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body("Logged out successfully");
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Could not log out");
        }
    }
}
