package com.shivani.recruitment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JobApplicationDto {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String company;
    private String status;
    private LocalDateTime appliedAt;
    
    // Additional fields for Employer view
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
}
