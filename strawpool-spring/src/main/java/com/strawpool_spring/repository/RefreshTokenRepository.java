package com.strawpool_spring.repository;

import com.strawpool_spring.entity.RefreshToken;
import com.strawpool_spring.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken,Integer> {
    Optional<RefreshToken> findByJti(String jti);

    @Modifying
    void deleteByUser(User user);

    Optional<RefreshToken> findByToken(String token);
}