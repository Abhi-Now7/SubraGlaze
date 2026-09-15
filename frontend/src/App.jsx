import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import api from './api';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BlogView from './pages/BlogView';
import Settings from './pages/Settings';
import SubscribeSuccess from './pages/SubscribeSuccess';

export const AuthContext = createContext(null);

function App() {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')),
  });

  // Sync auth state on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setAuth({ token, user: JSON.parse(user) });
    }
  }, []);

  const login = (token, user) => {
    localStorage.setItem('token', token, token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({ token, user });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!auth.token ? <Login /> : <Navigate to="/dashboard" replace />} />
          <Route path="/register" element={!auth.token ? <Register /> : <Navigate to="/dashboard" replace />} />
          <Route path="/subscribe/success" element={<SubscribeSuccess />} />
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              auth.token ? <Dashboard /> : <Navigate to="/login" replace state={{ from: '/dashboard' }} />
            }
          />
          <Route
            path="/blog/new"
            element={
              auth.token ? <BlogView /> : <Navigate to="/login" replace state={{ from: '/blog/new' }} />
            }
          />
          <Route
            path="/blog/:id"
            element={
              auth.token ? (
                <>
                  <BlogView />
                </>
              ) : (
                <Navigate to="/login" replace state={{ from: `/blog/${window.location.pathname.split('/').pop()}` }} />
              )
            }
          />
          <Route
            path="/blog/edit/:id"
            element={
              auth.token ? (
                <>
                  <BlogView />
                </>
              ) : (
                <Navigate to="/login" replace state={{ from: `/blog/edit/${window.location.pathname.split('/').pop()}` }} />
              )
            }
          />
          <Route
            path="/settings"
            element={
              auth.token ? <Settings /> : <Navigate to="/login" replace state={{ from: '/settings' }} />
            }
          />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;