import React, { useState, useEffect } from "react"
import axios from "axios"

export default function Notes({ videoId }) {
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(true)
  const [unauth, setUnauth] = useState(false)

  // get token from localStorage
  const token = localStorage.getItem("token")

  // load note when video changes
  useEffect(() => {
    if (!videoId) return
    setLoading(true)

    axios.get(`/api/notes/${videoId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        setNote(res.data?.content || "")
        setUnauth(false)
        setLoading(false)
      })
      .catch(err => {
        if (err?.response?.status === 401) setUnauth(true)
        setLoading(false)
      })
  }, [videoId])

  const handleSave = async () => {
    try {
      await axios.post("/api/notes",
        {
          video_id: videoId,
          content: note
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      alert("Note saved ✅")
    } catch (err) {
      if (err?.response?.status === 401) setUnauth(true)
      console.error("Error saving note:", err)
    }
  }

  if (loading) return <div>Loading note...</div>

  return (
    <div className="card p-4 border rounded-lg shadow-sm">
      <h3 className="font-semibold mb-3 text-lg">My Notes</h3>
      {unauth && <div className="mb-2 text-sm text-red-600">Please log in to write notes</div>}
      <textarea
        className="w-full border rounded p-2 text-sm min-h-[150px]"
        placeholder="Write your collective note here..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        disabled={unauth}
      />
      <button
        onClick={handleSave}
        disabled={unauth}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
      >
        Save Note
      </button>
    </div>
  )
}
