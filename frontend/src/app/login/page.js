"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/axios';
import styles from '@/styles/Form.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await api.post('/api/auth/login', { email, password });
      login(response.data.token);
      router.push('/dashboard');
    } catch (err) {
      console.error('Login failed!', err);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>Welcome Back</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} required />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input} required />
        </div>
        <button type="submit" className={styles.button}>Login</button>
      </form>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}