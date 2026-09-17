import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { PenSquare, LogOut, Settings } from 'lucide-react';

function Navbar() {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-paper/60 backdrop-blur-sm border-b border-stone/50 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" className="font-display text-2xl font-bold tracking-tight text-ink hover-lift transition-all">
              SubraGlaze
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {auth && auth.token ? (
              <>
                <Link to="/dashboard" className="link-animate hover-lift">
                  Dashboard
                </Link>
                <button
                  onClick={() => navigate('/blog/new')}
                  className="btn-primary py-2"
                >
                  <PenSquare size={16} /> New Post
                </button>
                <div className="flex items-center gap-3 ml-2 pl-3 border-l border-stone">
                  <Link to="/settings" className="hover-lift text-ink/70 hover:text-ochre transition-all">
                    <Settings size={20} />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="hover-lift text-ink/70 hover:text-ochre transition-all"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="link-animate hover-lift">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary py-2 hover-lift">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;