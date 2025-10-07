"use client";

import { useEffect, useState, use } from 'react';
import api from '@/api/axios'; // ✅ CORRECT: Import our custom api client
import Link from 'next/link';
import dynamic from 'next/dynamic';

const YouTubePlayer = dynamic(() => import('@/components/YouTubePlayer'), { ssr: false });

export default function VideoPlayerPage({ params }) {
  const { courseId, videoId } = use(params);
  const [noteContent, setNoteContent] = useState('');
  const [message, setMessage] = useState('');
  const [courseVideos, setCourseVideos] = useState([]);
  const [currentVideoTitle, setCurrentVideoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (videoId && courseId) {
      setIsLoading(true);
      setNoteContent(''); // Clear previous note while loading
      Promise.all([
        api.get(`/api/courses/${courseId}/videos`), // Use api
        api.get(`/api/notes?videoId=${videoId}`)     // Use api
      ]).then(([videosRes, noteRes]) => {
        setCourseVideos(videosRes.data);
        const currentVideo = videosRes.data.find(v => v.snippet.resourceId.videoId === videoId);
        if (currentVideo) setCurrentVideoTitle(currentVideo.snippet.title);
        if (noteRes.data && noteRes.data.content) {
          setNoteContent(noteRes.data.content);
        }
        setIsLoading(false);
      }).catch(error => {
        console.error("Failed to load video data:", error);
        setIsLoading(false);
      });
    }
  }, [courseId, videoId]);

  const handleSaveNote = async () => {
    try {
      await api.post('/api/notes', { videoId, content: noteContent }); // Use api
      setMessage('Note saved!');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      console.error("Failed to save note:", error);
      setMessage('Failed to save.');
    }
  };
  
  if (isLoading) return <p style={{textAlign: 'center', marginTop: '2rem'}}>Loading Player...</p>;

  // Your JSX remains the same, but I'm including it for completeness
  return (
    // ... your full JSX layout for the video player ...
    <div style={{ maxWidth: '1200px', margin: '2rem auto', display: 'flex', gap: '2rem' }}>
      <div style={{ width: '67%' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>{currentVideoTitle}</h1>
        <YouTubePlayer videoId={videoId} />
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>My Notes</h2>
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            style={{ width: '100%', height: '200px', border: '1px solid #ccc', padding: '0.5rem', borderRadius: '4px' }}
            placeholder="Write your notes for this video here..."
          ></textarea>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '1rem' }}>
            {message && <span style={{color: '#067d21', marginRight: '1rem'}}>{message}</span>}
            <button
              onClick={handleSaveNote}
              style={{ padding: '0.6rem 1.2rem', border: 'none', borderRadius: '4px', backgroundColor: '#5624d0', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
      <div style={{ width: '33%' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Video Queue</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {courseVideos.map(video => (
            <Link href={`/course/${courseId}/video/${video.snippet.resourceId.videoId}`} key={video.id} style={{textDecoration: 'none', color: 'inherit'}}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', borderRadius: '4px', backgroundColor: video.snippet.resourceId.videoId === videoId ? '#e8e0f8' : 'transparent' }}>
                <img src={video.snippet.thumbnails.default.url} alt={video.snippet.title} style={{ width: '100px', height: '56px', objectFit: 'cover', borderRadius: '4px' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{video.snippet.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}