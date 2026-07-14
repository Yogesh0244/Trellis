import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/authApi.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('trellis_token');
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .getCurrentUser()
      .then((currentUser) => setUser(currentUser))
      .catch(() => {
        localStorage.removeItem('trellis_token');
        localStorage.removeItem('trellis_user');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    localStorage.setItem('trellis_token', response.token);
    const currentUser = await authApi.getCurrentUser();
    localStorage.setItem('trellis_user', JSON.stringify(currentUser));
    setUser(currentUser);
    return currentUser;
  };

  const register = async (payload) => {
    await authApi.register(payload);
    return login({ email: payload.email, password: payload.password });
  };

  const updateProfile = async (payload) => {
    const updated = await authApi.updateProfile(payload);
    localStorage.setItem('trellis_user', JSON.stringify(updated));
    setUser(updated);
    return updated;
  };

  const logout = () => {
    localStorage.removeItem('trellis_token');
    localStorage.removeItem('trellis_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}