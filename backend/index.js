require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// Init DB
initDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/youtube', require('./routes/youtube'));
app.use('/api/playlists', require('./routes/playlists'));
app.use('/api/notes', require('./routes/notes'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`LearnHub backend running on port ${PORT}`);
});
