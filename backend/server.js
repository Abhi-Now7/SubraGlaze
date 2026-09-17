import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup require for CommonJS files (like db.js)
const require = createRequire(import.meta.url);
const { readDB, writeDB } = require('./db.js');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

app.use(cors());
app.use(express.json());

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- API ROUTES ---

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const db = readDB();
    if (db.users.some(u => u.username === username || u.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: db.users.length + 1,
      username,
      email,
      password: hashedPassword,
      bio: '',
      website: '',
      twitter: '',
      github: '',
      created_at: new Date().toISOString()
    };
    db.users.push(user);
    writeDB(db);

    const token = jwt.sign({ id: user.id, username }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: { id: user.id, username, email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const db = readDB();
    const user = db.users.find(u => u.username === username);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user profile
app.get('/api/me', authenticateToken, (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.sendStatus(404);
  res.json({
    id: user.id, username: user.username, email: user.email,
    bio: user.bio || '', website: user.website || '',
    twitter: user.twitter || '', github: user.github || '',
    created_at: user.created_at
  });
});

// Update current user profile
app.put('/api/me', authenticateToken, (req, res) => {
  try {
    const { bio, website, twitter, github } = req.body;
    const db = readDB();
    const idx = db.users.findIndex(u => u.id === req.user.id);
    if (idx === -1) return res.sendStatus(404);

    db.users[idx].bio = bio !== undefined ? bio : db.users[idx].bio;
    db.users[idx].website = website !== undefined ? website : db.users[idx].website;
    db.users[idx].twitter = twitter !== undefined ? twitter : db.users[idx].twitter;
    db.users[idx].github = github !== undefined ? github : db.users[idx].github;
    writeDB(db);

    res.json(db.users[idx]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Blogs routes
app.get('/api/blogs', async (req, res) => {
  try {
    const db = readDB();
    const publishedBlogs = db.blogs.filter(b => b.status === 'published');
    res.json(publishedBlogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/blogs/:id', authenticateToken, async (req, res) => {
  try {
    const db = readDB();
    const blog = db.blogs.find(b => b.id === parseInt(req.params.id));
    if (!blog) return res.sendStatus(404);
    // Allow viewing own drafts or any published
    if (blog.status === 'published' || blog.user_id === req.user.id) {
      res.json(blog);
    } else {
      res.sendStatus(403);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/blogs', authenticateToken, async (req, res) => {
  try {
    const { title, content, status = 'draft' } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const db = readDB();
    const blog = {
      id: db.blogs.length + 1,
      title,
      content,
      status,
      user_id: req.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.blogs.push(blog);
    writeDB(db);

    res.status(201).json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/blogs/:id', authenticateToken, async (req, res) => {
  try {
    const { title, content, status } = req.body;
    const db = readDB();
    const idx = db.blogs.findIndex(b => b.id === parseInt(req.params.id));
    if (idx === -1) return res.sendStatus(404);

    // Only allow owner to update
    if (db.blogs[idx].user_id !== req.user.id) {
      return res.sendStatus(403);
    }

    db.blogs[idx] = {
      ...db.blogs[idx],
      title: title !== undefined ? title : db.blogs[idx].title,
      content: content !== undefined ? content : db.blogs[idx].content,
      status: status !== undefined ? status : db.blogs[idx].status,
      updated_at: new Date().toISOString()
    };
    writeDB(db);

    res.json(db.blogs[idx]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/blogs/:id', authenticateToken, async (req, res) => {
  try {
    const db = readDB();
    const idx = db.blogs.findIndex(b => b.id === parseInt(req.params.id));
    if (idx === -1) return res.sendStatus(404);

    // Only allow owner to delete
    if (db.blogs[idx].user_id !== req.user.id) {
      return res.sendStatus(403);
    }

    db.blogs.splice(idx, 1);
    writeDB(db);

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get my blogs
app.get('/api/my-blogs', authenticateToken, async (req, res) => {
  try {
    const db = readDB();
    const myBlogs = db.blogs.filter(b => b.user_id === req.user.id);
    res.json(myBlogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Subscribe routes (simplified)
app.post('/api/subscribe', authenticateToken, async (req, res) => {
  try {
    const db = readDB();
    const userIdx = db.users.findIndex(u => u.id === req.user.id);
    if (userIdx === -1) return res.sendStatus(404);

    // In a real app, you'd have a subscriptions collection
    // For now, just acknowledge
    res.json({ message: 'Subscribed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/subscribers/count', async (req, res) => {
  try {
    const db = readDB();
    // Count users with non-empty twitter/github as proxy? Or just total users
    const count = db.users.length;
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- STATIC FILES (FRONTEND) ---
// Note: We go up one level (..) to find frontend directory from backend
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// Catch-all route to serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});