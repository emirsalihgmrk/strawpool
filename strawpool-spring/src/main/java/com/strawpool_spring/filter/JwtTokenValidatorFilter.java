package com.strawpool_spring.filter;

import com.strawpool_spring.constant.ApplicationConstants;
import com.strawpool_spring.util.JwtTokenUtil;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Optional;

@RequiredArgsConstructor
public class JwtTokenValidatorFilter extends OncePerRequestFilter {

    private final JwtTokenUtil jwtTokenUtil;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String rawToken;
        Optional<Cookie> anonCookie = Optional.empty();
        String authHeader = request.getHeader(ApplicationConstants.JWT_HEADER);
        if (request.getCookies() != null) {
            anonCookie = Arrays.stream(request.getCookies())
                    .filter(cookie -> ApplicationConstants.ANON_TOKEN.equals(cookie.getName()))
                    .findFirst();
        }
        String anonToken = null;
        if (anonCookie.isPresent()) {
            anonToken = anonCookie.get().getValue();
        }

        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                rawToken = authHeader.substring(7);
                validateAndWriteAuthentication(rawToken, request);
            } else if (anonToken != null) {
                rawToken = anonToken;
                validateAnonToken(rawToken);
                String anonymousId = jwtTokenUtil.getAnonymousId(rawToken);
                request.setAttribute("anonymousId",anonymousId);
            } else {
                throw new BadCredentialsException("Missing or invalid authorization header or session cookie");
            }
        } catch (ExpiredJwtException e) {
            throw new BadCredentialsException("Jwt Token is expired.", e);
        } catch (SignatureException | MalformedJwtException | UnsupportedJwtException | IllegalArgumentException e) {
            throw new BadCredentialsException("Invalid JWT signature or format.", e);
        } catch (UsernameNotFoundException e) {
            throw new BadCredentialsException("User not found from token.", e);
        } catch (Exception e) {
            throw new BadCredentialsException(e.getMessage());
        }
        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return request.getRequestURI().equals("/api/auth/init");
    }

    private void validateAndWriteAuthentication(String rawToken, HttpServletRequest request) {
        String username = jwtTokenUtil.getUsername(rawToken);
        if (username != null &&
                (SecurityContextHolder.getContext().getAuthentication() == null ||
                        SecurityContextHolder.getContext().getAuthentication() instanceof AnonymousAuthenticationToken)) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            if (jwtTokenUtil.validateToken(rawToken, userDetails)) {
                var authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                throw new BadCredentialsException("Invalid JWT Token");
            }
        }
    }

    private void validateAnonToken(String rawToken) {
        if (!jwtTokenUtil.validateToken(rawToken)) {
            throw new BadCredentialsException("Invalid Anon JWT Token");
        }
    }


}
