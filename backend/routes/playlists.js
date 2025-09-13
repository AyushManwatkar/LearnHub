const express = require('express');
const { db } = require('../config/db');
const auth = require('../middleware/auth');

const router = express.Router();

// Create playlist
router.post('/', auth, (req, res) => {
  const { title } = req.body;
  db.run(`INSERT INTO playlists (user_id, title) VALUES (?, ?)`, [req.user.id, title], function(err) {
    if (err) return res.status(500).json({ error: 'Unable to create playlist' });
    res.json({ id: this.lastID, title });
  });
});

// Get playlists
router.get('/', auth, (req, res) => {
  db.all(`SELECT * FROM playlists WHERE user_id = ?`, [req.user.id], (err, rows) => {
    res.json(rows || []);
  });
});

// Add video to playlist
router.post('/:id/videos', auth, (req, res) => {
  const pid = req.params.id;
  const { videoId, title, description, thumbnails } = req.body;
  db.run(`INSERT INTO videos (playlist_id, video_id, title, description, thumbnails) VALUES (?, ?, ?, ?, ?)`,
    [pid, videoId, title, description, JSON.stringify(thumbnails || {})],
    function(err) {
      if (err) return res.status(500).json({ error: 'Unable to add video' });
      res.json({ id: this.lastID });
    });
});

// Get videos of a playlist
router.get('/:id/videos', auth, (req, res) => {
  const pid = req.params.id;
  db.all(`SELECT * FROM videos WHERE playlist_id = ?`, [pid], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Unable to fetch' });
    res.json(rows.map(r => ({ ...r, thumbnails: JSON.parse(r.thumbnails || '{}') })));
  });
});

module.exports = router;
