import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import SearchResults from './pages/SearchResults'
import MyCourses from './pages/MyCourses'
import CourseDetail from './pages/CourseDetail'
import VideoPlayerPage from './pages/VideoPlayerPage'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/search' element={<SearchResults />} />
      <Route path='/mycourses' element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
      <Route path='/course/:id' element={<CourseDetail />} />
      <Route path='/video/:id' element={<VideoPlayerPage />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  )
}

export default App
