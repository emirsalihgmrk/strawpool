package com.strawpool_spring.filter;

import com.strawpool_spring.constant.ApplicationConstants;
import com.strawpool_spring.util.JwtTokenUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
public class SetAnonymousCookieFilter extends OncePerRequestFilter {

    private final JwtTokenUtil jwtTokenUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        Optional<Cookie> anonymousTokenCookie = Optional.empty();
        if (request.getCookies() != null){
            anonymousTokenCookie = Arrays.stream(request.getCookies())
                    .filter(cookie -> ApplicationConstants.ANON_TOKEN.equals(cookie.getName()))
                    .findFirst();
        }

        String authHeader = request.getHeader(ApplicationConstants.JWT_HEADER);
        boolean isAuthenticatedUser = (authHeader != null && authHeader.startsWith("Bearer "));

        if (!isAuthenticatedUser && anonymousTokenCookie.isEmpty()){
            String anonymousId = UUID.randomUUID().toString();
            String rawAnonymousToken = jwtTokenUtil.generate(anonymousId);

            Cookie cookie = new Cookie(ApplicationConstants.ANON_TOKEN, rawAnonymousToken);
            cookie.setHttpOnly(true);
            cookie.setSecure(false);
            cookie.setPath("/");
            cookie.setMaxAge((int) Duration.ofDays(30).toMillis());

            response.addCookie(cookie);
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return request.getRequestURI().equals("/api/auth/refreshToken");
    }
}
