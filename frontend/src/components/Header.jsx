import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="text-white shadow-md" style={{ backgroundColor: '#3c4482' }}>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <h1
              className="brand-logo text-2xl font-black cursor-pointer hover:opacity-80 transition"
              onClick={() => navigate('/')}
            >
              🚗 Aradhya Car Rental
            </h1>
            <nav className="hidden sm:flex gap-6">
              <button
                onClick={() => navigate('/cars')}
                className="hover:opacity-80 transition font-semibold text-sm"
              >
                Available Cars
              </button>
              {user?.role === 'admin' ? (
                <button
                  onClick={() => navigate('/admin')}
                  className="hover:opacity-80 transition font-semibold text-sm text-[#d3d6f7]"
                >
                  Admin Panel
                </button>
              ) : (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="hover:opacity-80 transition font-semibold text-sm"
                >
                  Dashboard
                </button>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-sm hidden sm:block">
                  Welcome, <strong>{user.firstName}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="hover:opacity-80 px-4 py-2 rounded-lg transition font-semibold text-sm"
                  style={{ backgroundColor: '#d3d6f7', color: '#1d224a' }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
