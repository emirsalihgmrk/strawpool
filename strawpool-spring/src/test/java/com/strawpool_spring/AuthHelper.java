package com.strawpool_spring;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.strawpool_spring.constant.ApplicationConstants;
import com.strawpool_spring.dto.LoginRequest;
import com.strawpool_spring.util.JwtTokenUtil;
import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockCookie;
import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Component
@RequiredArgsConstructor
public class AuthHelper {

    @Autowired
    private MockMvc mockMvc;
    public MockCookie mockAnonCookie;
    public MockCookie mockCsrfCookie;
    public MockCookie mockRefreshCookie;
    public String accessToken;
    private final ObjectMapper objectMapper;
    private final JwtTokenUtil jwtTokenUtil;

    public void login() throws Exception {
        init();
        LoginRequest loginRequest = new LoginRequest("emirsalihgumruk@gmail.com", "gumruk123");
        String loginRequestJson = objectMapper.writeValueAsString(loginRequest);
        MvcResult loginResponse = mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/login")
                        .cookie(mockAnonCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginRequestJson))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andReturn();

        Cookie refreshCookie = loginResponse.getResponse().getCookie("refresh_token");
        if (refreshCookie == null) {
            throw new AssertionError("Refresh token was not set in the /api/auth/login response");
        }
        mockRefreshCookie = convertToMock(refreshCookie);

        String loginResponseString = loginResponse.getResponse().getContentAsString();

        JsonNode loginResponseJson = objectMapper.readTree(loginResponseString);
        accessToken = loginResponseJson.get("accessToken").asText();

        assertTrue(jwtTokenUtil.validateToken(accessToken), "Access token is invalid");
    }


    public void init() throws Exception {
        MvcResult initResult = mockMvc.perform(MockMvcRequestBuilders.get("/api/auth/init"))
                .andExpect(status().isOk())
                .andExpect(cookie().exists(ApplicationConstants.ANON_TOKEN))
                .andReturn();

        Cookie anonCookie = initResult.getResponse().getCookie(ApplicationConstants.ANON_TOKEN);
        Cookie csrfCookie = initResult.getResponse().getCookie(ApplicationConstants.CSRF_COOKIE);

        if (anonCookie == null) {
            throw new AssertionError("Anonymous cookie was not set in the /init response.");
        }
        if (csrfCookie == null) {
            throw new AssertionError("Csrf cookie was not set in the /init response.");
        }
        mockAnonCookie = convertToMock(anonCookie);

        mockCsrfCookie = convertToMock(csrfCookie);
    }

    public MockCookie convertToMock(Cookie cookie) {
        MockCookie mockCookie = new MockCookie(cookie.getName(), cookie.getValue());
        mockCookie.setHttpOnly(cookie.isHttpOnly());
        mockCookie.setSecure(cookie.getSecure());
        mockCookie.setPath(cookie.getPath());
        mockCookie.setMaxAge(cookie.getMaxAge());
        return mockCookie;
    }
}
