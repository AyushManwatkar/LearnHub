import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  const [q, setQ] = useState("");
  const nav = useNavigate();

  function doSearch(e) {
    e.preventDefault();
    nav("/search?q=" + encodeURIComponent(q));
  }

  return (
    <div>
      <Navbar />
      <main className="p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">LearnHub</h1>
          <p className="text-gray-600 mb-6">
            A distraction-free learning experience using curated video courses.
          </p>
          <form onSubmit={doSearch} className="flex gap-2 justify-center">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="border p-3 rounded-l-lg w-2/3"
              placeholder="Search for courses or videos"
            />
            <button className="px-4 bg-indigo-600 text-white rounded-r-lg">
              Search
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
