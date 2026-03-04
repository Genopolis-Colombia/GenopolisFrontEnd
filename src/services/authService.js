import { api, authBase } from "./api.js";

export const authService = {
  register(payload) {
    return api.post(`${authBase}/register`, payload).then((res) => res.data);
  },
  login(credentials) {
    return api.post(`${authBase}/login`, credentials).then((res) => res.data);
  },
  validate(accessToken) {
    return api
      .post(`${authBase}/validate`, { accessToken })
      .then((res) => res.data);
  },
  update(payload) {
    return api.post(`${authBase}/update`, payload).then((res) => res.data);
  },
  delete(payload) {
    return api.post(`${authBase}/delete`, payload).then((res) => res.data);
  },
};