const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { readDB, writeDB } = require('./db');

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

// Get current user profile (protected)
app.get('/api/me', authenticateToken, (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.sendStatus(404);
  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    bio: user.bio || '',
    website: user.website || '',
    twitter: user.twitter || '',
    github: user.github || '',
    created_at: user.created_at
  });
});

// Update current user profile (protected)
app.put('/api/me', authenticateToken, (req, res) => {
  try {
    const { bio, website, twitter, github } = req.body;
    const db = readDB();
    const idx = db.users.findIndex(u => u.id === req.user.id);
    if (idx === -1) return res.sendStatus(404);

    if (bio !== undefined) db.users[idx].bio = bio;
    if (website !== undefined) db.users[idx].website = website;
    if (twitter !== undefined) db.users[idx].twitter = twitter;
    if (github !== undefined) db.users[idx].github = github;
    writeDB(db);

    const user = db.users[idx];
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio || '',
      website: user.website || '',
      twitter: user.twitter || '',
      github: user.github || ''
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Subscribe to newsletter (public)
app.post('/api/subscribe', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const db = readDB();
    if (db.subscribers.some(s => s.email === email)) {
      return res.status(400).json({ message: 'Already subscribed' });
    }

    db.subscribers.push({
      email,
      subscribed_at: new Date().toISOString()
    });
    writeDB(db);
    res.status(201).json({ message: 'Subscribed successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get subscriber count (public)
app.get('/api/subscribers/count', (req, res) => {
  const db = readDB();
  res.json({ count: db.subscribers.length });
});

// Get all published blogs (public)
app.get('/api/blogs', (req, res) => {
  try {
    const db = readDB();
    const blogs = db.blogs
      .filter(b => b.status === 'published')
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map(blog => {
        const author = db.users.find(u => u.id === blog.user_id);
        return { ...blog, author_name: author ? author.username : 'Unknown' };
      });
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single blog by ID (public if published, private if user owns it)
app.get('/api/blogs/:id', authenticateToken, (req, res) => {
  try {
    const db = readDB();
    const blog = db.blogs.find(b => b.id === Number(req.params.id));

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const author = db.users.find(u => u.id === blog.user_id);

    if (blog.status === 'published' || blog.user_id === req.user.id) {
      res.json({ ...blog, author_name: author ? author.username : 'Unknown' });
    } else {
      res.status(403).json({ message: 'Not authorized' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new blog (protected)
app.post('/api/blogs', authenticateToken, (req, res) => {
  try {
    const { title, content, status = 'draft' } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content required' });
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

    const author = db.users.find(u => u.id === blog.user_id);
    res.status(201).json({ ...blog, author_name: author ? author.username : 'Unknown' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a blog (protected, owner only)
app.put('/api/blogs/:id', authenticateToken, (req, res) => {
  try {
    const { title, content, status } = req.body;
    const db = readDB();
    const idx = db.blogs.findIndex(b => b.id === Number(req.params.id));

    if (idx === -1) return res.status(404).json({ message: 'Blog not found' });
    if (db.blogs[idx].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (title !== undefined) db.blogs[idx].title = title;
    if (content !== undefined) db.blogs[idx].content = content;
    if (status !== undefined) db.blogs[idx].status = status;
    db.blogs[idx].updated_at = new Date().toISOString();
    writeDB(db);

    const author = db.users.find(u => u.id === db.blogs[idx].user_id);
    res.json({ ...db.blogs[idx], author_name: author ? author.username : 'Unknown' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a blog (protected, owner only)
app.delete('/api/blogs/:id', authenticateToken, (req, res) => {
  try {
    const db = readDB();
    const idx = db.blogs.findIndex(b => b.id === Number(req.params.id));

    if (idx === -1) return res.status(404).json({ message: 'Blog not found' });
    if (db.blogs[idx].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    db.blogs.splice(idx, 1);
    writeDB(db);
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's own blogs (protected)
app.get('/api/my-blogs', authenticateToken, (req, res) => {
  try {
    const db = readDB();
    const blogs = db.blogs
      .filter(b => b.user_id === req.user.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});