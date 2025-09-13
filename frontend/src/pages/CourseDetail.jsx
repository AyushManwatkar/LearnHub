import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import VideoCard from '../components/VideoCard'
import Notes from '../components/Notes'
import axios from 'axios'

export default function CourseDetail(){
  const { id } = useParams()
  const [videos, setVideos] = useState([])
  const [selected, setSelected] = useState(null)
  const [notes, setNotes] = useState([])
  const nav = useNavigate()

  useEffect(()=>{
    axios.get('/api/courses/' + id + '/videos')
      .then(r => {
        console.log("API videos response:", r.data)
        if (Array.isArray(r.data)) {
          setVideos(r.data)
        } else if (Array.isArray(r.data.videos)) {
          setVideos(r.data.videos)
        } else {
          setVideos([])
        }
      })
      .catch(err=>{
        console.error("Error fetching videos:", err)
        setVideos([
          {
            id:'dQw4w9WgXcQ',
            video_id:'dQw4w9WgXcQ',
            title:'Sample Video 1',
            description:'desc',
            thumbnail:'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg'
          }
        ])
      })
  },[id])

  useEffect(()=>{ 
    if (selected) fetchNotes() 
  }, [selected])

  function openVideo(v){ 
    setSelected(v) 
    nav('/video/' + v.video_id) 
  }

  function fetchNotes(){
    setNotes([
      {id:1,timestamp:30,content:'Important concept at 0:30'}
    ])
  }

  return (
    <div>
      <Navbar />
      <main className="p-6 max-w-6xl mx-auto grid grid-cols-4 gap-6">
        <section className="col-span-3">
          <h2 className="text-2xl font-semibold mb-4">Course - {id}</h2>
          <div className="space-y-4">
            {Array.isArray(videos) && videos.length > 0 ? (
              videos.map(v => (
                <div key={v.id}>
                  <VideoCard 
                    video={{
                      thumbnail: v.thumbnail || 'https://picsum.photos/320/180',
                      title: v.title, 
                      description: v.description
                    }} 
                    onOpen={()=>openVideo(v)} 
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500">No videos available.</p>
            )}
          </div>
        </section>
        <aside className="col-span-1">
          <Notes notes={notes} />
        </aside>
      </main>
    </div>
  )
}
