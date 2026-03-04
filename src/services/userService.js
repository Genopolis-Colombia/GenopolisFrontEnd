import { api, usersBase } from "./api.js";

export const userService = {
  get(userId) {
    return api.get(`${usersBase}/${userId}`).then((res) => res.data);
  },
  create(payload) {
    return api.post(`${usersBase}`, payload).then((res) => res.data);
  },
  update(userId, payload) {
    return api.put(`${usersBase}/${userId}`, payload).then((res) => res.data);
  },
  delete(userId) {
    return api.delete(`${usersBase}/${userId}`).then((res) => res.data);
  },
};