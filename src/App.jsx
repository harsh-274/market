import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import Sell from './pages/Sell';
import Nav from './components/Nav';

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return session ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav />
        <Routes>
          {/* Home page BUT if not logged in show Login/Signup */}
          <Route path="/" element={<Home />} />

          {/* Auth pages */}
          <Route path="/signup" element={<LoginOrHome><Signup /></LoginOrHome>} />
          <Route path="/login" element={<LoginOrHome><Login /></LoginOrHome>} />

          {/* Protected Sell page */}
          <Route path="/sell" element={<ProtectedRoute><Sell /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function LoginOrHome({ children }) {
  const { session } = useAuth();
  return session ? <Navigate to="/" /> : children;
}
