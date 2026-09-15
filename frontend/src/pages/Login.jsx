import React, { useState, useContext } from 'react';
import { AuthContext } from '../App';
import api from '../api';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

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
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white border border-stone/50 rounded-xl p-10">
          <h2 className="text-center text-4xl font-extrabold text-ink">
            Sign in to your account
          </h2>
          {error && <p className="text-center text-red-600 text-sm">{error}</p>}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <input
              type="text"
              placeholder="Username"
              className="appearance-none rounded-lg w-full px-4 py-3 bg-white border border-ink/20 text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-ochre focus:border-ochre"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="appearance-none rounded-lg w-full px-4 py-3 bg-white border border-ink/20 text-ink placeholder-ink/40 focus:outline-none focus:ring-2 focus:ring-ochre focus:border-ochre"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-5 border border-transparent text-sm font-medium rounded-full text-paper bg-ochre hover:bg-ochre/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ochre transition-all"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Login;