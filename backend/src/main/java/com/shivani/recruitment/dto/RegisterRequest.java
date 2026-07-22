package com.shivani.recruitment.dto;

import com.shivani.recruitment.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String fullName;
    private String email;
    private String phone;
    private String password;
    private Role role;
    
    // Employer fields
    private String companyName;
    private String websiteUrl;
    private String industry;
    private String companySize;
    private String companyLocation;
}
