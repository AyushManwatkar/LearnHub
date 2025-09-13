const express = require('express');
const axios = require('axios');

const router = express.Router();

// YouTube search
router.get('/search', async (req, res) => {
  const q = req.query.q || '';
  if (!q) return res.status(400).json({ error: 'Missing q parameter' });

  const key = process.env.YOUTUBE_API_KEY;
  const fallback = {
    items: [
      {
        id: { videoId: 'dQw4w9WgXcQ' },
        snippet: {
          title: 'Sample Video',
          description: 'Fallback video',
          thumbnails: {
            medium: {
              url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
            },
          },
        },
      },
    ],
  };

  if (!key) return res.json(fallback);

  try {
    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/search',
      {
        params: {
          part: 'snippet',
          q,
          type: 'video',             //only videos
          maxResults: 20,
          key,
          videoDuration: 'medium',   //avoid shorts & very long lectures
          eventType: 'completed',    //skip live streams
        },
      }
    );

    //Filter out unwanted keywords
    const blockedKeywords = [
      // Gaming / streaming
      "gaming", "gameplay", "lets play", "walkthrough", "playthrough",
      "stream", "livestream", "live","valorant","cs2","csgo","freefire","pubg",

      // Music / entertainment
      "music", "song", "album", "lyrics", "remix", "cover",
      "dance", "dj", "concert", "beats", "karaoke",

      // Short-form / non-educational formats
      "shorts", "tiktok", "reels", "meme", "funny", "prank",
      "compilation", "challenge", "trend", "viral",

      // Movies / shows / dramas
      "movie", "film", "trailer", "review", "reaction",
      "tv", "series", "episode", "drama", "anime",

      // Lifestyle / vlogs
      "vlog", "lifestyle", "haul", "unboxing", "shopping",
      "travel", "fitness", "workout", "makeup", "beauty",
      "fashion", "skincare",

      // Sports / non-educational hobbies
      "sports", "football", "cricket", "basketball",
      "nfl", "nba", "fifa", "wwe", "ufc", "nfl highlights",

      // Misc non-educational
      "comedy", "entertainment", "asmr", "relaxing", "sleep",
      "celebrity", "gossip", "drama alert", "news update"
    ];


    const filteredItems = (response.data.items || []).filter((item) => {
      const title = item.snippet?.title?.toLowerCase() || '';
      return !blockedKeywords.some((kw) => title.includes(kw));
    });

    res.json({ items: filteredItems });
  } catch (err) {
    console.error('YouTube API error:', err.response?.data || err.message);
    res.json(fallback);
  }
});

module.exports = router;
