import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import api from '../api';
import Layout from '../components/Layout';

function Settings() {
  const { auth } = useContext(AuthContext);
  const [profile, setProfile] = useState({ bio: '', website: '', twitter: '', github: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get('/me');
      setProfile({
        bio: res.data.bio || '',
        website: res.data.website || '',
        twitter: res.data.twitter || '',
        github: res.data.github || ''
      });
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await api.put('/me', profile);
      setProfile({
        bio: res.data.bio || '',
        website: res.data.website || '',
        twitter: res.data.twitter || '',
        github: res.data.github || ''
      });
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError('Failed to save profile');
    }
  };

  if (loading) return <div className="fade-in text-center py-20 text-ink/40">Loading profile...</div>;

  return (
    <Layout className="fade-in">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold text-ink">Profile & Settings</h1>
        <p className="mt-2 text-ink/60">Your public profile — shown alongside your published stories.</p>

        <div className="mt-6 card">
          <p className="text-sm text-ink/60">Signed in as</p>
          <p className="text-lg font-semibold text-ink">{auth?.user?.username}</p>
        </div>

        <form onSubmit={handleSave} className="mt-8 space-y-6 card">
          {message && <p className="rounded-md bg-ochre/10 text-ochre px-4 py-3">{message}</p>}
          {error && <p className="rounded-md bg-ink/5 text-ink/20 px-4 py-3">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-ink/60 mb-1">Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows="3"
              className="w-full px-4 py-3 rounded-lg border border-ink/20 bg-paper/70 focus:outline-none focus:ring-2 focus:ring-ochre"
              placeholder="Tell readers who you are..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-ink/60 mb-1">Website</label>
              <input
                type="url"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-ink/20 bg-paper/70 focus:outline-none focus:ring-2 focus:ring-ochre"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/60 mb-1">Twitter / X</label>
              <input
                type="text"
                value={profile.twitter}
                onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-ink/20 bg-paper/70 focus:outline-none focus:ring-2 focus:ring-ochre"
                placeholder="@username"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-ink/60 mb-1">GitHub</label>
              <input
                type="text"
                value={profile.github}
                onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-ink/20 bg-paper/70 focus:outline-none focus:ring-2 focus:ring-ochre"
                placeholder="@username"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary">
            Save Profile
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default Settings;