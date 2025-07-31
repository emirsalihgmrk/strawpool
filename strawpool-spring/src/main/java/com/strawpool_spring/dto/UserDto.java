package com.strawpool_spring.dto;

import com.strawpool_spring.entity.Role;

import java.util.Set;

public record UserDto(String email, Set<Role> roles) {
}
