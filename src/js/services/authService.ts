import api from '../api/axiosInstance.ts';

export const register = (name: string, email: string, password: string) => {
  return api.post('/register', { name, email, password });
};

export const login = (email: string, password: string) => {
  return api.post('/login', { email, password });
};

export const logout = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userName');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('accessToken');
};

export const getUserName = (): string => {
  return localStorage.getItem('userName') || '';
};
