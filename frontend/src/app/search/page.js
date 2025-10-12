"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/api/axios';
import { useAuth } from '@/context/AuthContext';
import styles from '@/styles/Card.module.css';

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentUser } = useAuth();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (query) {
      setIsLoading(true);
      api.get(`/api/courses/search?query=${query}`)
        .then(response => {
          setResults(response.data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Failed to fetch search results:", error);
          setIsLoading(false);
        });
    }
  }, [query]);

  const handleAddCourse = async (playlistId) => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    try {
      await api.post('/api/courses', { playlistId });
      setMessage(`Course added successfully!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "This course is not allowed or may already be in your library.";
      setMessage(`Error: ${errorMessage}`);
    }
  };

  if (isLoading) {
    return <p style={{textAlign: 'center', marginTop: '2rem'}}>Loading search results...</p>;
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Search Results for "{query}"</h1>
      {message && <p style={{textAlign: 'center', marginBottom: '1rem', color: message.startsWith('Error') ? '#d93025' : '#067d21'}}>{message}</p>}
      <div className={styles.cardList}>
        {results.length > 0 ? (
          results.map(playlist => (
            <div key={playlist.youtubePlaylistId} className={styles.card}>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{playlist.title}</h3>
                <p>{playlist.description.substring(0, 200)}...</p>
              </div>
              <button 
                onClick={() => handleAddCourse(playlist.youtubePlaylistId)}
                className={`${styles.button} ${styles.addButton}`}
              >
                + Add Course
              </button>
            </div>
          ))
        ) : (
          <p>No results found for your search.</p>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  )
}