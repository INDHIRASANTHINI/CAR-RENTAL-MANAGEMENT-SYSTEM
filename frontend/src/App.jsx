import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore } from './store/authStore';

// Import Components
import Header from './components/Header';

// Import Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CarsPage from './pages/CarsPage';
import DashboardPage from './pages/DashboardPage';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import HomePage from './pages/HomePage';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? "/admin" : "/"} replace />;
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
};

function App() {
  const { fetchProfile, isCheckingAuth, accessToken } = useAuthStore();

  useEffect(() => {
    // Try to fetch user profile on app load (for persistent login)
    if (accessToken) {
      fetchProfile().catch(() => {
        // Profile fetch failed, user will need to login
        localStorage.removeItem('accessToken');
      });
    } else {
      // No token, stop checking
      useAuthStore.setState({ isCheckingAuth: false });
    }
  }, [fetchProfile, accessToken]);

  if (isCheckingAuth && accessToken) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#f6f6ff]">
        <div className="text-xl font-bold text-[#3c4482]">Loading Application...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/cars"
            element={
              <ProtectedRoute>
                <CarsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking/:carId"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/:bookingId"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<HomePage />} />
        </Routes>

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
