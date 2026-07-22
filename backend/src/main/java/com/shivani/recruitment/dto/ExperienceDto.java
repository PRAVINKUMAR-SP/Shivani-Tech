package com.shivani.recruitment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExperienceDto {
    private Long id;
    private String jobTitle;
    private String company;
    private String location;
    private String startDate;
    private String endDate;
    private String description;
}
