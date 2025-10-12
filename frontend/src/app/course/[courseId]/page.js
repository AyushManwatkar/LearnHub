"use client";

import { useEffect, useState, use } from 'react';
import api from '@/api/axios';
import Link from 'next/link';
import styles from './CourseDetail.module.css';

export default function CourseDetailPage({ params }) {
  const { courseId } = use(params);
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [completedVideos, setCompletedVideos] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      setIsLoading(true);
      Promise.all([
        api.get(`/api/courses/${courseId}`),
        api.get(`/api/courses/${courseId}/videos`),
        api.get(`/api/courses/${courseId}/progress`)
      ]).then(([courseRes, videosRes, progressRes]) => {
        setCourse(courseRes.data);
        setVideos(videosRes.data);
        const completedIds = new Set(progressRes.data.filter(p => p.completed).map(p => p.videoId));
        setCompletedVideos(completedIds);
        setIsLoading(false);
      }).catch(error => {
        console.error("Failed to fetch course data:", error);
        setIsLoading(false);
      });
    }
  }, [courseId]);

  const handleToggleComplete = async (event, videoId) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await api.post(`/api/courses/${courseId}/progress/${videoId}`);
      setCompletedVideos(prev => {
        const newSet = new Set(prev);
        if (newSet.has(videoId)) newSet.delete(videoId);
        else newSet.add(videoId);
        return newSet;
      });
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };

  if (isLoading) return <p style={{textAlign: 'center', marginTop: '2rem'}}>Loading course...</p>;
  if (!course) return <p style={{textAlign: 'center', marginTop: '2rem'}}>Course not found.</p>;

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>{course.title}</h1>
      <p className={styles.description}>{course.description}</p>
      
      <div className={styles.videoList}>
        {videos.map(video => {
          const videoId = video.snippet.resourceId.videoId;
          const isCompleted = completedVideos.has(videoId);
          return (
            <Link href={`/course/${courseId}/video/${videoId}`} key={videoId} className={styles.videoCard}>
              <div className={styles.videoInfo}>
                <img src={video.snippet.thumbnails.default.url} alt={video.snippet.title} className={styles.thumbnail} />
                <h3 className={styles.videoTitle}>{video.snippet.title}</h3>
              </div>
              <button 
                onClick={(e) => handleToggleComplete(e, videoId)}
                className={`${styles.button} ${isCompleted ? styles.completeButton : styles.incompleteButton}`}
              >
                {isCompleted ? '✓ Completed' : 'Mark as Complete'}
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}