"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/api/axios';
import styles from '@/styles/Card.module.css';

export default function DashboardPage() {
  const [courses, setCourses] = useState([]);
  const { currentUser } = useAuth();
  const router = useRouter();

  const fetchCourses = async () => {
    try {
      const response = await api.get('/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    } else {
      fetchCourses();
    }
  }, [currentUser, router]);

  const handleDelete = async (event, courseId) => {
    event.preventDefault();
    event.stopPropagation();
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await api.delete(`/api/courses/${courseId}`);
        fetchCourses();
      } catch (error) {
        console.error("Failed to delete course:", error);
        alert("Could not delete the course.");
      }
    }
  };
  
  if (!currentUser) return null; 

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>My Courses</h1>
      
      {courses.length > 0 ? (
        <div className={styles.cardList}>
          {courses.map(courseData => (
            <Link href={`/course/${courseData.course.id}`} key={courseData.course.id} className={styles.card}>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{courseData.course.title}</h3>
                <div className={styles.progressBarContainer}>
                  <div className="flex justify-between mb-1">
                    <span style={{fontSize: '0.8rem', fontWeight: '500', color: '#5624d0'}}>Progress</span>
                    <span style={{fontSize: '0.8rem', fontWeight: '500', color: '#5624d0'}}>{courseData.completionPercentage}%</span>
                  </div>
                  <div className={styles.progressBarTrack}>
                    <div className={styles.progressBarFill} style={{ width: `${courseData.completionPercentage}%` }}></div>
                  </div>
                </div>
              </div>
              <button 
                onClick={(e) => handleDelete(e, courseData.course.id)}
                className={`${styles.button} ${styles.deleteButton}`}
              >
                Delete
              </button>
            </Link>
          ))}
        </div>
      ) : (
        <div style={{textAlign: 'center', padding: '2rem', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #d1d7dc'}}>
          <p>You haven't added any courses yet. Go to the homepage to search for courses to add!</p>
        </div>
      )}
    </div>
  );
}