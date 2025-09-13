const express = require("express")
const router = express.Router()
const { authMiddleware } = require("../middleware/auth")
const db = require("../config/db")

// Get note for a video
router.get("/:videoId", authMiddleware, (req, res) => {
  const { videoId } = req.params
  const userId = req.user.id

  db.get("SELECT content FROM notes WHERE video_id = ? AND user_id = ?", [videoId, userId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ content: row?.content || "" })
  })
})

// Save/update note
router.post("/", authMiddleware, (req, res) => {
  const { video_id, content } = req.body
  const userId = req.user.id

  db.run(
    `INSERT INTO notes (user_id, video_id, content) VALUES (?, ?, ?)
     ON CONFLICT(user_id, video_id) DO UPDATE SET content = ?`,
    [userId, video_id, content, content],
    (err) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ success: true })
    }
  )
})

module.exports = router
