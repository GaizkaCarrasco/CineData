import apiClient from './apiClient';

// ==================== AUTENTICACIÓN ====================

export const register = async (email, password) => {
  const response = await apiClient.post('/auth/register', { email, password });
  return response.data;
};

export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
  }
  return response.data;
};

export const logout = async () => {
  try {
    await apiClient.post('/auth/logout');
  } finally {
    localStorage.removeItem('token');
  }
};

// ==================== PELÍCULAS ====================

export const getMovies = async (filters = {}) => {
  let url = '/movies';
  const params = new URLSearchParams();
  
  if (filters.genre) params.append('genre', filters.genre);
  if (filters.year) params.append('year', filters.year);
  if (filters.search) url += `?search=${filters.search}`;
  
  const queryString = params.toString();
  if (queryString && !filters.search) {
    url += `?${queryString}`;
  }
  
  const response = await apiClient.get(url);
  return response.data;
};

export const searchMovies = async (query) => {
  const response = await apiClient.get(`/movies?search=${query}`);
  return response.data;
};

// ==================== FAVORITOS ====================

export const getFavorites = async () => {
  const response = await apiClient.get('/favorites');
  return response.data;
};

export const addFavorite = async (movieId) => {
  const response = await apiClient.post(`/favorites/${movieId}`);
  return response.data;
};

export const removeFavorite = async (movieId) => {
  const response = await apiClient.delete(`/favorites/${movieId}`);
  return response.data;
};

// ==================== USUARIOS ====================

export const getProfile = async () => {
  const response = await apiClient.get('/users/me');
  return response.data;
};

// ==================== ADMINISTRACIÓN ====================

export const getAllUsers = async () => {
  const response = await apiClient.get('/admin/users');
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await apiClient.delete(`/admin/users/${userId}`);
  return response.data;
};
