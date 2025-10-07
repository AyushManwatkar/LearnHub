"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/api/axios';
import styles from '@/styles/Form.module.css';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      await api.post('/api/auth/register', { username, email, password });
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      console.error('There was an error registering!', err);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>Create Account</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="username" className={styles.label}>Username</label>
          <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input} required />
        </div>
        <button type="submit" className={styles.button}>Register</button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}