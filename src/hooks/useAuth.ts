import { useState, useCallback } from 'react';

const AN_PS = 'basmala123';
const AUTH_KEY = 'auth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem(AUTH_KEY) === 'true'
  );

  const login = useCallback((password: string) => {
    if (password === AN_PS) {
      localStorage.setItem(AUTH_KEY, 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, login, logout };
};
