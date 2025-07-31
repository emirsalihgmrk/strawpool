package com.strawpool_spring;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.strawpool_spring.constant.ApplicationConstants;
import com.strawpool_spring.dto.LoginRequest;
import com.strawpool_spring.service.RefreshTokenService;
import com.strawpool_spring.util.JwtTokenUtil;
import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockCookie;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@AutoConfigureMockMvc
@SpringBootTest
public class AuthTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private  AuthHelper authHelper;
    @Autowired
    private  RefreshTokenService refreshTokenService;
    @Autowired
    private  JwtTokenUtil jwtTokenUtil;
    @Autowired
    private  ObjectMapper objectMapper;


    @Test
    public void publicUrlFailure() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/test/welcome"))
                .andExpect(status().isUnauthorized())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Missing or invalid authorization header or session cookie"));
    }

    @Test
    public void publicUrlSuccess() throws Exception {
        authHelper.init();
        mockMvc.perform(MockMvcRequestBuilders.get("/test/welcome")
                        .cookie(authHelper.mockAnonCookie))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string("welcome"));
    }

    @Test
    public void securedUrlFailure() throws Exception {
        authHelper.init();
        mockMvc.perform(MockMvcRequestBuilders.get("/test/securedPage")
                        .cookie(authHelper.mockAnonCookie))
                .andExpect(status().isUnauthorized())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("An Authentication object was not found in the SecurityContext"));
    }

    @Test
    public void securedUrlSuccess() throws Exception {
        authHelper.login();
        mockMvc.perform(MockMvcRequestBuilders.get("/test/securedPage")
                        .header(ApplicationConstants.JWT_HEADER, "Bearer " + authHelper.accessToken))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string("securedPage"));
    }

    @Test
    public void refreshToken() throws Exception {
        authHelper.login();

        MvcResult accessTokenResponse = mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/refreshToken")
                        .header(ApplicationConstants.CSRF_HEADER,authHelper.mockCsrfCookie.getValue())
                        .cookie(authHelper.mockAnonCookie)
                        .cookie(authHelper.mockRefreshCookie).cookie(authHelper.mockCsrfCookie))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andReturn();

        Cookie newRefreshCookie = accessTokenResponse.getResponse().getCookie(ApplicationConstants.REFRESH_TOKEN);
        assertNotNull(newRefreshCookie, "Refresh token was not found");
        assertEquals(refreshTokenService.getUsername(newRefreshCookie.getValue()), jwtTokenUtil.getUsername(authHelper.accessToken));
        MockCookie mockNewRefreshCookie = authHelper.convertToMock(newRefreshCookie);

        assertNotEquals(authHelper.mockRefreshCookie.getValue(), mockNewRefreshCookie.getValue());

        String accessTokenString = accessTokenResponse.getResponse().getContentAsString();
        JsonNode accessTokenJson = objectMapper.readTree(accessTokenString);
        String newAccessToken = accessTokenJson.get("accessToken").asText();
        assertNotEquals(authHelper.accessToken,newAccessToken);
        authHelper.accessToken = newAccessToken;

        assertTrue(jwtTokenUtil.validateToken(authHelper.accessToken), "Access token returned from /api/auth/refreshToken is invalid");
    }

    @Test
    public void logout() throws Exception {
        authHelper.login();
        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/logout")
                        .cookie(authHelper.mockCsrfCookie)
                        .header(ApplicationConstants.CSRF_HEADER,authHelper.mockCsrfCookie.getValue())
                        .header(ApplicationConstants.JWT_HEADER, "Bearer " + authHelper.accessToken))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(cookie().doesNotExist(ApplicationConstants.REFRESH_TOKEN))
                .andExpect(content().string("Logged out successfully"));
    }
}

