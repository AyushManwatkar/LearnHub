package com.learnhub.backend.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.api.services.youtube.model.PlaylistItem;
import com.learnhub.backend.dto.AddCourseRequest;
import com.learnhub.backend.dto.CourseResponseDTO;
import com.learnhub.backend.model.Course;
import com.learnhub.backend.model.User;
import com.learnhub.backend.model.VideoProgress;
import com.learnhub.backend.repository.UserRepository;
import com.learnhub.backend.service.CourseService;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private UserRepository userRepository;

    private User getUserByPrincipal(Principal principal) {
        String email = principal.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    // --- MAPPINGS ---

    // Specific path must come before the dynamic path
    @GetMapping("/search")
    public ResponseEntity<List<Course>> searchYouTube(@RequestParam String query) {
        try {
            List<Course> searchResults = courseService.searchPlaylists(query);
            return ResponseEntity.ok(searchResults);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<CourseResponseDTO>> getUserCourses(Principal principal) {
        User user = getUserByPrincipal(principal);
        List<CourseResponseDTO> courses = courseService.getCoursesForUser(user.getId());
        return ResponseEntity.ok(courses);
    }

    @PostMapping
    public ResponseEntity<?> addCourse(@RequestBody AddCourseRequest request, Principal principal) {
        try {
            User user = getUserByPrincipal(principal);
            Course newCourse = courseService.addCourse(request.playlistId(), user.getId());
            return ResponseEntity.ok(newCourse);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // Dynamic path /{courseId} comes after more specific paths
    @GetMapping("/{courseId}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long courseId) {
        try {
            Course course = courseService.getCourseById(courseId);
            return ResponseEntity.ok(course);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{courseId}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long courseId, Principal principal) {
        try {
            User user = getUserByPrincipal(principal);
            courseService.deleteCourse(courseId, user.getId());
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{courseId}/videos")
    public ResponseEntity<List<PlaylistItem>> getCourseVideos(@PathVariable Long courseId) {
        try {
            Course course = courseService.getCourseById(courseId);
            List<PlaylistItem> videos = courseService.getPlaylistVideos(course.getYoutubePlaylistId());
            return ResponseEntity.ok(videos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{courseId}/progress")
    public ResponseEntity<List<VideoProgress>> getCourseProgress(@PathVariable Long courseId, Principal principal) {
        User user = getUserByPrincipal(principal);
        List<VideoProgress> progress = courseService.getCourseProgress(user.getId(), courseId);
        return ResponseEntity.ok(progress);
    }

    @PostMapping("/{courseId}/progress/{videoId}")
    public ResponseEntity<VideoProgress> markVideoAsComplete(@PathVariable Long courseId, @PathVariable String videoId, Principal principal) {
        try {
            User user = getUserByPrincipal(principal);
            VideoProgress updatedProgress = courseService.toggleVideoProgress(user.getId(), courseId, videoId);
            return ResponseEntity.ok(updatedProgress);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}