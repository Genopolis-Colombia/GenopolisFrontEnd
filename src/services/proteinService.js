import { api, proteinsBase } from "./api.js";

export const proteinService = {
  list() {
    return api.get(`${proteinsBase}`).then((res) => res.data?.proteins ?? []);
  },
  create(payload) {
    return api.post(`${proteinsBase}`, payload).then((res) => res.data);
  },
  get(proteinId) {
    return api.get(`${proteinsBase}/${proteinId}`).then((res) => res.data);
  },
  update(proteinId, payload) {
    return api.put(`${proteinsBase}/${proteinId}`, payload).then((res) => res.data);
  }, 
  delete(proteinId) {
    return api.delete(`${proteinsBase}/${proteinId}`).then((res) => res.data);
  },
};