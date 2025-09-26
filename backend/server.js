// server.js - Express backend for videos
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './db.js';

const app = express();
// Delete a video by id
app.delete('/api/videos/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM videos WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Video not found.' });
    }
    res.json({ success: true });
  });
});
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Get all videos
app.get('/api/videos', (req, res) => {
  db.all('SELECT * FROM videos ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Add a new video
app.post('/api/videos', (req, res) => {
  const { title, url } = req.body;
  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required.' });
  }
  db.run('INSERT INTO videos (title, url) VALUES (?, ?)', [title, url], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, title, url });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
