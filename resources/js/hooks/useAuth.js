import { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(Cookies.get('auth_token') || null);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL || '';

  const fetchUser = useCallback(async (authToken) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  // ─── Persist auth response ────────────────────────────────────────────────
  const persistAuth = (data) => {
    setToken(data.token);
    setUser(data.user);
    Cookies.set('auth_token', data.token, { expires: 7 });
  };

  // ─── Login ────────────────────────────────────────────────────────────────
  const login = async (username, password) => {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
      persistAuth(data);
      return { success: true };
    } else {
      return { success: false, error: data.error };
    }
  };

  // ─── Register ─────────────────────────────────────────────────────────────
  const register = async (username, password, email) => {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email })
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, error: data.error };
    }
  };

  // ─── Logout ───────────────────────────────────────────────────────────────
  const logout = () => {
    setToken(null);
    setUser(null);
    Cookies.remove('auth_token');
  };

  // ─── Forgot Password ──────────────────────────────────────────────────────
  const forgotPassword = async (email) => {
    const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    if (response.ok) {
      return { success: true, message: data.message };
    } else {
      return { success: false, error: data.error };
    }
  };

  // ─── Reset Password ───────────────────────────────────────────────────────
  const resetPassword = async (token, password) => {
    const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password })
    });
    const data = await response.json();
    if (response.ok) {
      return { success: true, message: data.message };
    } else {
      return { success: false, error: data.error };
    }
  };

  // ─── Google Sign-In – Get auth URL ───────────────────────────────────────
  const getGoogleAuthUrl = async () => {
    const response = await fetch(`${API_BASE}/api/auth/google/url`);
    const data = await response.json();
    if (response.ok) {
      return { success: true, url: data.url };
    } else {
      return { success: false, error: data.error };
    }
  };

  // ─── Google Sign-In – Exchange code for session ──────────────────────────
  const loginWithGoogle = async (code) => {
    const response = await fetch(`${API_BASE}/api/auth/google/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    const data = await response.json();
    if (response.ok) {
      persistAuth(data);
      return { success: true };
    } else {
      return { success: false, error: data.error };
    }
  };

  // ─── Update Profile ───────────────────────────────────────────────────────
  const updateProfile = async (profileData) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to update profile' };
      }

      setUser(data.user);
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: 'Network error occurred' };
    }
  };

  return {
    user,
    token,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    getGoogleAuthUrl,
    loginWithGoogle,
    updateProfile,
  };
}
