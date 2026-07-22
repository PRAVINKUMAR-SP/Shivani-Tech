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
public class JobDto {
    private Long id;
    private String title;
    private String company;
    private String location;
    private String description;
    private String salaryRange;
    private String type;

    private String category;
    private String designation;
    private String experience;
    private String qualification;
    private String skills;
    private Long postedByUserId;

    private LocalDateTime createdAt;
    
    // Additional fields for frontend state
    private Boolean hasApplied;
    private Boolean isSaved;
}
