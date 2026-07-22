package com.shivani.recruitment;

import com.shivani.recruitment.entity.Role;
import com.shivani.recruitment.entity.User;
import com.shivani.recruitment.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

// @Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final com.shivani.recruitment.repository.JobRepository jobRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(UserRepository userRepository, com.shivani.recruitment.repository.JobRepository jobRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User defaultUser = User.builder()
                    .fullName("Candidate User")
                    .email("candidate@example.com")
                    .password(passwordEncoder.encode("password"))
                    .role(Role.CANDIDATE)
                    .phone("1234567890")
                    .build();
            userRepository.save(defaultUser);

            User adminUser = User.builder()
                    .fullName("System Admin")
                    .email("admin@example.com")
                    .password(passwordEncoder.encode("password"))
                    .role(Role.ADMIN)
                    .phone("0987654321")
                    .build();
            userRepository.save(adminUser);
        }

        if (jobRepository.count() == 0) {
            jobRepository.save(com.shivani.recruitment.entity.Job.builder()
                    .title("Senior Frontend Engineer")
                    .company("Shivani Technologies")
                    .location("Remote")
                    .description("Looking for an experienced React developer to lead our frontend team. Must have deep knowledge of modern CSS, state management, and performance optimization.")
                    .salaryRange("$120k - $160k")
                    .type("Remote")
                    .build());
                    
            jobRepository.save(com.shivani.recruitment.entity.Job.builder()
                    .title("Backend Java Developer")
                    .company("Google")
                    .location("Bangalore, India")
                    .description("Join the core search team. 5+ years of Java and Spring Boot experience required.")
                    .salaryRange("₹35,00,000 - ₹50,00,000")
                    .type("Hybrid")
                    .build());
                    
            jobRepository.save(com.shivani.recruitment.entity.Job.builder()
                    .title("Full Stack Engineer")
                    .company("Microsoft")
                    .location("Hyderabad, India")
                    .description("Build scalable applications using React, Node.js, and Azure.")
                    .salaryRange("₹25,00,000 - ₹40,00,000")
                    .type("On-site")
                    .build());
        }
    }
}
