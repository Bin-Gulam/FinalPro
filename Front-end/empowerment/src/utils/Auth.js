// utils/auth.js

export const isAuthenticated = () => {
  const token = localStorage.getItem('access_token'); // <-- fix spelling
  return !!token;
};

export const getAccessToken = () => {
  return localStorage.getItem('access_token'); // <-- fix spelling
};

export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};

export const setTokens = (access, refresh) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};

export const clearTokens = () => {
  localStorage.removeItem('access_token'); // <-- fix spelling
  localStorage.removeItem('refresh_token');
};
