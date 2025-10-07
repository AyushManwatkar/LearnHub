package com.learnhub.backend.service;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.Playlist;
import com.google.api.services.youtube.model.PlaylistItem;
import com.google.api.services.youtube.model.PlaylistItemListResponse;
import com.google.api.services.youtube.model.PlaylistListResponse;
import com.google.api.services.youtube.model.SearchListResponse;
import com.learnhub.backend.dto.CourseResponseDTO;
import com.learnhub.backend.model.Course;
import com.learnhub.backend.model.User;
import com.learnhub.backend.model.VideoProgress;
import com.learnhub.backend.repository.CourseRepository;
import com.learnhub.backend.repository.UserRepository;
import com.learnhub.backend.repository.VideoProgressRepository;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final VideoProgressRepository videoProgressRepository;
    private final YouTube youtube;

    //forbidden keywords
    private static final Set<String> FORBIDDEN_KEYWORDS = Set.of(
        "gaming", "livestream", "vlog", "prank", "entertainment", "music video", "reaction"
    );

    @Value("${youtube.api.key}")
    private String apiKey;

    @Autowired
    public CourseService(CourseRepository courseRepository, UserRepository userRepository, VideoProgressRepository videoProgressRepository) throws Exception {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.videoProgressRepository = videoProgressRepository;
        this.youtube = new YouTube.Builder(
            GoogleNetHttpTransport.newTrustedTransport(),
            GsonFactory.getDefaultInstance(),
            null)
            .setApplicationName("LearnHub")
            .build();
    }

    public Course addCourse(String playlistId, Long userId) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        YouTube.Playlists.List request = youtube.playlists()
                .list(Collections.singletonList("snippet"));
        PlaylistListResponse response = request.setKey(apiKey).setId(Collections.singletonList(playlistId)).execute();

        if (response.getItems().isEmpty()) {
            throw new RuntimeException("YouTube Playlist not found with id: " + playlistId);
        }

        Playlist playlist = response.getItems().get(0);
        String title = playlist.getSnippet().getTitle();
        String description = playlist.getSnippet().getDescription();

        String contentToCheck = (title + " " + description).toLowerCase();
        for (String keyword : FORBIDDEN_KEYWORDS) {
            if (contentToCheck.contains(keyword)) {
                throw new IllegalArgumentException("Playlist contains forbidden content: '" + keyword + "'");
            }
        }

        Course newCourse = new Course();
        newCourse.setYoutubePlaylistId(playlistId);
        newCourse.setTitle(title);
        newCourse.setDescription(description);
        newCourse.setUser(user);

        return courseRepository.save(newCourse);
    }

    public List<Course> searchPlaylists(String query) throws Exception {
    YouTube.Search.List request = youtube.search()
            .list(Collections.singletonList("snippet"));
    SearchListResponse response = request.setKey(apiKey)
            .setQ(query)
            .setType(Collections.singletonList("playlist"))
            .setMaxResults(10L) //10 results --> can be changed later
            .execute();

    return response.getItems().stream()
        .map(item -> {
            Course course = new Course();
            course.setYoutubePlaylistId(item.getId().getPlaylistId());
            course.setTitle(item.getSnippet().getTitle());
            course.setDescription(item.getSnippet().getDescription());
            //thumbnails: item.getSnippet().getThumbnails().getDefault().getUrl()
            return course;
        })
        .collect(Collectors.toList());
    }

    public VideoProgress toggleVideoProgress(Long userId, Long courseId, String videoId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));
        VideoProgress progress = videoProgressRepository.findByUserIdAndCourseIdAndVideoId(userId, courseId, videoId)
            .orElse(new VideoProgress());

        progress.setUser(user);
        progress.setCourse(course);
        progress.setVideoId(videoId);
        progress.setCompleted(!progress.isCompleted());

        return videoProgressRepository.save(progress);
    }

    public Course getCourseById(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
    }

    public List<CourseResponseDTO> getCoursesForUser(Long userId) {
        List<Course> courses = courseRepository.findByUserId(userId);

        return courses.stream().map(course -> {
            int completionPercentage = 0;
            try {
                PlaylistItemListResponse response = youtube.playlistItems()
                        .list(Collections.singletonList("id"))
                        .setPlaylistId(course.getYoutubePlaylistId())
                        .setMaxResults(50L)
                        .setKey(apiKey)
                        .execute();

                long totalVideos = response.getItems().size();

                long completedVideos = videoProgressRepository.countByUserIdAndCourseIdAndCompleted(userId, course.getId(), true);

                if (totalVideos > 0) {
                    completionPercentage = (int) (((double) completedVideos / totalVideos) * 100);
                }

            } catch (Exception e) {
                //e.printStackTrace();
            }
            return new CourseResponseDTO(course, completionPercentage);
        }).collect(Collectors.toList());
    }

    public List<PlaylistItem> getPlaylistVideos(String playlistId) throws Exception {
        YouTube.PlaylistItems.List request = youtube.playlistItems()
                .list(Collections.singletonList("snippet,contentDetails"));

        PlaylistItemListResponse response = request.setKey(apiKey)
                .setPlaylistId(playlistId)
                .setMaxResults(50L)
                .execute();

        return response.getItems();
    }

    public void deleteCourse(Long courseId, Long userId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));

        if (!course.getUser().getId().equals(userId)) {
            throw new RuntimeException("User does not have permission to delete this course");
        }
        videoProgressRepository.deleteByCourseId(courseId);
        courseRepository.deleteById(courseId);
    }

    public List<VideoProgress> getCourseProgress(Long userId, Long courseId) {
        return videoProgressRepository.findByUserIdAndCourseId(userId, courseId);
    }
}