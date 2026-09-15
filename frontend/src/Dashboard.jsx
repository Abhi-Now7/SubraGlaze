import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './App';
import api from './api';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { auth, logout } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/my-blogs');
      setBlogs(res.data);
    } catch (err) {
      setError('Failed to load blogs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      fetchBlogs();
    } catch (err) {
      setError('Failed to delete blog');
    }
  };

  if (!auth.token) return <p>Please log in</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {auth.user.username}!</p>
      <Link to="/blog/new" style={{ marginRight: '10px' }}>
        <button>New Blog</button>
      </Link>
      <button onClick={logout}>Logout</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : blogs.length === 0 ? (
        <p>You haven't created any blogs yet.</p>
      ) : (
        <div>
          <h2>Your Blogs</h2>
          {blogs.map(blog => (
            <div key={blog.id} style={{ border: '1px solid #ddd', margin: '10px 0', padding: '10px' }}>
              <h3>{blog.title}</h3>
              <p>Status: {blog.status}</p>
              <div>
                <Link to={`/blog/${blog.id}`} style={{ marginRight: '10px' }}>
                  <button>View</button>
                </Link>
                <Link to={`/blog/edit/${blog.id}`} style={{ marginRight: '10px' }}>
                  <button>Edit</button>
                </Link>
                <button onClick={() => handleDelete(blog.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;