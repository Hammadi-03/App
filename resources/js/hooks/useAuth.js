import { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(Cookies.get('auth_token') || null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async (authToken) => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Token might be invalid
        logout();
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  const login = async (username, password) => {
    const API_BASE = import.meta.env.VITE_API_URL || '';
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
      setToken(data.token);
      setUser(data.user);
      Cookies.set('auth_token', data.token, { expires: 7 }); // 7 days
      return { success: true };
    } else {
      return { success: false, error: data.error };
    }
  };

  const register = async (username, password, email) => {
    const API_BASE = import.meta.env.VITE_API_URL || '';
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

  const logout = () => {
    setToken(null);
    setUser(null);
    Cookies.remove('auth_token');
  };

  return {
    user,
    token,
    loading,
    login,
    register,
    logout
  };
}
