package com.learnhub.backend.dto;

import com.learnhub.backend.model.Course;

import lombok.Data;

@Data
public class CourseResponseDTO {
    private Course course;
    private int completionPercentage;

    public CourseResponseDTO(Course course, int completionPercentage) {
        this.course = course;
        this.completionPercentage = completionPercentage;
    }
}