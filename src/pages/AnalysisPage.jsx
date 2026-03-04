import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { integrationService } from "../services/integrationService.js";
import React from "react";
const PROGRAMS = ["BLASTP", "BLASTN", "BLASTX"];
const DATABASES = ["NR", "SwissProt", "PDB", "RefSeq"];

function getHitField(hit, candidates) {
  if (!hit) return null;
  for (const key of candidates) {
    const value = hit[key];
    if (value !== undefined && value !== null) {
      return value;
    }
  }
  return null;
}

function formatScore(value) {
  if (value === undefined || value === null) return "—";
  const num = Number(value);
  return Number.isFinite(num) ? num.toFixed(2) : value;
}

function formatEValue(value) {
  if (value === undefined || value === null) return "—";
  const num = Number(value);
  if (!Number.isFinite(num)) return value;
  if (num === 0) return "0.0";
  return num.toExponential(2);
}

function formatPercentage(value) {
  if (value === undefined || value === null) return "—";
  const num = Number(value);
  if (!Number.isFinite(num)) return value;
  if (num <= 1) {
    return `${(num * 100).toFixed(1)}%`;
  }
  return `${num.toFixed(1)}%`;
}

const columns = [
  {
    label: "Accession",
    keys: ["accession"],
    render: (value, hit) =>
      value ? (
        <a
          href={`https://www.ncbi.nlm.nih.gov/search/all/?term=${encodeURIComponent(
            value
          )}`}
          target="_blank"
          rel="noreferrer"
        >
          {value}
        </a>
      ) : (
        "—"
      ),
  },
  {
    label: "Descripción",
    keys: ["description", "title"],
  },
  {
    label: "% Identidad",
    keys: ["identityPercentage", "percentIdentity"],
    format: formatPercentage,
  },
  {
    label: "Bit score",
    keys: ["bitScore", "score"],
    format: formatScore,
  },
  {
    label: "E-value",
    keys: ["eValue", "evalue"],
    format: formatEValue,
  },
  {
    label: "Long. alineamiento",
    keys: ["alignmentLength"],
  },
  {
    label: "# HSP",
    keys: ["alignments"],
    render: (value) => (Array.isArray(value) ? value.length : "—"),
  },
];

