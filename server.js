const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from current directory
app.use(express.static(__dirname));

const DB_PATH = path.join(__dirname, 'db.json');

// Helper to read database
function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return [];
    }
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading DB:', error);
    return [];
  }
}

// Helper to write database
function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing DB:', error);
    return false;
  }
}

// Helper to estimate reading time
function calculateReadTime(htmlContent) {
  if (!htmlContent) return '1 min read';
  // Strip HTML tags to get pure text
  const cleanText = htmlContent.replace(/<[^>]*>/g, ' ').trim();
  const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;
  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  return `${minutes} min read`;
}

// Endpoints
app.get('/api/articles', (req, res) => {
  const articles = readDB();
  res.json(articles);
});

app.get('/api/articles/:id', (req, res) => {
  const articles = readDB();
  const article = articles.find(a => a.id === Number(req.params.id));
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }
  res.json(article);
});

app.post('/api/articles', (req, res) => {
  const articles = readDB();
  const { title, category, author, date, excerpt, content, img } = req.body;

  if (!title || !category || !author || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newId = articles.length > 0 ? Math.max(...articles.map(a => a.id)) + 1 : 100;
  
  // Calculate read time
  const read = calculateReadTime(content);

  const newArticle = {
    id: newId,
    title,
    category,
    author,
    date: date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    read,
    excerpt: excerpt || '',
    content,
    img: img || 'images/hero_banner.png'
  };

  articles.push(newArticle);
  if (writeDB(articles)) {
    res.status(201).json(newArticle);
  } else {
    res.status(500).json({ error: 'Failed to write to database' });
  }
});

app.put('/api/articles/:id', (req, res) => {
  const articles = readDB();
  const id = Number(req.params.id);
  const idx = articles.findIndex(a => a.id === id);

  if (idx === -1) {
    return res.status(404).json({ error: 'Article not found' });
  }

  const { title, category, author, date, excerpt, content, img } = req.body;

  if (!title || !category || !author || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Calculate read time
  const read = calculateReadTime(content);

  articles[idx] = {
    ...articles[idx],
    title,
    category,
    author,
    date: date || articles[idx].date,
    read,
    excerpt: excerpt || '',
    content,
    img: img || articles[idx].img || 'images/hero_banner.png'
  };

  if (writeDB(articles)) {
    res.json(articles[idx]);
  } else {
    res.status(500).json({ error: 'Failed to write to database' });
  }
});

app.delete('/api/articles/:id', (req, res) => {
  const articles = readDB();
  const id = Number(req.params.id);
  const filtered = articles.filter(a => a.id !== id);

  if (filtered.length === articles.length) {
    return res.status(404).json({ error: 'Article not found' });
  }

  if (writeDB(filtered)) {
    res.json({ message: 'Article deleted successfully' });
  } else {
    res.status(500).json({ error: 'Failed to write to database' });
  }
});

// Fallback to serve index.html for unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Proven Psychology Journal server is running on http://localhost:${PORT}`);
});
