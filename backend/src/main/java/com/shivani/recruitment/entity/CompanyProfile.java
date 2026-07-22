package com.shivani.recruitment.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "company_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, unique = true)
    private User user;

    private String companyName;
    private String websiteUrl;
    
    @Column(columnDefinition = "TEXT")
    private String companyDescription;

    private String industry;
    private String companySize; // e.g. 1-10, 11-50, 51-200
    private String location;

    @Enumerated(EnumType.STRING)
    private ApprovalStatus approvalStatus;
}
