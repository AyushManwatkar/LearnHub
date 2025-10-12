"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navGroup}>
        <Link href="/" className={styles.brand}>LearnHub</Link>
        {currentUser && (
          <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
        )}
      </div>

      <div className={`${styles.navGroup} ${styles.authControls}`}>
        {currentUser ? (
          <>
            <span>Welcome, {currentUser.sub}</span>
            <button onClick={logout} className={styles.button}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className={styles.navLink}>Login</Link>
            <Link href="/register" className={`${styles.button} ${styles.primaryButton}`}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}