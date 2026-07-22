package com.shivani.recruitment.repository;

import com.shivani.recruitment.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    java.util.List<User> findByRole(com.shivani.recruitment.entity.Role role);
}
