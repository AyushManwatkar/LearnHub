import React from 'react'
import { Link } from 'react-router-dom'

export default function CourseCard({course}){
  return (
    <div className="card">
      <img src={course.thumbnail} alt="" className="w-full h-40 object-cover rounded-md mb-3" />
      <div className="font-semibold">{course.title}</div>
      <div className="w-full bg-gray-200 h-2 rounded mt-2">
        <div style={{width: course.progress + '%'}} className="bg-green-500 h-2 rounded"></div>
      </div>
      <Link to={'/course/' + course.id} className="mt-3 inline-block text-indigo-600">Open Course</Link>
    </div>
  )
}
