package com.shivani.recruitment.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String company;
    private String location;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String salaryRange;
    private String type; // e.g., Full-time, Hybrid, Remote
    
    private String category;
    private String designation;
    private String experience;
    private String qualification;
    private String skills; // comma separated list
    
    // Who posted this job (Could be ADMIN or EMPLOYER)
    private Long postedByUserId;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
