package com.learnhub.backend.controller;

import java.security.Principal;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.learnhub.backend.model.Note;
import com.learnhub.backend.model.User;
import com.learnhub.backend.repository.UserRepository;
import com.learnhub.backend.service.NoteService;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @Autowired
    private UserRepository userRepository; // Inject UserRepository

    private User getUserByPrincipal(Principal principal) {
        String email = principal.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    @GetMapping
    public ResponseEntity<Note> getNote(@RequestParam String videoId, Principal principal) {
        User user = getUserByPrincipal(principal); // Get the real user
        Note note = noteService.getNoteForVideo(user.getId(), videoId);
        return ResponseEntity.ok(note);
    }

    @PostMapping
    public ResponseEntity<Note> saveNote(@RequestBody Map<String, String> payload, Principal principal) {
        User user = getUserByPrincipal(principal); // Get the real user
        String videoId = payload.get("videoId");
        String content = payload.get("content");

        Note savedNote = noteService.saveNote(user.getId(), videoId, content);
        return ResponseEntity.ok(savedNote);
    }
}