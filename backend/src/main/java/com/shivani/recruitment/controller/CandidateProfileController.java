package com.shivani.recruitment.controller;

import com.shivani.recruitment.dto.CandidateProfileDto;
import com.shivani.recruitment.entity.User;
import com.shivani.recruitment.service.CandidateProfileService;
import com.shivani.recruitment.service.ResumeParserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class CandidateProfileController {

    private final CandidateProfileService profileService;
    private final ResumeParserService resumeParserService;

    @GetMapping
    public ResponseEntity<CandidateProfileDto> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(profileService.getProfile(user));
    }

    @PutMapping
    public ResponseEntity<CandidateProfileDto> updateProfile(@AuthenticationPrincipal User user, @RequestBody CandidateProfileDto dto) {
        return ResponseEntity.ok(profileService.updateProfile(user, dto));
    }

    @PostMapping("/parse-resume")
    public ResponseEntity<CandidateProfileDto> parseResume(@RequestParam("file") MultipartFile file) {
        try {
            CandidateProfileDto parsedProfile = resumeParserService.parseResume(file);
            return ResponseEntity.ok(parsedProfile);
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/upload-resume")
    public ResponseEntity<String> uploadResume(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }
            java.nio.file.Path uploadPath = java.nio.file.Paths.get("uploads/resumes");
            if (!java.nio.file.Files.exists(uploadPath)) {
                java.nio.file.Files.createDirectories(uploadPath);
            }
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            java.nio.file.Path filePath = uploadPath.resolve(fileName);
            java.nio.file.Files.copy(file.getInputStream(), filePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            
            String fileUrl = "/uploads/resumes/" + fileName;
            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Could not upload file");
        }
    }
    @PostMapping("/upload-photo")
    public ResponseEntity<String> uploadPhoto(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }
            java.nio.file.Path uploadPath = java.nio.file.Paths.get("uploads/photos");
            if (!java.nio.file.Files.exists(uploadPath)) {
                java.nio.file.Files.createDirectories(uploadPath);
            }
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            java.nio.file.Path filePath = uploadPath.resolve(fileName);
            java.nio.file.Files.copy(file.getInputStream(), filePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            
            String fileUrl = "/uploads/photos/" + fileName;
            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Could not upload file");
        }
    }
}
