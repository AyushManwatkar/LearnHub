import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import VideoCard from '../components/VideoCard'
import axios from 'axios'
import React from 'react'

export default function SearchResults(){
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const [results, setResults] = useState([])
  const nav = useNavigate()

  useEffect(()=>{
    if (!q) return
    // call backend YouTube proxy
      axios.get('/api/youtube/search', { params: { q } })
      .then(r => setResults((r.data.items || []).map(it => {
        let isPlaylist = it.id.kind === "youtube#playlist";
        return {
          id: isPlaylist ? it.id.playlistId : (it.id.videoId || it.id),
          type: isPlaylist ? "playlist" : "video",
          title: it.snippet.title,
          description: it.snippet.description,
          thumbnail: it.snippet.thumbnails?.medium?.url || it.snippet.thumbnails?.default?.url
        }
      })))
      .catch((err)=>{
        console.error('Search error', err);
        setResults([
          { id: 'dQw4w9WgXcQ', title: 'Sample Video 1', description: 'Sample description', thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg' }
        ])
      })
  }, [q])

  return (
    <div>
      <Navbar />
      <main className="p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Search results for "{q}"</h2>
        <div className="space-y-4">
          {results.map(r=> <VideoCard key={r.id} video={{thumbnail: r.thumbnail, title: r.title, description: r.description}} onOpen={()=>nav('/video/' + r.id)} />)}
        </div>
      </main>
    </div>
  )
}
