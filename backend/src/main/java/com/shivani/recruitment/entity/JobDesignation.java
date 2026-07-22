package com.shivani.recruitment.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "job_designations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobDesignation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;
}
