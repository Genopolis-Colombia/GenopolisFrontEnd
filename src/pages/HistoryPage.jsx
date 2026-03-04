import { useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext.jsx";

function formatTimestamp(ts) {
  const date = new Date(ts);
  return date.toLocaleString();
}

function HistoryPage() {
  const { history, clearHistory, requestSearch } = useSearch();
  const navigate = useNavigate();

  const handleReRun = (query) => {
    requestSearch(query);
    navigate("/search");
  };

  return (
    <section className="card">
      <h1>Historial de búsqueda</h1>
      {history.length === 0 ? (
        <p className="helper">
          Aún no has realizado búsquedas en esta sesión.
        </p>
      ) : (
        <>
          <button
            className="btn secondary"
            type="button"
            onClick={clearHistory}
            style={{ marginBottom: "1rem" }}
          >
            Limpiar historial
          </button>
          <table className="table" aria-label="Historial de consultas">
            <thead>
              <tr>
                <th>Consulta</th>
                <th>Fecha/Hora</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.query}</td>
                  <td>{formatTimestamp(entry.timestamp)}</td>
                  <td>
                    <button
                      className="btn secondary"
                      type="button"
                      onClick={() => handleReRun(entry.query)}
                    >
                      Re-ejecutar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}

export default HistoryPage;