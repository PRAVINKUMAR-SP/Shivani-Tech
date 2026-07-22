package com.shivani.recruitment.service;

import com.shivani.recruitment.dto.CandidateProfileDto;
import com.shivani.recruitment.dto.ProjectDto;
import com.shivani.recruitment.dto.InternshipDto;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ResumeParserService {

    private static final List<String> COMMON_SKILLS = Arrays.asList(
            "Java", "Python", "JavaScript", "React", "Angular", "Vue", "Spring Boot",
            "Node.js", "SQL", "MySQL", "PostgreSQL", "MongoDB", "AWS", "Docker", "Kubernetes",
            "Git", "HTML", "CSS", "TypeScript", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin",
            "Android", "iOS", "Machine Learning", "Data Science", "Express", "REST API", "GraphQL"
    );

    public CandidateProfileDto parseResume(MultipartFile file) throws IOException {
        CandidateProfileDto dto = new CandidateProfileDto();

        if (file.isEmpty() || !file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
            throw new IllegalArgumentException("Only PDF files are supported");
        }

        try (InputStream is = file.getInputStream(); PDDocument document = PDDocument.load(is)) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            // Extract Email
            Pattern emailPattern = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
            Matcher emailMatcher = emailPattern.matcher(text);
            
            // Extract Mobile
            Pattern mobilePattern = Pattern.compile("\\+?\\d{10,14}");
            Matcher mobileMatcher = mobilePattern.matcher(text);
            if (mobileMatcher.find()) {
                dto.setMobile(mobileMatcher.group());
            }

            // Let's look for LinkedIn URL
            Pattern linkedinPattern = Pattern.compile("(https?://(?:www\\.)?linkedin\\.com/in/[a-zA-Z0-9_-]+/?)[\\s]*");
            Matcher linkedinMatcher = linkedinPattern.matcher(text);
            if (linkedinMatcher.find()) {
                dto.setLinkedinUrl(linkedinMatcher.group(1));
            }

            // Look for GitHub URL
            Pattern githubPattern = Pattern.compile("(https?://(?:www\\.)?github\\.com/[a-zA-Z0-9_-]+/?)[\\s]*");
            Matcher githubMatcher = githubPattern.matcher(text);
            if (githubMatcher.find()) {
                dto.setGithubUrl(githubMatcher.group(1));
            }

            // Extract Skills
            List<String> foundSkills = new ArrayList<>();
            String lowerText = text.toLowerCase();
            for (String skill : COMMON_SKILLS) {
                if (lowerText.contains(skill.toLowerCase())) {
                    foundSkills.add(skill);
                }
            }
            dto.setSkills(foundSkills);

            // Educations and Experiences are hard to parse perfectly without ML.
            // We will initialize them empty.
            dto.setEducations(new ArrayList<>());
            dto.setExperiences(new ArrayList<>());
            
            // Projects and Internships heuristic extraction
            List<ProjectDto> projects = new ArrayList<>();
            List<InternshipDto> internships = new ArrayList<>();
            String[] lines = text.split("\\r?\\n");
            
            boolean inProjects = false;
            boolean inInternships = false;
            StringBuilder currentProject = new StringBuilder();
            StringBuilder currentInternship = new StringBuilder();

            StringBuilder aboutBuilder = new StringBuilder();
            int count = 0;
            
            for (String line : lines) {
                String trimmed = line.trim();
                String upperLine = trimmed.toUpperCase();
                
                if (upperLine.equals("PROJECTS") || upperLine.equals("ACADEMIC PROJECTS") || upperLine.equals("PERSONAL PROJECTS")) {
                    inProjects = true;
                    inInternships = false;
                    continue;
                } else if (upperLine.equals("INTERNSHIPS") || upperLine.equals("EXPERIENCE") || upperLine.equals("WORK EXPERIENCE")) {
                    inInternships = true;
                    inProjects = false;
                    continue;
                } else if (upperLine.equals("EDUCATION") || upperLine.equals("SKILLS") || upperLine.equals("CERTIFICATIONS")) {
                    inProjects = false;
                    inInternships = false;
                }

                if (inProjects && trimmed.length() > 5) {
                    if (currentProject.length() > 200) {
                        projects.add(ProjectDto.builder().name("Extracted Project").description(currentProject.toString().trim()).build());
                        currentProject = new StringBuilder();
                    }
                    currentProject.append(trimmed).append(" ");
                } else if (inInternships && trimmed.length() > 5) {
                    if (currentInternship.length() > 200) {
                        internships.add(InternshipDto.builder().role("Extracted Internship").company("Unknown").description(currentInternship.toString().trim()).build());
                        currentInternship = new StringBuilder();
                    }
                    currentInternship.append(trimmed).append(" ");
                } else if (!inProjects && !inInternships && trimmed.length() > 20 && count < 3) {
                    aboutBuilder.append(trimmed).append(" ");
                    count++;
                }
            }

            if (currentProject.length() > 0) {
                projects.add(ProjectDto.builder().name("Extracted Project").description(currentProject.toString().trim()).build());
            }
            if (currentInternship.length() > 0) {
                internships.add(InternshipDto.builder().role("Extracted Internship").company("Unknown").description(currentInternship.toString().trim()).build());
            }

            dto.setProjects(projects);
            dto.setInternships(internships);

            if (aboutBuilder.length() > 0) {
                dto.setAbout(aboutBuilder.toString().trim());
            }

            return dto;
        }
    }
}
