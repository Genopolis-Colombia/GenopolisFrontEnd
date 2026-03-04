import { api, favoritesBase } from "./api.js";

export const favoriteService = {
  create(payload) {
    return api.post(`${favoritesBase}`, payload).then((res) => res.data);
  },
  getById(favoriteId) {
    return api.get(`${favoritesBase}/${favoriteId}`).then((res) => res.data);
  },
  getByUser(userId) {
    return api.get(`${favoritesBase}/user/${userId}`).then((res) => res.data);
  },
  delete(favoriteId) {
    return api.delete(`${favoritesBase}/${favoriteId}`).then((res) => res.data);
  },
};