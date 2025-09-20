import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Reads token and role from query string (?token=...&role=admin) and stores the token
// then redirects to the appropriate page so the SPA picks up authenticated state.
const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const role = params.get('role');

    if (token) {
      localStorage.setItem('token', token);
    }

    if (role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
    // Reload so that AuthContext sees the token on startup
    setTimeout(() => window.location.reload(), 200);
  }, [navigate]);

  return null;
};

export default AuthCallback;