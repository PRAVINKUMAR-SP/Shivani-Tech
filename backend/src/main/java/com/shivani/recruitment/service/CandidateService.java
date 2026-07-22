package com.shivani.recruitment.service;

import com.shivani.recruitment.dto.CandidateProfileDto;
import com.shivani.recruitment.dto.EducationDto;
import com.shivani.recruitment.dto.ExperienceDto;
import com.shivani.recruitment.entity.CandidateProfile;
import com.shivani.recruitment.entity.Education;
import com.shivani.recruitment.entity.Experience;
import com.shivani.recruitment.entity.User;
import com.shivani.recruitment.repository.CandidateProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CandidateService {

    private final CandidateProfileRepository profileRepository;

    @Transactional(readOnly = true)
    public CandidateProfileDto getProfile(User user) {
        return profileRepository.findByUserId(user.getId())
                .map(this::mapToDto)
                .orElse(CandidateProfileDto.builder().fullName(user.getFullName()).build()); // Return empty if not found
    }

    @Transactional
    public CandidateProfileDto updateProfile(User user, CandidateProfileDto dto) {
        CandidateProfile profile = profileRepository.findByUserId(user.getId())
                .orElse(new CandidateProfile());

        profile.setUser(user);
        profile.setAbout(dto.getAbout());
        profile.setResumeUrl(dto.getResumeUrl());
        profile.setLinkedinUrl(dto.getLinkedinUrl());
        profile.setGithubUrl(dto.getGithubUrl());
        profile.setPortfolioUrl(dto.getPortfolioUrl());
        profile.setSkills(dto.getSkills());

        // Update Educations
        profile.getEducations().clear();
        if (dto.getEducations() != null) {
            profile.getEducations().addAll(dto.getEducations().stream().map(e -> {
                Education edu = new Education();
                edu.setCandidateProfile(profile);
                edu.setDegree(e.getDegree());
                edu.setInstitution(e.getInstitution());
                edu.setFieldOfStudy(e.getFieldOfStudy());
                edu.setStartDate(e.getStartDate());
                edu.setEndDate(e.getEndDate());
                edu.setGrade(e.getGrade());
                return edu;
            }).collect(Collectors.toList()));
        }

        // Update Experiences
        profile.getExperiences().clear();
        if (dto.getExperiences() != null) {
            profile.getExperiences().addAll(dto.getExperiences().stream().map(e -> {
                Experience exp = new Experience();
                exp.setCandidateProfile(profile);
                exp.setJobTitle(e.getJobTitle());
                exp.setCompany(e.getCompany());
                exp.setLocation(e.getLocation());
                exp.setStartDate(e.getStartDate());
                exp.setEndDate(e.getEndDate());
                exp.setDescription(e.getDescription());
                return exp;
            }).collect(Collectors.toList()));
        }

        CandidateProfile saved = profileRepository.save(profile);
        return mapToDto(saved);
    }

    private CandidateProfileDto mapToDto(CandidateProfile profile) {
        return CandidateProfileDto.builder()
                .fullName(profile.getUser() != null ? profile.getUser().getFullName() : null)
                .about(profile.getAbout())
                .resumeUrl(profile.getResumeUrl())
                .linkedinUrl(profile.getLinkedinUrl())
                .githubUrl(profile.getGithubUrl())
                .portfolioUrl(profile.getPortfolioUrl())
                .skills(profile.getSkills())
                .educations(profile.getEducations().stream().map(e -> EducationDto.builder()
                        .id(e.getId())
                        .degree(e.getDegree())
                        .institution(e.getInstitution())
                        .fieldOfStudy(e.getFieldOfStudy())
                        .startDate(e.getStartDate())
                        .endDate(e.getEndDate())
                        .grade(e.getGrade())
                        .build()).collect(Collectors.toList()))
                .experiences(profile.getExperiences().stream().map(e -> ExperienceDto.builder()
                        .id(e.getId())
                        .jobTitle(e.getJobTitle())
                        .company(e.getCompany())
                        .location(e.getLocation())
                        .startDate(e.getStartDate())
                        .endDate(e.getEndDate())
                        .description(e.getDescription())
                        .build()).collect(Collectors.toList()))
                .build();
    }
}
