import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Notes from '../components/Notes'

export default function VideoPlayerPage(){
  const { id } = useParams()
  const [notes, setNotes] = useState([])
  useEffect(()=>{
    setNotes([{id:1,timestamp:10,content:'Note at 0:10'},{id:2,timestamp:120,content:'Note at 2:00'}])
  },[id])

  function getEmbedUrl(vid){
    return `https://www.youtube-nocookie.com/embed/${vid}?rel=0&modestbranding=1&controls=1`;
  }

  return (
    <div>
      <Navbar />
      <main className="p-6 max-w-6xl mx-auto grid grid-cols-4 gap-6">
        <section className="col-span-3">
          <div className="card aspect-video mb-4">
            <iframe title="player" src={getEmbedUrl(id)} className="w-full h-full rounded" allowFullScreen></iframe>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">Take a note</h3>
            <p className="text-sm text-gray-600 mb-2">Use the Notes panel to save timestamped notes (manual entry for MVP).</p>
            <Link to="/mycourses" className="text-indigo-600">Back to course</Link>
          </div>
        </section>
        <aside className="col-span-1 space-y-4">
          <Notes notes={notes} />
          <div className="card">
            <h3 className="font-semibold mb-2">Next in Queue</h3>
            <ul className="space-y-2">
              <li className="p-2 border rounded">Next video 1</li>
              <li className="p-2 border rounded">Next video 2</li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  )
}
