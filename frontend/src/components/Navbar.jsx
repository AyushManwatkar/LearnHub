import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar(){ 
  const { user, logout } = useAuth();
  return (
    <header className="header p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">LH</div>
        <div className="text-lg font-semibold">LearnHub</div>
      </div>
      <nav className="space-x-4 flex items-center">
        <Link to="/" className="text-sm">Home</Link>
        <Link to="/mycourses" className="text-sm">MyCourses</Link>
        {/* <Link to="/search" className="text-sm">Search</Link> */}
        {user ? (
          <>
            <span className="text-sm ml-2">Hi, {user.name || user.email}</span>
            <button onClick={logout} className="ml-3 text-sm px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm">Login</Link>
            <Link to="/register" className="text-sm">Register</Link>
          </>
        )}
      </nav>
    </header>
  )
}
