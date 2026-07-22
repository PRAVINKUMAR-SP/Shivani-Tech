package com.shivani.recruitment.controller;

import com.shivani.recruitment.entity.ApprovalStatus;
import com.shivani.recruitment.entity.CompanyProfile;
import com.shivani.recruitment.repository.CompanyProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final CompanyProfileRepository companyProfileRepository;

    @GetMapping("/companies/pending")
    // @PreAuthorize("hasAuthority('ADMIN')") // Optional: Spring security mapping
    public ResponseEntity<List<CompanyProfile>> getPendingCompanies() {
        return ResponseEntity.ok(companyProfileRepository.findByApprovalStatus(ApprovalStatus.PENDING));
    }

    @PutMapping("/companies/{companyId}/approve")
    public ResponseEntity<?> approveCompany(@PathVariable Long companyId) {
        CompanyProfile company = companyProfileRepository.findById(companyId).orElseThrow();
        company.setApprovalStatus(ApprovalStatus.APPROVED);
        companyProfileRepository.save(company);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/companies/{companyId}/reject")
    public ResponseEntity<?> rejectCompany(@PathVariable Long companyId) {
        CompanyProfile company = companyProfileRepository.findById(companyId).orElseThrow();
        company.setApprovalStatus(ApprovalStatus.REJECTED);
        companyProfileRepository.save(company);
        return ResponseEntity.ok().build();
    }

    // Since we don't have UserService injected yet, let's inject UserRepository and PasswordEncoder directly for simplicity
    private final com.shivani.recruitment.repository.UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PostMapping("/employees")
    public ResponseEntity<com.shivani.recruitment.entity.User> createEmployee(@RequestBody com.shivani.recruitment.dto.RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        com.shivani.recruitment.entity.User user = com.shivani.recruitment.entity.User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(com.shivani.recruitment.entity.Role.EMPLOYEE)
                .build();
        return ResponseEntity.ok(userRepository.save(user));
    }

    @GetMapping("/employees")
    public ResponseEntity<List<com.shivani.recruitment.entity.User>> getEmployees() {
        return ResponseEntity.ok(userRepository.findByRole(com.shivani.recruitment.entity.Role.EMPLOYEE));
    }
}
