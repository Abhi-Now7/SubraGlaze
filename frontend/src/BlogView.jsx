import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './App';
import api from './api';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

function BlogView() {
  const { auth } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Determine mode from the route path
  const isNew = location.pathname === '/blog/new';
  const isEdit = location.pathname.startsWith('/blog/edit/');
  const blogId = id;

  useEffect(() => {
    if (isNew) {
      setBlog({ title: '', content: '', status: 'draft' });
      setLoading(false);
    } else {
      loadBlog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, blogId, location.pathname]);

  const loadBlog = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/blogs/${blogId}`);
      setBlog(res.data);
    } catch (err) {
      setError('Blog not found or unauthorized');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!blog) return;
    setError('');
    try {
      if (isNew) {
        const res = await api.post('/blogs', {
          title: blog.title,
          content: blog.content,
          status: blog.status || 'draft'
        });
        navigate(`/blog/${res.data.id}`);
      } else {
        await api.put(`/blogs/${blogId}`, {
          title: blog.title,
          content: blog.content,
          status: blog.status
        });
        navigate(`/blog/${blogId}`);
      }
    } catch (err) {
      setError('Failed to save blog');
      console.error(err);
    }
  };

  const updateField = (field, value) => {
    if (blog) setBlog({ ...blog, [field]: value });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto' }}>
      {isNew ? (
        <h1>New Blog</h1>
      ) : isEdit ? (
        <h1>Edit Blog</h1>
      ) : (
        <h1>{blog?.title}</h1>
      )}

      {!isNew && !isEdit && blog && (
        <div style={{ marginBottom: '20px' }}>
          <p>By {blog.author_name} | {new Date(blog.created_at).toLocaleDateString()}</p>
          {auth && auth.user.id === blog.user_id && (
            <button onClick={() => navigate(`/blog/edit/${blog.id}`)}>Edit</button>
          )}
        </div>
      )}

      {isNew || isEdit ? (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={blog?.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
              required
            />
          </div>
          <div>
            <label>Content:</label>
            <textarea
              value={blog?.content || ''}
              onChange={(e) => updateField('content', e.target.value)}
              rows="10"
              required
            />
          </div>
          <div>
            <label>Status:</label>
            <select
              value={blog?.status || 'draft'}
              onChange={(e) => updateField('status', e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <button type="submit" style={{ padding: '10px', alignSelf: 'flex-start' }}>
            {isNew ? 'Create' : 'Update'}
          </button>
        </form>
      ) : (
        <div>
          <p>{blog?.content}</p>
        </div>
      )}
    </div>
  );
}

export default BlogView;