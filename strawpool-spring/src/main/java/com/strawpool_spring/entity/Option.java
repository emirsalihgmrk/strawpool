package com.strawpool_spring.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "options")
public class Option {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int voteCount;

    private String value;

    @ManyToOne
    @JoinColumn(name = "poll_id")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Poll poll;
}
