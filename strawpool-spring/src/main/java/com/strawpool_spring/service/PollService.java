package com.strawpool_spring.service;

import com.strawpool_spring.dto.PollDto;
import com.strawpool_spring.entity.Option;
import com.strawpool_spring.entity.Poll;
import com.strawpool_spring.entity.User;
import com.strawpool_spring.mapper.Mapper;
import com.strawpool_spring.repository.OptionRepository;
import com.strawpool_spring.repository.PollRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PollService {

    private final PollRepository pollRepository;
    private final OptionRepository optionRepository;

    public PollDto get(String id){
        var poll = pollRepository.findById(id).orElse(null);
        assert poll != null;
        return Mapper.toDto(poll);
    }

    public PollDto save(PollDto pollDto, User user){
        Poll poll = Mapper.toEntity(pollDto);
        poll.setUser(user);
        var savedPoll = pollRepository.save(poll);
        List<Option> options = optionRepository.saveAll(
                Mapper.toEntityList(pollDto.options(),savedPoll)
        );
        savedPoll.setOptions(options);
        return Mapper.toDto(savedPoll);
    }

    public PollDto save(PollDto pollDto,String anonymousId){
        Poll poll = Mapper.toEntity(pollDto);
        poll.setAnonymousId(anonymousId);
        var savedPoll = pollRepository.save(poll);
        List<Option> options = optionRepository.saveAll(
                Mapper.toEntityList(pollDto.options(),savedPoll)
        );
        savedPoll.setOptions(options);
        return Mapper.toDto(savedPoll);
    }

    public void saveAnonymousPolls(String anonymousId,User user){
        List<Poll> polls = pollRepository.findByAnonymousId(anonymousId);
        if (!polls.isEmpty()){
            polls.stream().peek(poll -> {
                poll.setAnonymousId(null);
                poll.setUser(user);
            }).forEach(pollRepository::save);
        }
    }

    public String getUsernameByPollId(String pollId){
        return pollRepository.findUsernameById(pollId).orElse(null);
    }

    public void vote(Integer id){
        Option option = optionRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Option not found")
        );
        option.setVoteCount(option.getVoteCount() + 1);
        optionRepository.save(option);
    }

    public List<PollDto> findByUserId(String email){
        List<Poll> polls = pollRepository.findByUserEmail(email);
        return polls.stream().map(Mapper::toDto).collect(Collectors.toList());
    }
}
