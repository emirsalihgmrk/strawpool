package com.strawpool_spring.mapper;

import com.strawpool_spring.dto.OptionDto;
import com.strawpool_spring.dto.PollDto;
import com.strawpool_spring.entity.Option;
import com.strawpool_spring.entity.Poll;

import java.util.List;
import java.util.UUID;

public class Mapper {

    public static PollDto toDto(Poll poll){
        return new PollDto(
                poll.getId(),
                poll.getTitle(),
                poll.getDescription(),
                poll.getPollType(),
                toDtoList(poll.getOptions()),
                poll.getUser(),
                poll.getAnonymousId()
        );
    }

    public static Poll toEntity(PollDto pollDto){
        var poll = new Poll();
        poll.setId(UUID.randomUUID().toString());
        poll.setTitle(pollDto.title());
        poll.setDescription(pollDto.description());
        poll.setPollType(pollDto.pollType());
        return poll;
    }

    public static Option toEntity(OptionDto optionDto,Poll poll){
        var option = new Option();
        option.setVoteCount(optionDto.voteCount());
        option.setValue(optionDto.value());
        option.setPoll(poll);
        return option;
    }

    public static OptionDto toDto(Option option){
        return new OptionDto(option.getId(),option.getVoteCount(),option.getValue());
    }

    public static List<OptionDto> toDtoList(List<Option> optionList){
        return optionList.stream().map(Mapper::toDto).toList();
    }

    public static List<Option> toEntityList(List<OptionDto> optionDtoList,Poll poll){
        return optionDtoList.stream().map(optionDto -> toEntity(optionDto,poll)).toList();
    }
}
