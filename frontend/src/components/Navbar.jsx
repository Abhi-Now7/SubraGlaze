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
    <nav className="bg-paper border-b border-stone sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" className="font-display text-2xl font-bold tracking-tight text-ink hover:text-ochre transition-colors">
              SubraGlaze
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {auth && auth.token ? (
              <>
                <Link to="/dashboard" className="text-ink hover:text-ochre font-medium text-sm hidden sm:block transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={() => navigate('/blog/new')}
                  className="bg-ink text-paper px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 transition-all hover:bg-navy-800"
                >
                  <PenSquare size={16} /> New Post
                </button>
                <div className="flex items-center gap-3 ml-2 pl-3 border-l border-stone">
                  <Link to="/settings" className="text-ink hover:text-ochre transition-colors">
                    <Settings size={20} />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-ink hover:text-red-700 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-ink hover:text-ochre font-medium text-sm transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="bg-ink text-paper px-4 py-2 rounded-full font-medium text-sm transition-all hover:bg-navy-800">
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