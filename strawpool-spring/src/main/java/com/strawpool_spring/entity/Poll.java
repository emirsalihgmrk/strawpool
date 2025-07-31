package com.strawpool_spring.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.strawpool_spring.domain.PollType;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter @Setter
public class Poll {

    @Id
    private String id;

    private String title;

    @Nullable
    private String description;

    @Enumerated(EnumType.STRING)
    private PollType pollType;

    @Nullable
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @Nullable
    private String anonymousId;

    @OneToMany(mappedBy = "poll",cascade = CascadeType.ALL)
    private List<Option> options;
}
