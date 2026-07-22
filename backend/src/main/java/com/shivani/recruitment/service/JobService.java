package com.shivani.recruitment.service;

import com.shivani.recruitment.dto.JobApplicationDto;
import com.shivani.recruitment.dto.JobDto;
import com.shivani.recruitment.entity.*;
import com.shivani.recruitment.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;
    private final SavedJobRepository savedJobRepository;
    private final NotificationRepository notificationRepository;

    @Transactional(readOnly = true)
    public List<JobDto> getAllJobs(User currentUser) {
        List<Job> jobs = jobRepository.findAll();
        List<JobApplication> userApps = currentUser != null ? applicationRepository.findByCandidateId(currentUser.getId()) : List.of();
        Set<Long> savedJobIds = currentUser != null ? savedJobRepository.findByCandidateId(currentUser.getId())
                .stream().map(sj -> sj.getJob().getId()).collect(Collectors.toSet()) : Set.of();

        return jobs.stream().map(job -> {
            boolean hasApplied = userApps.stream().anyMatch(app -> app.getJob().getId().equals(job.getId()));
            boolean isSaved = savedJobIds.contains(job.getId());
            return mapToJobDto(job, hasApplied, isSaved);
        }).collect(Collectors.toList());
    }

    @Transactional
    public JobApplicationDto applyForJob(User currentUser, Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (applicationRepository.findByCandidateIdAndJobId(currentUser.getId(), jobId).isPresent()) {
            throw new RuntimeException("Already applied for this job");
        }

        JobApplication application = JobApplication.builder()
                .job(job)
                .candidate(currentUser)
                .status(ApplicationStatus.APPLIED)
                .build();

        JobApplication saved = applicationRepository.save(application);
        return mapToApplicationDto(saved);
    }

    @Transactional(readOnly = true)
    public List<JobApplicationDto> getMyApplications(User currentUser) {
        return applicationRepository.findByCandidateId(currentUser.getId())
                .stream()
                .map(this::mapToApplicationDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<JobDto> getMyPostedJobs(User currentUser) {
        return jobRepository.findByPostedByUserId(currentUser.getId())
                .stream()
                .map(job -> mapToJobDto(job, false, false))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<JobApplicationDto> getJobApplicants(User currentUser, Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        if (!job.getPostedByUserId().equals(currentUser.getId()) && currentUser.getRole() != Role.ADMIN) {
            throw new RuntimeException("Unauthorized to view applicants for this job");
        }

        return applicationRepository.findByJobId(jobId)
                .stream()
                .map(app -> {
                    JobApplicationDto dto = mapToApplicationDto(app);
                    dto.setCandidateId(app.getCandidate().getId());
                    dto.setCandidateName(app.getCandidate().getFullName());
                    dto.setCandidateEmail(app.getCandidate().getEmail());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public JobDto createJob(User currentUser, JobDto dto) {
        Long postedId = currentUser != null ? currentUser.getId() : 1L;
        Job job = Job.builder()
                .title(dto.getTitle())
                .company(dto.getCompany())
                .location(dto.getLocation())
                .description(dto.getDescription())
                .salaryRange(dto.getSalaryRange())
                .type(dto.getType())
                .category(dto.getCategory())
                .designation(dto.getDesignation())
                .experience(dto.getExperience())
                .qualification(dto.getQualification())
                .skills(dto.getSkills())
                .postedByUserId(postedId)
                .build();
        Job saved = jobRepository.save(job);
        return mapToJobDto(saved, false, false);
    }

    @Transactional
    public JobDto updateJob(User currentUser, Long jobId, JobDto dto) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        if (!job.getPostedByUserId().equals(currentUser.getId()) && currentUser.getRole() != Role.ADMIN) {
            throw new RuntimeException("Unauthorized to edit this job");
        }

        job.setTitle(dto.getTitle());
        job.setCompany(dto.getCompany());
        job.setLocation(dto.getLocation());
        job.setDescription(dto.getDescription());
        job.setSalaryRange(dto.getSalaryRange());
        job.setType(dto.getType());
        job.setCategory(dto.getCategory());
        job.setDesignation(dto.getDesignation());
        job.setExperience(dto.getExperience());
        job.setQualification(dto.getQualification());
        job.setSkills(dto.getSkills());

        Job saved = jobRepository.save(job);
        return mapToJobDto(saved, false, false);
    }

    @Transactional
    public void deleteJob(User currentUser, Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        if (!job.getPostedByUserId().equals(currentUser.getId()) && currentUser.getRole() != Role.ADMIN) {
            throw new RuntimeException("Unauthorized to delete this job");
        }

        jobRepository.delete(job);
    }

    // --- Saved Jobs Features ---

    @Transactional
    public void saveJob(User currentUser, Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        if (savedJobRepository.findByCandidateIdAndJobId(currentUser.getId(), jobId).isEmpty()) {
            SavedJob savedJob = SavedJob.builder()
                    .candidate(currentUser)
                    .job(job)
                    .build();
            savedJobRepository.save(savedJob);
        }
    }

    @Transactional
    public void unsaveJob(User currentUser, Long jobId) {
        savedJobRepository.deleteByCandidateIdAndJobId(currentUser.getId(), jobId);
    }

    @Transactional(readOnly = true)
    public List<JobDto> getSavedJobs(User currentUser) {
        List<SavedJob> savedJobs = savedJobRepository.findByCandidateId(currentUser.getId());
        List<JobApplication> userApps = applicationRepository.findByCandidateId(currentUser.getId());

        return savedJobs.stream().map(sj -> {
            Job job = sj.getJob();
            boolean hasApplied = userApps.stream().anyMatch(app -> app.getJob().getId().equals(job.getId()));
            return mapToJobDto(job, hasApplied, true);
        }).collect(Collectors.toList());
    }

    // --- Application Status Update ---

    @Transactional
    public JobApplicationDto updateApplicationStatus(User currentUser, Long appId, String newStatusStr) {
        JobApplication application = applicationRepository.findById(appId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        Job job = application.getJob();
        if (!job.getPostedByUserId().equals(currentUser.getId()) && currentUser.getRole() != Role.ADMIN) {
            throw new RuntimeException("Unauthorized to update status for this application");
        }

        ApplicationStatus status = ApplicationStatus.valueOf(newStatusStr.toUpperCase());
        application.setStatus(status);
        JobApplication saved = applicationRepository.save(application);

        // Notify Candidate
        String msg = String.format("Your application for '%s' at %s has been updated to: %s",
                job.getTitle(), job.getCompany(), status.name().replace("_", " "));

        Notification notification = Notification.builder()
                .recipient(application.getCandidate())
                .message(msg)
                .build();
        notificationRepository.save(notification);

        return mapToApplicationDto(saved);
    }

    private JobDto mapToJobDto(Job job, boolean hasApplied, boolean isSaved) {
        return JobDto.builder()
                .id(job.getId())
                .title(job.getTitle())
                .company(job.getCompany())
                .location(job.getLocation())
                .description(job.getDescription())
                .salaryRange(job.getSalaryRange())
                .type(job.getType())
                .category(job.getCategory())
                .designation(job.getDesignation())
                .experience(job.getExperience())
                .qualification(job.getQualification())
                .skills(job.getSkills())
                .postedByUserId(job.getPostedByUserId())
                .createdAt(job.getCreatedAt())
                .hasApplied(hasApplied)
                .isSaved(isSaved)
                .build();
    }

    private JobApplicationDto mapToApplicationDto(JobApplication app) {
        return JobApplicationDto.builder()
                .id(app.getId())
                .jobId(app.getJob().getId())
                .jobTitle(app.getJob().getTitle())
                .company(app.getJob().getCompany())
                .status(app.getStatus().name())
                .appliedAt(app.getAppliedAt())
                .build();
    }
}
