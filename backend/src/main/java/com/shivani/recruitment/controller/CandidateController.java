package com.shivani.recruitment.controller;

import com.shivani.recruitment.dto.CandidateProfileDto;
import com.shivani.recruitment.entity.User;
import com.shivani.recruitment.service.CandidateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/candidate")
@RequiredArgsConstructor
public class CandidateController {

    private final CandidateService candidateService;

    @GetMapping("/profile")
    public ResponseEntity<CandidateProfileDto> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(candidateService.getProfile(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<CandidateProfileDto> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody CandidateProfileDto dto
    ) {
        return ResponseEntity.ok(candidateService.updateProfile(user, dto));
    }
}
