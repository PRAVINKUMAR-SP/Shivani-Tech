package com.shivani.recruitment.controller;

import com.shivani.recruitment.entity.JobCategory;
import com.shivani.recruitment.entity.JobDesignation;
import com.shivani.recruitment.entity.JobLocation;
import com.shivani.recruitment.entity.JobSkill;
import com.shivani.recruitment.repository.JobCategoryRepository;
import com.shivani.recruitment.repository.JobDesignationRepository;
import com.shivani.recruitment.repository.JobLocationRepository;
import com.shivani.recruitment.repository.JobSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/master-data")
@RequiredArgsConstructor
public class MasterDataController {

    private final JobCategoryRepository categoryRepository;
    private final JobDesignationRepository designationRepository;
    private final JobLocationRepository locationRepository;
    private final JobSkillRepository skillRepository;

    // --- CATEGORIES ---
    @GetMapping("/categories")
    public ResponseEntity<List<JobCategory>> getCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @PostMapping("/categories")
    public ResponseEntity<JobCategory> createCategory(@RequestBody JobCategory category) {
        return ResponseEntity.ok(categoryRepository.save(category));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        categoryRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- DESIGNATIONS ---
    @GetMapping("/designations")
    public ResponseEntity<List<JobDesignation>> getDesignations() {
        return ResponseEntity.ok(designationRepository.findAll());
    }

    @PostMapping("/designations")
    public ResponseEntity<JobDesignation> createDesignation(@RequestBody JobDesignation designation) {
        return ResponseEntity.ok(designationRepository.save(designation));
    }

    @DeleteMapping("/designations/{id}")
    public ResponseEntity<?> deleteDesignation(@PathVariable Long id) {
        designationRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- LOCATIONS ---
    @GetMapping("/locations")
    public ResponseEntity<List<JobLocation>> getLocations() {
        return ResponseEntity.ok(locationRepository.findAll());
    }

    @PostMapping("/locations")
    public ResponseEntity<JobLocation> createLocation(@RequestBody JobLocation location) {
        return ResponseEntity.ok(locationRepository.save(location));
    }

    @DeleteMapping("/locations/{id}")
    public ResponseEntity<?> deleteLocation(@PathVariable Long id) {
        locationRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- SKILLS ---
    @GetMapping("/skills")
    public ResponseEntity<List<JobSkill>> getSkills() {
        return ResponseEntity.ok(skillRepository.findAll());
    }

    @PostMapping("/skills")
    public ResponseEntity<JobSkill> createSkill(@RequestBody JobSkill skill) {
        return ResponseEntity.ok(skillRepository.save(skill));
    }

    @DeleteMapping("/skills/{id}")
    public ResponseEntity<?> deleteSkill(@PathVariable Long id) {
        skillRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