function AnalysisPage() {
  const location = useLocation();
  const initialProtein = location.state?.protein;

  const [program, setProgram] = useState("BLASTP");
  const [database, setDatabase] = useState("NR");
  const [sequence, setSequence] = useState(initialProtein?.fastaSecuencia ?? "");
  const [rid, setRid] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");
  const [statusResponse, setStatusResponse] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const [expandedHits, setExpandedHits] = useState({});

  useEffect(() => {
    if (initialProtein?.fastaSecuencia) {
      setSequence(initialProtein.fastaSecuencia);
      setStatusMessage(`Analizando: ${initialProtein.fastaNombre}`);
      setStatusType("notice");
    }
  }, [initialProtein]);

  const hits = useMemo(() => {
    if (!result || !Array.isArray(result.hits)) return [];
    return result.hits;
  }, [result]);

  const columnsToRender = useMemo(
    () =>
      columns.filter((column) =>
        hits.some((hit) => getHitField(hit, column.keys))
      ),
    [hits]
  );

  const handleRunBlast = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    setResult(null);
    setStatusResponse(null);
    setExpandedHits({});

    if (!sequence.trim()) {
      setStatusType("error");
      setStatusMessage("Debes ingresar una secuencia FASTA válida.");
      return;
    }

    setLoading(true);
    try {
      const response = await integrationService.runBlastAnalysis({
        sequence,
        program,
        database,
      });
      setRid(response.rid);
      setStatusType("success");
      setStatusMessage(`Análisis iniciado. RID asignado: ${response.rid}`);
    } catch (err) {
      console.error(err);
      setStatusType("error");
      setStatusMessage("No se pudo iniciar el análisis BLAST.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!rid) {
      setStatusType("error");
      setStatusMessage("Primero inicia un análisis (RID vacío).");
      return;
    }
    try {
      const response = await integrationService.checkBlastStatus(rid);
      setStatusResponse(response);
      setStatusType("notice");
      setStatusMessage(`Estado del análisis (${response.rid}): ${response.status}`);
    } catch (err) {
      console.error(err);
      setStatusType("error");
      setStatusMessage("No fue posible consultar el estado.");
    }
  };

  const handleGetResult = async () => {
    if (!rid) {
      setStatusType("error");
      setStatusMessage("Primero inicia un análisis (RID vacío).");
      return;
    }
    try {
      const response = await integrationService.getBlastResult(rid);
      setResult(response);
      setExpandedHits({});
      setStatusType("success");
      setStatusMessage("Resultados recuperados correctamente.");
    } catch (err) {
      console.error(err);
      setStatusType("error");
      setStatusMessage("No se pudo obtener el resultado. ¿Está READY?");
    }
  };

  const toggleExpanded = (rowId) => {
    setExpandedHits((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  return (
    <section className="card">
      <h1>Análisis e integración (BLAST)</h1>
      {statusMessage && (
        <p className={statusType === "error" ? "error" : "notice"}>
          {statusMessage}
        </p>
      )}

      <form onSubmit={handleRunBlast}>
        <div className="form-row grid cols-2">
          <div>
            <label className="label" htmlFor="program">Programa</label>
            <select
              id="program"
              className="select"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
            >
              {PROGRAMS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="database">Base de datos</label>
            <select
              id="database"
              className="select"
              value={database}
              onChange={(e) => setDatabase(e.target.value)}
            >
              {DATABASES.map((db) => (
                <option key={db}>{db}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <label className="label" htmlFor="sequence">
            Secuencia FASTA
          </label>
          <textarea
            id="sequence"
            className="input"
            rows={8}
            placeholder="Pega aquí la secuencia en formato FASTA"
            value={sequence}
            onChange={(e) => setSequence(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label className="label" htmlFor="ridField">
            RID actual (rellénalo cuando se genere)
          </label>
          <input
            id="ridField"
            className="input"
            placeholder="RID del análisis BLAST"
            value={rid}
            onChange={(e) => setRid(e.target.value)}
          />
        </div>

        <div className="form-row">
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Ejecutando..." : "Ejecutar análisis"}
          </button>
          <button className="btn secondary" type="button" onClick={handleCheckStatus}>
            Consultar estado
          </button>
          <button className="btn secondary" type="button" onClick={handleGetResult}>
            Obtener resultado
          </button>
        </div>
      </form>

      <div className="notice">
        Los resultados se muestran en formato tabla (similar a BLAST NCBI). Puedes expandir
        cada hit para ver los alineamientos (HSP) y las secuencias Query/Subject.
      </div>

      {statusResponse && (
        <div style={{ marginTop: "1rem" }}>
          <h2>Estado</h2>
          <div className="notice">
            <strong>RID:</strong> {statusResponse.rid} · <strong>Status:</strong>{" "}
            {statusResponse.status}
          </div>
        </div>
      )}

      {hits.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <h2>Resultado BLAST</h2>
          <div className="helper" style={{ marginBottom: ".5rem" }}>
            RID: <strong>{result.rid}</strong> · Hits significativos:{" "}
            <strong>{hits.length}</strong>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="table" aria-label="Hits BLAST">
              <thead>
                <tr>
                  {columnsToRender.map((column) => (
                    <th key={column.label}>{column.label}</th>
                  ))}
                  <th>Detalles</th>
                </tr>
              </thead>
              <tbody>
                {hits.map((hit, index) => {
                  const rowId = hit.accession ?? `hit-${index}`;
                  return (
                    <React.Fragment key={rowId}>
                      <tr>
                        {columnsToRender.map((column) => {
                          const rawValue = getHitField(hit, column.keys);
                          const value =
                            column.format && rawValue !== null
                              ? column.format(rawValue)
                              : rawValue ?? "—";
                          if (column.render) {
                            return (
                              <td key={column.label}>
                                {column.render(rawValue ?? value, hit)}
                              </td>
                            );
                          }
                          return <td key={column.label}>{value}</td>;
                        })}
                        <td>
                          <button
                            className="btn secondary"
                            type="button"
                            onClick={() => toggleExpanded(rowId)}
                          >
                            {expandedHits[rowId] ? "Ocultar" : "Ver"} alineamientos
                          </button>
                        </td>
                      </tr>

                      {expandedHits[rowId] && (
                        <tr>
                          <td colSpan={columnsToRender.length + 1}>
                            <AlignmentDetails hit={hit} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button
            className="btn secondary"
            type="button"
            style={{ marginTop: "1rem" }}
            onClick={() => setShowRaw((prev) => !prev)}
          >
            {showRaw ? "Ocultar JSON" : "Ver JSON sin procesar"}
          </button>

          {showRaw && (
            <pre className="notice" style={{ marginTop: "1rem", overflowX: "auto" }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      )}

      {hits.length === 0 && result && (
        <p className="helper" style={{ marginTop: "1rem" }}>
          El análisis se completó pero no devolvió hits significativos (revisa los parámetros).
        </p>
      )}
    </section>
  );
}

function AlignmentDetails({ hit }) {
  if (!Array.isArray(hit.alignments) || hit.alignments.length === 0) {
    return <p className="helper">No hay alineamientos disponibles para este hit.</p>;
  }

  return (
    <div style={{ marginTop: "1rem" }}>
      <h3 style={{ marginBottom: ".5rem" }}>
        Alineamientos para {hit.accession} ({hit.description})
      </h3>
      {hit.alignments.map((alignment, i) => (
        <div key={i} className="card" style={{ marginBottom: "1rem" }}>
          <div className="form-row" style={{ marginBottom: ".5rem" }}>
            <div>
              <strong>Bit score:</strong> {formatScore(alignment.bitScore)}
            </div>
            <div>
              <strong>E-value:</strong> {formatEValue(alignment.eValue)}
            </div>
            <div>
              <strong>Identidades:</strong>{" "}
              {alignment.identities ?? "—"} / {alignment.alignmentLength ?? "—"}
            </div>
            <div>
              <strong>Gaps:</strong> {alignment.gaps ?? 0}
            </div>
          </div>

          {Array.isArray(alignment.blocks) && alignment.blocks.length > 0 ? (
            alignment.blocks.map((block, blockIndex) => (
              <div key={blockIndex} className="notice" style={{ marginBottom: ".75rem" }}>
                <div>
                  <strong>Query:</strong> (pos {block.queryStart}){" "}
                  <code>{block.querySequence}</code>
                </div>
                <div>
                  <strong>Subject:</strong> (pos {block.subjectStart}){" "}
                  <code>{block.subjectSequence}</code>
                </div>
              </div>
            ))
          ) : (
            <p className="helper">Sin bloques detallados para este HSP.</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default AnalysisPage;