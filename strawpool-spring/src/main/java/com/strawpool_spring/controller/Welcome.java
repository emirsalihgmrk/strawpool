package com.strawpool_spring.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("test")
public class Welcome {

    @GetMapping("/welcome")
    public ResponseEntity<String> welcome(){
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body("welcome");
    }

    @GetMapping("/securedPage")
    public ResponseEntity<String> securedPage(){
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body("securedPage");
    }
}
