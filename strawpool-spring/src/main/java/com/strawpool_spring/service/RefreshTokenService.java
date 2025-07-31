package com.strawpool_spring.service;

import com.strawpool_spring.constant.ApplicationConstants;
import com.strawpool_spring.entity.RefreshToken;
import com.strawpool_spring.entity.User;
import com.strawpool_spring.exception.TokenRefreshException;
import com.strawpool_spring.repository.RefreshTokenRepository;
import com.strawpool_spring.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    @Value("${jwt.refresh-secret}")
    private String refreshTokenSecret;

    @Value("${jwt.refresh-expiration}")
    private Long refreshTokenDuration;

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    public Optional<RefreshToken> findByJti(String jti) {
        return refreshTokenRepository.findByJti(jti);
    }

    @Transactional
    public RefreshToken createRefreshToken(int userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found to create Refresh Token for userId: " + userId));

        var refreshToken = new RefreshToken();
        String newJti = UUID.randomUUID().toString();
        Instant expiryDate = Instant.now().plusMillis(refreshTokenDuration);

        SecretKey secretKey = Keys.hmacShaKeyFor(refreshTokenSecret.getBytes(StandardCharsets.UTF_8));
        String jwtToken = Jwts.builder()
                .subject(user.getEmail())
                .claim("jti",newJti)
                .claim("type","refresh")
                .issuedAt(Date.from(Instant.now()))
                .expiration(Date.from(expiryDate))
                .signWith(secretKey)
                .compact();

        refreshToken.setUser(user);
        refreshToken.setExpiryDate(expiryDate);
        refreshToken.setToken(jwtToken);
        refreshToken.setJti(newJti);

        refreshToken = refreshTokenRepository.save(refreshToken);
        return refreshToken;
    }

    public RefreshToken verifyExpiration(RefreshToken token){
        if(token.getExpiryDate().compareTo(Instant.now()) < 0){
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException("Refresh token is expired. Please make a new sign in request");
        }
        return token;
    }

    @Transactional
    public void deleteAllRefreshTokensByUserId(int userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found for deleting Refresh Tokens for userId: " + userId));
        refreshTokenRepository.deleteByUser(user);
    }

    @Transactional
    public void delete(RefreshToken refreshToken){
        refreshTokenRepository.delete(refreshToken);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(refreshTokenSecret.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String getUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String getJtiFromRefreshToken(String refreshTokenString){
        try{
            return extractClaim(refreshTokenString,claims -> String.valueOf(claims.get("jti")));
        }catch(Exception e){
            throw new TokenRefreshException("Invalid or malformed refresh token");
        }
    }

    public void writeToCookie(RefreshToken refreshToken, HttpServletResponse response){
        long maxAge = Duration.between(Instant.now(),refreshToken.getExpiryDate()).toSeconds();
        Cookie refreshTokenCookie = new Cookie(ApplicationConstants.REFRESH_TOKEN,refreshToken.getToken());
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(false);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge((int) maxAge);

        response.addCookie(refreshTokenCookie);
    }
}
