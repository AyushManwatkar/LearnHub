package com.learnhub.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.learnhub.backend.model.Note;
import com.learnhub.backend.model.User;
import com.learnhub.backend.repository.NoteRepository;
import com.learnhub.backend.repository.UserRepository; // 1. Add this import

@Service
@Transactional // 2. Add this annotation to the class
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;
    @Autowired
    private UserRepository userRepository;

    public Note getNoteForVideo(Long userId, String videoId) {
        return noteRepository.findByUserIdAndVideoId(userId, videoId).orElse(null);
    }

    public Note saveNote(Long userId, String videoId, String content) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Note note = noteRepository.findByUserIdAndVideoId(userId, videoId)
                .orElse(new Note());

        note.setUser(user);
        note.setVideoId(videoId);
        note.setContent(content);

        return noteRepository.save(note);
    }
}