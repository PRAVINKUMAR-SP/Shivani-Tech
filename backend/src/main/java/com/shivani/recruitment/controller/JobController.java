package com.shivani.recruitment.controller;

import com.shivani.recruitment.dto.JobApplicationDto;
import com.shivani.recruitment.dto.JobDto;
import com.shivani.recruitment.entity.Role;
import com.shivani.recruitment.entity.User;
import com.shivani.recruitment.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping
    public ResponseEntity<List<JobDto>> getAllJobs(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(jobService.getAllJobs(user));
    }

    @PostMapping
    public ResponseEntity<?> createJob(@AuthenticationPrincipal User user, @RequestBody JobDto jobDto) {
        if (user.getRole() != Role.EMPLOYER && user.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Only employers can post jobs"));
        }
        return ResponseEntity.ok(jobService.createJob(user, jobDto));
    }

    @PostMapping("/{jobId}/apply")
    public ResponseEntity<?> applyForJob(
            @AuthenticationPrincipal User user,
            @PathVariable Long jobId) {
        if (user.getRole() != Role.CANDIDATE) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Only job seekers can apply for jobs"));
        }
        return ResponseEntity.ok(jobService.applyForJob(user, jobId));
    }

    @GetMapping("/applications")
    public ResponseEntity<List<JobApplicationDto>> getMyApplications(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(jobService.getMyApplications(user));
    }

    @GetMapping("/my-jobs")
    public ResponseEntity<List<JobDto>> getMyPostedJobs(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(jobService.getMyPostedJobs(user));
    }

    @GetMapping("/{jobId}/applications")
    public ResponseEntity<List<JobApplicationDto>> getJobApplicants(
            @AuthenticationPrincipal User user,
            @PathVariable Long jobId) {
        return ResponseEntity.ok(jobService.getJobApplicants(user, jobId));
    }

    @PutMapping("/{jobId}")
    public ResponseEntity<JobDto> updateJob(
            @AuthenticationPrincipal User user,
            @PathVariable Long jobId,
            @RequestBody JobDto jobDto) {
        return ResponseEntity.ok(jobService.updateJob(user, jobId, jobDto));
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<Void> deleteJob(
            @AuthenticationPrincipal User user,
            @PathVariable Long jobId) {
        jobService.deleteJob(user, jobId);
        return ResponseEntity.noContent().build();
    }

    // --- Saved Jobs Endpoints ---

    @PostMapping("/{jobId}/save")
    public ResponseEntity<Void> saveJob(
            @AuthenticationPrincipal User user,
            @PathVariable Long jobId) {
        jobService.saveJob(user, jobId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{jobId}/save")
    public ResponseEntity<Void> unsaveJob(
            @AuthenticationPrincipal User user,
            @PathVariable Long jobId) {
        jobService.unsaveJob(user, jobId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/saved")
    public ResponseEntity<List<JobDto>> getSavedJobs(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(jobService.getSavedJobs(user));
    }

    // --- Application Status Endpoints ---

    @PutMapping("/applications/{appId}/status")
    public ResponseEntity<JobApplicationDto> updateApplicationStatus(
            @AuthenticationPrincipal User user,
            @PathVariable Long appId,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(jobService.updateApplicationStatus(user, appId, status));
    }
}
