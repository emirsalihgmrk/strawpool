package com.strawpool_spring.dto;

import com.strawpool_spring.domain.PollType;
import com.strawpool_spring.entity.Option;
import com.strawpool_spring.entity.User;

import java.util.List;

public record PollDto (
        String id, String title, String description, PollType pollType, List<OptionDto> options, User user,String anonymousId) {
}
