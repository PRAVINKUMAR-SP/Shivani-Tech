package com.shivani.recruitment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EducationDto {
    private Long id;
    private String degree;
    private String institution;
    private String fieldOfStudy;
    private String startDate;
    private String endDate;
    private String grade;
}
