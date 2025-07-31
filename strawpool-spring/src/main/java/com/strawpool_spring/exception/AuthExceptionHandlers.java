package com.strawpool_spring.exception;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class AuthExceptionHandlers {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint(){
        return (request,response,authException) -> {
            writeExceptionBody(HttpServletResponse.SC_UNAUTHORIZED, request, response, "Unauthorized", authException.getMessage());
        };
    }

    @Bean
    public AccessDeniedHandler accessDeniedHandler(){
        return (request,response,accessDeniedException) -> {
            writeExceptionBody(HttpServletResponse.SC_FORBIDDEN, request, response, "Forbidden", accessDeniedException.getMessage());
        };
    }

    private void writeExceptionBody(int status, HttpServletRequest request, HttpServletResponse response, String errorType, String message) throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        final Map<String,Object> body = new HashMap<>();
        body.put("timestamp", System.currentTimeMillis());
        body.put("status", status);
        body.put("error", errorType);
        body.put("message", message);
        body.put("path", request.getRequestURI());

        objectMapper.writeValue(response.getOutputStream(), body);
    }
}
