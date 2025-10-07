package com.learnhub.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import com.learnhub.backend.model.VideoProgress;

public interface VideoProgressRepository extends JpaRepository<VideoProgress, Long> {
    Optional<VideoProgress> findByUserIdAndCourseIdAndVideoId(Long userId, Long courseId, String videoId);

    @Transactional
    void deleteByCourseId(Long courseId);

    long countByUserIdAndCourseIdAndCompleted(Long userId, Long courseId, boolean completed);

    List<VideoProgress> findByUserIdAndCourseId(Long userId, Long courseId);
}