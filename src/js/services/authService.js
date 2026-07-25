import api from '../api/axiosInstance';

export const register = (name, email, password) => {
  return api.post('/register', { name, email, password });
};

export const login = (email, password) => {
  return api.post('/login', { email, password });
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userName');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};

export const getUserName = () => {
  return localStorage.getItem('userName') || '';
};
