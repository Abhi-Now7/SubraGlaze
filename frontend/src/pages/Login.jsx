import React, { useState, useContext } from 'react';
import { AuthContext } from '../App';
import api from '../api';
import Layout from '../components/Layout';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/login', formData);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Layout className="fade-in">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 card p-10">
          <h2 className="text-center text-4xl font-extrabold text-ink">
            Sign in
          </h2>
          {error && <p className="text-center text-red-500 text-sm">{error}</p>}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-3 rounded-lg border border-ink/20 bg-paper/70 focus:outline-none focus:ring-2 focus:ring-ochre focus:border-ochre text-ink"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border border-ink/20 bg-paper/70 focus:outline-none focus:ring-2 focus:ring-ochre focus:border-ochre text-ink"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <button
              type="submit"
              className="btn-primary w-full"
            >
              Sign in
            </button>
            <p className="text-center text-sm text-ink/60">
              Don't have an account? <Link to="/register" className="link-animate">Get Started</Link>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Login;