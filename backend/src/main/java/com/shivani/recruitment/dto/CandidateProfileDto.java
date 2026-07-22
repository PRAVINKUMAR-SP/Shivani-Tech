package com.shivani.recruitment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CandidateProfileDto {
    private Long id;
    private String fullName;
    private String email;
    private String about;
    private String resumeUrl;
    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;
    private String profilePictureUrl;
    
    private String dateOfBirth;
    private String mobile;
    private String experienceLevel;
    private String designation;
    private String currentCompany;
    private String totalExp;
    private String relevantExp;
    private String currentCtc;
    private String expectedCtc;
    private String noticePeriod;
    
    private List<String> skills;
    private List<EducationDto> educations;
    private List<ExperienceDto> experiences;
    private List<ProjectDto> projects;
    private List<InternshipDto> internships;
}
