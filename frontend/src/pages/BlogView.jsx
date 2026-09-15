import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import api from '../api';
import Layout from '../components/Layout';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, User } from 'lucide-react';

function BlogView() {
  const { auth } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!blog) return;
    setError('');
    setSaving(true);
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
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    if (blog) setBlog({ ...blog, [field]: value });
  };

  if (loading) return <div className="text-center py-20 text-ink/40">Loading...</div>;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button onClick={() => navigate(-1)} className="mb-8 inline-flex items-center gap-2 text-sm text-ink/60 hover:text-ink transition-colors">
          <ArrowLeft size={16} /> Back
        </button>

        {error && <p className="mb-6 rounded-md bg-ink/5 text-ink/20 px-4 py-3">{error}</p>}

        {/* Create / Edit form */}
        {(isNew || isEdit) ? (
          <form onSubmit={handleSave} className="space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight text-ink">
              {isNew ? 'Write a new story' : 'Edit your story'}
            </h1>
            <div>
              <label className="block text-sm font-medium text-ink/60 mb-1">Title</label>
              <input
                type="text"
                value={blog?.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-ink/20 bg-paper/50 focus:outline-none focus:ring-2 focus:ring-ochre focus:border-ochre text-lg"
                placeholder="Your compelling title..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/60 mb-1">Content</label>
              <textarea
                value={blog?.content || ''}
                onChange={(e) => updateField('content', e.target.value)}
                rows="14"
                required
                className="w-full px-4 py-3 rounded-lg border border-ink/20 bg-paper/50 focus:outline-none focus:ring-2 focus:ring-ochre focus:border-ochre"
                placeholder="Write your story here..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/60 mb-1">Status</label>
              <select
                value={blog?.status || 'draft'}
                onChange={(e) => updateField('status', e.target.value)}
                className="w-full sm:w-64 px-3 py-2 rounded-lg border border-ink/20 bg-paper/50 focus:outline-none focus:ring-ochre"
              >
                <option value="draft">Draft (only visible to you)</option>
                <option value="published">Published (visible to everyone)</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-ochre hover:bg-ochre/90 disabled:opacity-50 text-paper px-6 py-3 rounded-full font-medium flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
              >
                <Save size={18} /> {saving ? 'Saving...' : (isNew ? 'Publish / Save' : 'Update Story')}
              </button>
              {blog?.status === 'draft' && !isNew && (
                <span className="text-sm text-ochre/60">Drafts are only visible to you until published.</span>
              )}
            </div>
          </form>
        ) : (
          /* Reading view */
          <article className="prose-article">
            <div className="mb-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                blog?.status === 'published' ? 'bg-ochre/10 text-ochre' : 'bg-ochre/20 text-ochre/80'
              }`}>
                {blog?.status}
              </span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-ink leading-none mb-6">{blog?.title}</h1>
            <div className="mt-6 flex items-center gap-4 text-sm text-ink/50">
              <span className="inline-flex items-center gap-2">
                <User size={16} /> {blog?.author_name}
              </span>
              <span className="inline-flex items-center gap-2">
                <Calendar size={16} /> {new Date(blog?.created_at).toLocaleDateString()}
              </span>
            </div>

            {auth && auth.user.id === blog?.user_id && !isEdit && (
              <div className="mt-8 mb-8">
                <button
                  onClick={() => navigate(`/blog/edit/${blog.id}`)}
                  className="bg-ink/50 hover:bg-ink/60 text-paper px-5 py-2.5 rounded-full font-medium transition-all"
                >
                  Edit Story
                </button>
              </div>
            )}

            <div className="mt-8 prose prose-lg max-w-none text-ink/80 leading-relaxed whitespace-pre-wrap">
              {blog?.content}
            </div>
          </article>
        )}
      </div>
    </Layout>
  );
}

export default BlogView;