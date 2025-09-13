import React from 'react'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import CourseCard from '../components/CourseCard'
import axios from 'axios'

export default function MyCourses(){
  const [courses, setCourses] = useState([])
  useEffect(()=>{
    axios.get('/api/courses').then(r=>{
      setCourses((r.data || []).map((c,i)=>({...c, progress: (i+1)*20})))
    }).catch(()=>{
      setCourses([{id:1,title:'React Basics',thumbnail:'https://picsum.photos/seed/react/600/400',progress:50},{id:2,title:'Node.js Mastery',thumbnail:'https://picsum.photos/seed/node/600/400',progress:20}])
    })
  },[])
  return (
    <div>
      <Navbar />
      <main className="p-6 max-w-6xl mx-auto grid grid-cols-3 gap-6">
        {courses.map(c=> <CourseCard key={c.id} course={c} />)}
      </main>
    </div>
  )
}
