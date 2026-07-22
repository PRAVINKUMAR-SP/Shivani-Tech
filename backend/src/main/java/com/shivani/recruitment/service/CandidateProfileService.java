package com.shivani.recruitment.service;

import com.shivani.recruitment.dto.*;
import com.shivani.recruitment.entity.*;
import com.shivani.recruitment.repository.CandidateProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateProfileService {

    private final CandidateProfileRepository profileRepository;

    @Transactional(readOnly = true)
    public CandidateProfileDto getProfile(User user) {
        CandidateProfile profile = profileRepository.findByUserId(user.getId())
                .orElseGet(() -> CandidateProfile.builder().user(user).build());
        return mapToDto(profile);
    }

    @Transactional
    public CandidateProfileDto updateProfile(User user, CandidateProfileDto dto) {
        CandidateProfile profile = profileRepository.findByUserId(user.getId())
                .orElseGet(() -> CandidateProfile.builder().user(user).build());

        profile.setAbout(dto.getAbout());
        profile.setResumeUrl(dto.getResumeUrl());
        profile.setLinkedinUrl(dto.getLinkedinUrl());
        profile.setGithubUrl(dto.getGithubUrl());
        profile.setPortfolioUrl(dto.getPortfolioUrl());
        profile.setProfilePictureUrl(dto.getProfilePictureUrl());
        
        profile.setDateOfBirth(dto.getDateOfBirth());
        profile.setMobile(dto.getMobile());
        profile.setExperienceLevel(dto.getExperienceLevel());
        profile.setDesignation(dto.getDesignation());
        profile.setCurrentCompany(dto.getCurrentCompany());
        profile.setTotalExp(dto.getTotalExp());
        profile.setRelevantExp(dto.getRelevantExp());
        profile.setCurrentCtc(dto.getCurrentCtc());
        profile.setExpectedCtc(dto.getExpectedCtc());
        profile.setNoticePeriod(dto.getNoticePeriod());
        
        if (dto.getSkills() != null) {
            profile.getSkills().clear();
            profile.getSkills().addAll(dto.getSkills());
        }

        if (dto.getEducations() != null) {
            profile.getEducations().clear();
            profile.getEducations().addAll(dto.getEducations().stream().map(e -> 
                Education.builder().candidateProfile(profile).degree(e.getDegree())
                .institution(e.getInstitution()).fieldOfStudy(e.getFieldOfStudy())
                .startDate(e.getStartDate()).endDate(e.getEndDate()).grade(e.getGrade()).build()
            ).collect(Collectors.toList()));
        }

        if (dto.getExperiences() != null) {
            profile.getExperiences().clear();
            profile.getExperiences().addAll(dto.getExperiences().stream().map(e -> 
                Experience.builder().candidateProfile(profile).jobTitle(e.getJobTitle())
                .company(e.getCompany()).location(e.getLocation())
                .startDate(e.getStartDate()).endDate(e.getEndDate()).description(e.getDescription()).build()
            ).collect(Collectors.toList()));
        }

        if (dto.getProjects() != null) {
            profile.getProjects().clear();
            profile.getProjects().addAll(dto.getProjects().stream().map(p -> 
                Project.builder().candidateProfile(profile).name(p.getName())
                .url(p.getUrl()).description(p.getDescription()).build()
            ).collect(Collectors.toList()));
        }

        if (dto.getInternships() != null) {
            profile.getInternships().clear();
            profile.getInternships().addAll(dto.getInternships().stream().map(i -> 
                Internship.builder().candidateProfile(profile).role(i.getRole())
                .company(i.getCompany()).startDate(i.getStartDate())
                .endDate(i.getEndDate()).description(i.getDescription()).build()
            ).collect(Collectors.toList()));
        }

        CandidateProfile saved = profileRepository.save(profile);
        return mapToDto(saved);
    }

    private CandidateProfileDto mapToDto(CandidateProfile profile) {
        return CandidateProfileDto.builder()
                .id(profile.getId())
                .fullName(profile.getUser() != null ? profile.getUser().getFullName() : null)
                .email(profile.getUser() != null ? profile.getUser().getEmail() : null)
                .about(profile.getAbout())
                .resumeUrl(profile.getResumeUrl())
                .linkedinUrl(profile.getLinkedinUrl())
                .githubUrl(profile.getGithubUrl())
                .portfolioUrl(profile.getPortfolioUrl())
                .profilePictureUrl(profile.getProfilePictureUrl())
                .dateOfBirth(profile.getDateOfBirth())
                .mobile(profile.getMobile())
                .experienceLevel(profile.getExperienceLevel())
                .designation(profile.getDesignation())
                .currentCompany(profile.getCurrentCompany())
                .totalExp(profile.getTotalExp())
                .relevantExp(profile.getRelevantExp())
                .currentCtc(profile.getCurrentCtc())
                .expectedCtc(profile.getExpectedCtc())
                .noticePeriod(profile.getNoticePeriod())
                .skills(profile.getSkills())
                .educations(profile.getEducations().stream().map(e -> 
                    EducationDto.builder().id(e.getId()).degree(e.getDegree())
                    .institution(e.getInstitution()).fieldOfStudy(e.getFieldOfStudy())
                    .startDate(e.getStartDate()).endDate(e.getEndDate()).grade(e.getGrade()).build()
                ).collect(Collectors.toList()))
                .experiences(profile.getExperiences().stream().map(e -> 
                    ExperienceDto.builder().id(e.getId()).jobTitle(e.getJobTitle())
                    .company(e.getCompany()).location(e.getLocation())
                    .startDate(e.getStartDate()).endDate(e.getEndDate()).description(e.getDescription()).build()
                ).collect(Collectors.toList()))
                .projects(profile.getProjects().stream().map(p -> 
                    ProjectDto.builder().name(p.getName()).url(p.getUrl()).description(p.getDescription()).build()
                ).collect(Collectors.toList()))
                .internships(profile.getInternships().stream().map(i -> 
                    InternshipDto.builder().role(i.getRole()).company(i.getCompany())
                    .startDate(i.getStartDate()).endDate(i.getEndDate()).description(i.getDescription()).build()
                ).collect(Collectors.toList()))
                .build();
    }
}
