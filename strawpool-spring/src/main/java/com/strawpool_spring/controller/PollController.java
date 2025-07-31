package com.strawpool_spring.controller;

import com.strawpool_spring.dto.PollDto;
import com.strawpool_spring.entity.User;
import com.strawpool_spring.repository.UserRepository;
import com.strawpool_spring.service.PollService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/poll")
@RequiredArgsConstructor
public class PollController {

    private final PollService pollService;
    private final UserRepository userRepository;

    @GetMapping("/{id}")
    public ResponseEntity<PollDto> get(@PathVariable("id") String id){
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(pollService.get(id));
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody PollDto pollDto, Authentication authentication,
                                       @RequestAttribute(name = "anonymousId", required = false) String anonymousId){
        if (authentication != null){
            User user = userRepository.findByEmail(authentication.getName()).orElseThrow(
                    () -> new UsernameNotFoundException("User not  found")
            );
            PollDto savedPoll = pollService.save(pollDto,user);
            return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(savedPoll);
        }else if (anonymousId != null){
            PollDto savedPoll = pollService.save(pollDto,anonymousId);
            return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(savedPoll);
        }else{
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).contentType(MediaType.APPLICATION_JSON).body("An unexpected error occurred please try again");
        }
    }

    @GetMapping("/{id}/username")
    public ResponseEntity<?> getUsername(@PathVariable("id") String id){
        String email = pollService.getUsernameByPollId(id);
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(email);
    }

    @PostMapping("/vote/{id}")
    public ResponseEntity<String> vote(@PathVariable("id") Integer id){
        pollService.vote(id);
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body("Voted successfully");
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<PollDto>> getAll(@RequestParam("email") String email){
        List<PollDto> polls = pollService.findByUserId(email);
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(polls);
    }
}
