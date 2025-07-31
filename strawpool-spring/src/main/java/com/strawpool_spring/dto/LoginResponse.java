package com.strawpool_spring.dto;

public record LoginResponse(String accessToken, UserDto userDto, String type){
}
