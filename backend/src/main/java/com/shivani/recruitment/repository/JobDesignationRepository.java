package com.shivani.recruitment.repository;

import com.shivani.recruitment.entity.JobDesignation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobDesignationRepository extends JpaRepository<JobDesignation, Long> {
}
