package com.shivani.recruitment.controller;

import com.shivani.recruitment.dto.AuthResponse;
import com.shivani.recruitment.dto.LoginRequest;
import com.shivani.recruitment.dto.RegisterRequest;
import com.shivani.recruitment.entity.Role;
import com.shivani.recruitment.entity.User;
import com.shivani.recruitment.repository.UserRepository;
import com.shivani.recruitment.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.shivani.recruitment.entity.CompanyProfile;
import com.shivani.recruitment.entity.ApprovalStatus;
import com.shivani.recruitment.repository.CompanyProfileRepository;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(AuthResponse.builder().message("Email already exists").build());
        }

        var user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.CANDIDATE)
                .build();
        
        userRepository.save(user);

        if (user.getRole() == Role.EMPLOYER) {
            CompanyProfile company = CompanyProfile.builder()
                    .user(user)
                    .companyName(request.getCompanyName())
                    .websiteUrl(request.getWebsiteUrl())
                    .industry(request.getIndustry())
                    .companySize(request.getCompanySize())
                    .location(request.getCompanyLocation())
                    .approvalStatus(ApprovalStatus.PENDING)
                    .build();
            companyProfileRepository.save(company);
        }
        
        var jwtToken = jwtService.generateToken(user);
        
        return ResponseEntity.ok(AuthResponse.builder()
                .token(jwtToken)
                .message("User registered successfully")
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build());
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        
        var jwtToken = jwtService.generateToken(user);
        
        return ResponseEntity.ok(AuthResponse.builder()
                .token(jwtToken)
                .message("Login successful")
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build());
    }
}
