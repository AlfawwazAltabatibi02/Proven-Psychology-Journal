const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

const DB_PATH = path.join(__dirname, 'db.json');
const IMAGES_DIR = path.join(__dirname, 'images');

// Ensure images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// ── DATABASE PERSISTENCE CONFIGURATION ──────────────────────────
const MONGODB_URI = process.env.MONGODB_URI;
let isMongoConnected = false;
let mongoConnectionError = null;

// ── MONGOOSE SCHEMAS & MODELS ────────────────────────────────────
const articleSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: String, required: true },
  read: { type: String, required: true },
  excerpt: { type: String, default: '' },
  content: { type: String, required: true },
  img: { type: String, default: 'images/hero_banner.png' }
}, { timestamps: true });

const Article = mongoose.model('Article', articleSchema);

const imageSchema = new mongoose.Schema({
  filename: { type: String, required: true, unique: true },
  contentType: { type: String, required: true },
  data: { type: Buffer, required: true }
}, { timestamps: true });

const Image = mongoose.model('Image', imageSchema);

// ── DATABASE ROUTING MIDDLEWARE ──────────────────────────────────
// Intercept uploaded images and serve from database if available
app.get('/images/:filename', async (req, res, next) => {
  const { filename } = req.params;
  
  if (isMongoConnected && filename.startsWith('upload_')) {
    try {
      const img = await Image.findOne({ filename });
      if (img) {
        res.contentType(img.contentType);
        return res.send(img.data);
      }
    } catch (err) {
      console.error('Error fetching image from MongoDB:', err);
    }
  }
  next();
});

// Serve static files from current directory
app.use(express.static(__dirname));

// Multer storage — save to /images with a timestamp filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, IMAGES_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `upload_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// Helper to read database (fallback mode)
function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) return [];
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading DB:', error);
    return [];
  }
}

// Helper to write database (fallback mode)
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
  const cleanText = htmlContent.replace(/<[^>]*>/g, ' ').trim();
  const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
}

// ── IMAGE UPLOAD ─────────────────────────────────
app.post('/api/upload', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  if (isMongoConnected) {
    try {
      const newImage = new Image({
        filename: req.file.filename,
        contentType: req.file.mimetype,
        data: fs.readFileSync(req.file.path)
      });
      await newImage.save();

      // Clean up temporary local file
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('Failed to delete temporary local file:', err);
      }

      const url = `images/${req.file.filename}`;
      res.json({ url });
    } catch (err) {
      console.error('Failed to save image to MongoDB:', err);
      res.status(500).json({ error: 'Failed to upload image to database' });
    }
  } else {
    const url = `images/${req.file.filename}`;
    res.json({ url });
  }
});

// ── HEALTH CHECK ─────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: isMongoConnected ? 'connected (MongoDB)' : 'fallback (local file-system)',
    hasUri: !!MONGODB_URI,
    error: mongoConnectionError ? mongoConnectionError.message : null,
    uptime: process.uptime()
  });
});

// ── ARTICLES ────────────────────────────────────
app.get('/api/articles', async (req, res) => {
  if (isMongoConnected) {
    try {
      const articles = await Article.find().sort({ id: 1 });
      res.json(articles);
    } catch (err) {
      console.error('Error reading articles from MongoDB:', err);
      res.status(500).json({ error: 'Failed to read articles database' });
    }
  } else {
    res.json(readDB());
  }
});

app.get('/api/articles/:id', async (req, res) => {
  const idNum = Number(req.params.id);
  if (isMongoConnected) {
    try {
      const article = await Article.findOne({ id: idNum });
      if (!article) return res.status(404).json({ error: 'Article not found' });
      res.json(article);
    } catch (err) {
      console.error('Error fetching article from MongoDB:', err);
      res.status(500).json({ error: 'Failed to fetch article' });
    }
  } else {
    const articles = readDB();
    const article = articles.find(a => a.id === idNum);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  }
});

