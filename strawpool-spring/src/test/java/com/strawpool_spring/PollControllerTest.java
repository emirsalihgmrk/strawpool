package com.strawpool_spring;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.strawpool_spring.constant.ApplicationConstants;
import com.strawpool_spring.domain.PollType;
import com.strawpool_spring.dto.OptionDto;
import com.strawpool_spring.dto.PollDto;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class PollControllerTest {

    @Autowired
    private AuthHelper authHelper;
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    private static final String AUTH_TEST_ID = "4ac10f17-7d51-4f74-a1b9-b4cde41b708a";
    private static final String ANON_TEST_ID = "f3a72428-f391-4856-b162-7a1f65af43e3";

    @Test
    public void saveWithAuthenticationObject() throws Exception {
        authHelper.init();
        authHelper.login();
        var options = new ArrayList<OptionDto>();
        options.add(new OptionDto(null,5, "Option 1"));
        options.add(new OptionDto(null,4, "Option 2"));
        var pollDto = new PollDto(
                null,"Test Poll", "this poll created for an authenticated user", PollType.MULTIPLE, options,null,null);
        String responseJson = objectMapper.writeValueAsString(pollDto);
        mockMvc.perform(MockMvcRequestBuilders.post("/api/poll/save")
                        .content(responseJson)
                        .contentType(MediaType.APPLICATION_JSON)
                        .cookie(authHelper.mockCsrfCookie)
                        .header(ApplicationConstants.JWT_HEADER, "Bearer " + authHelper.accessToken)
                        .header(ApplicationConstants.CSRF_HEADER, authHelper.mockCsrfCookie.getValue()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.description").value("this poll created for an authenticated user"));
    }

    @Test
    public void saveWithAnonymousId() throws Exception {
        authHelper.init();
        var options = new ArrayList<OptionDto>();
        options.add(new OptionDto(null,5, "Option 1"));
        options.add(new OptionDto(null,4, "Option 2"));
        var pollDto = new PollDto(
                null,"Test Poll", "this poll created for an anonymous user", PollType.MULTIPLE, options,null,null);
        String responseJson = objectMapper.writeValueAsString(pollDto);
        mockMvc.perform(MockMvcRequestBuilders.post("/api/poll/save")
                        .content(responseJson)
                        .contentType(MediaType.APPLICATION_JSON)
                        .cookie(authHelper.mockCsrfCookie)
                        .cookie(authHelper.mockAnonCookie)
                        .header(ApplicationConstants.CSRF_HEADER, authHelper.mockCsrfCookie.getValue()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.description").value("this poll created for an anonymous user"));
    }

    @Test
    public void getPollById() throws Exception {
        authHelper.init();
        mockMvc.perform(MockMvcRequestBuilders.get("/api/poll/" + AUTH_TEST_ID)
                        .cookie(authHelper.mockAnonCookie))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.title").value("Test Poll"));
    }

    @Test
    public void getUsernameById() throws Exception {
        authHelper.init();
        mockMvc.perform(MockMvcRequestBuilders.get(String.format("/api/poll/%s/username", ANON_TEST_ID))
                .cookie(authHelper.mockAnonCookie))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string(""));

        authHelper.login();
        mockMvc.perform(MockMvcRequestBuilders.get(String.format("/api/poll/%s/username", AUTH_TEST_ID))
                        .cookie(authHelper.mockAnonCookie))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string("emirsalihgumruk@gmail.com"));

    }
}
