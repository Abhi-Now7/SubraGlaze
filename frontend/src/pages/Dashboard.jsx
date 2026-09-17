import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import api from '../api';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { PenSquare, Trash2, Eye, Edit3, FileText } from 'lucide-react';

function Dashboard() {
  const { auth } = useContext(AuthContext);
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
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog permanently?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      fetchBlogs();
    } catch (err) {
      setError('Failed to delete blog');
    }
  };

  const published = blogs.filter(b => b.status === 'published').length;
  const drafts = blogs.filter(b => b.status === 'draft').length;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-ink">
              Welcome back, {auth?.user?.username}
            </h1>
            <p className="mt-2 text-ink/60">Manage your stories and grow your audience.</p>
          </div>
          <Link to="/blog/new" className="btn-primary flex items-center gap-2">
            <PenSquare size={18} /> New Story
          </Link>
        </div>

        {error && <p className="mb-6 rounded-md bg-ink/5 text-ink/60 px-4 py-3">{error}</p>}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="card p-6">
            <p className="text-sm text-ink/60">Total Stories</p>
            <p className="mt-2 text-4xl font-extrabold text-ink">{blogs.length}</p>
          </div>
          <div className="card p-6">
            <p className="text-sm text-ink/60">Published</p>
            <p className="mt-2 text-4xl font-extrabold text-ochre">{published}</p>
          </div>
          <div className="card p-6">
            <p className="text-sm text-ink/60">Drafts</p>
            <p className="mt-2 text-4xl font-extrabold text-ink/60">{drafts}</p>
          </div>
        </div>

        {/* Blog list */}
        {loading ? (
          <div className="text-center py-10 text-ink/40">Loading your stories...</div>
        ) : blogs.length === 0 ? (
          <div className="text-center bg-paper/50 rounded-xl border border-dashed border-stone p-16 card">
            <FileText className="mx-auto text-ochre/40" size={48} />
            <h2 className="mt-4 text-xl font-semibold text-ink">You haven't published anything yet</h2>
            <p className="mt-2 text-ink/60">Share your first story and start building an audience.</p>
            <Link to="/blog/new" className="btn-primary mt-6 inline-block">
              Write your first story
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {blogs && Array.isArray(blogs) ? (
              blogs.map(blog => (
                <div key={blog.id} className="card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        blog.status === 'published' ? 'bg-ochre/10 text-ochre' : 'bg-ink/5 text-ink/60'
                      }`}>
                        {blog.status}
                      </span>
                      <span className="text-xs text-ink/40">{new Date(blog.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-ink truncate">{blog.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link to={`/blog/${blog.id}`} className="link-animate p-2">
                      <Eye size={18} />
                    </Link>
                    <Link to={`/blog/edit/${blog.id}`} className="link-animate p-2">
                      <Edit3 size={18} />
                    </Link>
                    <button onClick={() => handleDelete(blog.id)} className="link-animate p-2">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>Loading...</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Dashboard;