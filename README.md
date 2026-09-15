# Inkwell: A Premium Blogging Platform

A full-stack blogging application where anyone can read everyone's published blogs, and logged-in users can create, edit, manage, and showcase their own content with a modern, professional interface ready for deployment and monetization.

## Live Demo (when deployed)
Visit [https://inkwell.dev] (placeholder) to see a live example.

## Features

### For Readers
- **Beautiful Content Grid:** Discover stories in a responsive, card-based layout.
- **Clean Reading Experience:** Optimized typography, whitespace, and focus on content.
- **Author Attribution:** See who wrote each story with their profile information.
- **Free Access:** All published content is free to read.

### For Writers
- **Rich Editor:** Write in Markdown-style with title, content, and status (Draft/Published).
- **Personal Dashboard:** Manage all your stories in one place with clear stats.
- **Profile Pages:** Customize your public bio, website, and social links.
- **Ownership Control:** Only you can edit or delete your stories.
- **Subscriber Collection:** Capture emails via a built-in newsletter form (stored in backend).

### Technical Highlights
- **Modern Stack:** React 18 + Vite + Tailwind CSS for a lightning-fast UI.
- **Robust Auth:** Secure JWT-based authentication with bcrypt password hashing.
- **Flexible Storage:** Uses a file-based JSON database (zero setup) – swap to PostgreSQL/MySQL for scale.
- **RESTful API:** Clean, documented endpoints for all operations.
- **Responsive Design:** Works flawlessly on mobile, tablet, and desktop.

## Project Structure

```
Login/
├── README.md                 # This file
├── package.json              # Root package (install all)
├── backend/
│   ├── package.json          # Backend dependencies
│   ├── db.js                 # File-based JSON storage (users, blogs, subscribers)
│   └── server.js             # Express API with auth, blogs, profiles, subscriptions
└── frontend/
    ├── package.json          # Frontend dependencies
    ├── index.html
    ├── vite.config.js        # Vite dev server with API proxy to :5000
    ├── tailwind.config.js    # Tailwind CSS configuration
    ├── postcss.config.js     # PostCSS setup
    └── src/
        ├── main.jsx          # React entry point
        ├── App.jsx           # Routing + auth context + layout wrapper
        ├── api.js            # Axios instance (uses Vite proxy to /api)
        ├── components/       # Reusable UI pieces
        │   ├── Navbar.jsx    # Top navigation with auth-aware links
        │   ├── Footer.jsx    # Bottom footer with social & subscribe
        │   └── Layout.jsx    # Wrapper that provides Navbar + Footer
        ├── pages/            # Page components
        │   ├── Home.jsx      # Public feed with story grid
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Dashboard.jsx # Writer's dashboard with stats & controls
        │   ├── BlogView.jsx  # Create, edit, and read a story
        │   ├── Settings.jsx  # Profile management (bio, links)
        │   └── SubscribeSuccess.jsx # Thank-you page after newsletter signup
        └── index.css         # Tailwind base styles
```

## Getting Started (Development)

You'll need [Node.js](https://nodejs.org) (v18+ recommended) and a terminal.

### 1. Install All Dependencies

From the project root (`Login/`):

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Start the Servers

Open **two** terminal windows.

**Terminal 1 – Backend:**
```bash
cd "C:\Users\abhin\OneDrive\Desktop\Login\backend"
node server.js
```
You should see: `Server running on port 5000`

**Terminal 2 – Frontend:**
```bash
cd "C:\Users\abhin\OneDrive\Desktop\Login\frontend"
npm run dev
```
Then open **http://localhost:5173** in your browser.

### 3. Use the App
- Click **Register** to create an account.
- Log in and go to your **Dashboard** to write your first story.
- Visit the home page (`/`) to see the public feed of published stories.
- Update your **Profile** to add a bio and social links.
- Try the **Subscribe** form in the footer to test newsletter capture.

## Preparing for Production / Monetization

1. **Change the JWT Secret**  
   In production, set the environment variable `JWT_SECRET` to a strong, random string.  
   Example (Linux/macOS): `JWT_SECRET=$(openssl rand -base64 32) node server.js`

2. **Switch to a Production Database**  
   The current `db.json` file is great for demos and low traffic. To scale:  
   - Replace `backend/db.js` with a PostgreSQL/MySQL version (using `pg` or `mysql2`).  
   - Keep the same API contracts (`/api/*`) so no frontend changes are needed.

3. **Add Email Service**  
   Connect the `/api/subscribe` endpoint to a service like SendGrid, Mailchimp, or ConvertKit to actually send the newsletter.  
   For now, emails are stored in the `subscribers` array for you to export and import.

4. **Optimize Assets**  
   Run `npm run build` in the frontend to create an optimized `dist/` folder, then serve it via any static file host (Netflix, Vercel, AWS S3 + CloudFront, etc.).

5. **Enable HTTPS**  
   Use a reverse proxy like Nginx or Caddy in front of your Node.js server to terminate SSL and serve over HTTPS.

## API Reference

All API endpoints are prefixed with `/api`.

### Authentication
- `POST /api/register` – `{username, email, password}` → `{token, user}`
- `POST /api/login` – `{username, password}` → `{token, user}`
- `GET /api/me` (auth) → `{id, username, email, bio, website, twitter, github, created_at}`
- `PUT /api/me` (auth) → `{bio?, website?, twitter?, github?}` → updated profile

### Blogs
- `GET /api/blogs` → `[{id, title, content, status, user_id, created_at, updated_at, author_name}]` (published only)
- `GET /api/blogs/:id` (auth) → blog if published or owned by user
- `POST /api/blogs` (auth) → `{title, content, status?}` → new blog
- `PUT /api/blogs/:id` (auth) → `{title, content, status?}` → updated blog (owner only)
- `DELETE /api/blogs/:id` (auth) → delete blog (owner only)
- `GET /api/my-blogs` (auth) → `[{...}]` all blogs for logged-in user

### Newsletter
- `POST /api/subscribe` – `{email}` → `{message}`
- `GET /api/subscribers/count` → `{count}`

## Design & Customization

The design uses **Tailwind CSS** with a custom color palette based on Indigo (`brand-500: #6366f1`). To change the theme:
- Edit `tailwind.config.js` → modify the `brand` color values.
- Re-run `npm run dev` (or `npm run build`) to see changes.

Icons are from **Lucide React** (`lucide-react` package). Import any icon like:
```javascript
import { Star } from 'lucide-react';
```
and use `<Star size={24} />`.

## Folder Permissions (Windows)

If you encounter `EPERM` or `EACCES` errors when the server tries to write `db.json`, run your terminal **as Administrator** or ensure your user has write access to the `Login/backend` folder.

## License

MIT – feel free to fork, modify, and deploy for your own projects or clients.

---

**Next Ideas for Growth**
- Add comments or reactions to stories.
- Implement "following" so users can subscribe to specific writers.
- Allow image uploads (via Cloudinary or similar) for richer posts.
- Add SEO meta tags and social sharing cards (Open Graph / Twitter).
- Introduce a paid subscription tier for exclusive content (Stripe integration).

Enjoy building your audience and your voice on Inkwell!