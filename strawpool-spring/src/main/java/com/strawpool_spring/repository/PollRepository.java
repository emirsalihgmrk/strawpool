package com.strawpool_spring.repository;

import com.strawpool_spring.entity.Poll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PollRepository extends JpaRepository<Poll,String> {
    List<Poll> findByAnonymousId(String anonymousId);

    @Query("SELECT p.user.email FROM Poll p WHERE p.id=:id")
    Optional<String> findUsernameById(@Param("id") String id);

    List<Poll> findByUserEmail(String email);
}