app.post('/api/articles', async (req, res) => {
  const { title, category, author, date, excerpt, content, img } = req.body;
  if (!title || !category || !author || !content)
    return res.status(400).json({ error: 'Missing required fields' });

  const read = calculateReadTime(content);
  const finalDate = date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const finalImg = img || 'images/hero_banner.png';

  if (isMongoConnected) {
    try {
      const lastArticle = await Article.findOne().sort({ id: -1 });
      const newId = lastArticle ? lastArticle.id + 1 : 100;
      
      const newArticle = new Article({
        id: newId,
        title,
        category,
        author,
        date: finalDate,
        read,
        excerpt: excerpt || '',
        content,
        img: finalImg
      });
      await newArticle.save();
      res.status(201).json(newArticle);
    } catch (err) {
      console.error('Error creating article in MongoDB:', err);
      res.status(500).json({ error: 'Failed to save article to database' });
    }
  } else {
    const articles = readDB();
    const newId = articles.length > 0 ? Math.max(...articles.map(a => a.id)) + 1 : 100;
    const newArticle = {
      id: newId, title, category, author,
      date: finalDate,
      read, excerpt: excerpt || '', content,
      img: finalImg
    };

    articles.push(newArticle);
    if (writeDB(articles)) res.status(201).json(newArticle);
    else res.status(500).json({ error: 'Failed to write to database' });
  }
});

app.put('/api/articles/:id', async (req, res) => {
  const idNum = Number(req.params.id);
  const { title, category, author, date, excerpt, content, img } = req.body;
  if (!title || !category || !author || !content)
    return res.status(400).json({ error: 'Missing required fields' });

  const read = calculateReadTime(content);

  if (isMongoConnected) {
    try {
      const article = await Article.findOne({ id: idNum });
      if (!article) return res.status(404).json({ error: 'Article not found' });

      article.title = title;
      article.category = category;
      article.author = author;
      if (date) article.date = date;
      article.read = read;
      article.excerpt = excerpt || '';
      article.content = content;
      if (img) article.img = img;

      await article.save();
      res.json(article);
    } catch (err) {
      console.error('Error updating article in MongoDB:', err);
      res.status(500).json({ error: 'Failed to update article' });
    }
  } else {
    const articles = readDB();
    const idx = articles.findIndex(a => a.id === idNum);
    if (idx === -1) return res.status(404).json({ error: 'Article not found' });

    articles[idx] = {
      ...articles[idx], title, category, author,
      date: date || articles[idx].date,
      read, excerpt: excerpt || '', content,
      img: img || articles[idx].img || 'images/hero_banner.png'
    };

    if (writeDB(articles)) res.json(articles[idx]);
    else res.status(500).json({ error: 'Failed to write to database' });
  }
});

app.delete('/api/articles/:id', async (req, res) => {
  const idNum = Number(req.params.id);
  if (isMongoConnected) {
    try {
      const result = await Article.deleteOne({ id: idNum });
      if (result.deletedCount === 0)
        return res.status(404).json({ error: 'Article not found' });
      res.json({ message: 'Article deleted successfully' });
    } catch (err) {
      console.error('Error deleting article from MongoDB:', err);
      res.status(500).json({ error: 'Failed to delete article' });
    }
  } else {
    const articles = readDB();
    const filtered = articles.filter(a => a.id !== idNum);
    if (filtered.length === articles.length)
      return res.status(404).json({ error: 'Article not found' });
    if (writeDB(filtered)) res.json({ message: 'Article deleted successfully' });
    else res.status(500).json({ error: 'Failed to write to database' });
  }
});

// Fallback to serve index.html for unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ── SERVER STARTUP ───────────────────────────────────────────────
async function startServer() {
  if (MONGODB_URI) {
    try {
      console.log('Connecting to MongoDB Atlas...');
      await mongoose.connect(MONGODB_URI);
      isMongoConnected = true;
      console.log('Connected to MongoDB Atlas successfully.');
    } catch (err) {
      mongoConnectionError = err;
      console.error('Failed to connect to MongoDB Atlas:', err);
      console.log('Running in fallback file-system mode (db.json).');
    }
  } else {
    console.log('No MONGODB_URI set. Running in fallback file-system mode (db.json).');
  }

  app.listen(PORT, () => {
    console.log(`Proven Psychology Journal server is running on http://localhost:${PORT}`);
  });
}

startServer();
