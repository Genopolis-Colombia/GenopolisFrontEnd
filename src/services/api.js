import axios from "axios";

export const authBase = import.meta.env.VITE_AUTH_API;
export const usersBase = import.meta.env.VITE_USERS_API;
export const proteinsBase = import.meta.env.VITE_PROTEINS_API;
export const favoritesBase = import.meta.env.VITE_FAVORITES_API;
export const integrationBase = import.meta.env.VITE_INTEGRATION_API;

export const api = axios.create();

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});