import React from "react"
export default function VideoCard({video, onOpen}){
  return (
    <div className="p-3 border rounded flex items-center gap-3">
      <img src={video.thumbnail} alt="" className="w-40 h-24 object-cover rounded" />
      <div className="flex-1">
        <div className="font-semibold">{video.title}</div>
        <div className="text-sm text-gray-600">{video.description}</div>
      </div>
      <div>
        <button onClick={onOpen} className="px-3 py-1 bg-indigo-600 text-white rounded">Play</button>
      </div>
    </div>
  )
}
