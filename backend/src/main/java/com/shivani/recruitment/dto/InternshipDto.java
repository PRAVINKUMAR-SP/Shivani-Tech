package com.shivani.recruitment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InternshipDto {
    private String role;
    private String company;
    private String startDate;
    private String endDate;
    private String description;
}
