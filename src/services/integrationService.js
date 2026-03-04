import { api, integrationBase } from "./api.js";

/**
 * Cliente para el microservicio de integración (BLAST).
 *
 * - POST /blast/analyze    -> inicia un análisis y devuelve el RID
 * - GET  /blast/status/{rid}
 * - GET  /blast/result/{rid}
 */
export const integrationService = {
  runBlastAnalysis({ sequence, program = "BLASTP", database = "NR" }) {
    return api
      .post(`${integrationBase}/analyze`, {
        sequence,
        program,
        database,
      })
      .then((res) => res.data); // { rid }
  },

  checkBlastStatus(rid) {
    return api
      .get(`${integrationBase}/status/${encodeURIComponent(rid)}`)
      .then((res) => res.data); // { rid, status }
  },

  getBlastResult(rid) {
    return api
      .get(`${integrationBase}/result/${encodeURIComponent(rid)}`)
      .then((res) => res.data); // { rid, hits: [...] }
  },
};