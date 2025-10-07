"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './HomePage.module.css';

export default function Home() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (event) => {
    event.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${query}`);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Online Learning Platform
      </h1>
      <p className={styles.subtitle}>
        Find and organize the best educational content from YouTube, distraction-free.
      </p>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <div className={styles.searchBox}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
            placeholder="Search for a topic..."
          />
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </div>
      </form>
    </div>
  );
}