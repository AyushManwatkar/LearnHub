package com.learnhub.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.learnhub.backend.model.Course;

public interface CourseRepository extends JpaRepository<Course, Long> {
    
    List<Course> findByUserId(Long userId);
}