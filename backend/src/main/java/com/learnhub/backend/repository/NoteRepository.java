package com.learnhub.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.learnhub.backend.model.Note;

public interface NoteRepository extends JpaRepository<Note, Long> {
    Optional<Note> findByUserIdAndVideoId(Long userId, String videoId);
}