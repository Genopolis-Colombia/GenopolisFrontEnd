import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { proteinService } from "../services/proteinService.js";
import { favoriteService } from "../services/favoriteService.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useSearch } from "../context/SearchContext.jsx";

function filterProteins(list, query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return list.filter((protein) => {
    const haystack = [
      protein.fastaNombre,
      protein.fastaSecuencia,
      protein.organismo,
      protein.clasificacion,
      protein.autores,
      protein.idProteina,
      protein.fuente,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

function SearchPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    addEntry,
    history,
    requestSearch,
    consumeRequestedQuery,
    requestedQuery,
  } = useSearch();

  const [allProteins, setAllProteins] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const list = await proteinService.list();
        setAllProteins(list);
      } catch (err) {
        console.error(err);
        setStatus({ type: "error", message: "No se pudieron cargar proteínas." });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (requestedQuery) {
      setQuery(requestedQuery);
      runSearch(requestedQuery, { addToHistory: false });
      consumeRequestedQuery();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch(query, { addToHistory: true });
  };

  const runSearch = (value, { addToHistory = true } = {}) => {
    setStatus({ type: "", message: "" });
    if (!value.trim()) {
      setResults([]);
      setStatus({ type: "error", message: "Ingresa un término de búsqueda." });
      return;
    }

    const filtered = filterProteins(allProteins, value);
    setResults(filtered);

    if (addToHistory) addEntry(value);

    if (filtered.length === 0) {
      setStatus({ type: "error", message: "Sin resultados para la búsqueda." });
    } else {
      setStatus({
        type: "success",
        message: `${filtered.length} resultado(s) encontrado(s).`,
      });
    }
  };

  const handleFavorite = async (protein) => {
    try {
      await favoriteService.create({
        userId: user.id,
        proteinId: protein.idProteina,
        fastaName: protein.fastaNombre,
      });
      setStatus({ type: "success", message: "Proteína agregada a favoritos." });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "No se pudo agregar a favoritos." });
    }
  };

  const tableRows = useMemo(() => results, [results]);

  return (
    <section className="card">
      <h1>Búsqueda de proteínas</h1>

      {status.message && (
        <p className={status.type === "error" ? "error" : "notice"}>
          {status.message}
        </p>
      )}

      <form
        className="searchbar"
        role="search"
        aria-label="Buscar proteínas"
        onSubmit={handleSubmit}
      >
        <label className="label" htmlFor="q">
          Consulta
        </label>
        <input
          id="q"
          className="input"
          type="search"
          placeholder="Ej. P53, hemoglobina, Q9H9K5"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Buscar"}
        </button>
      </form>

      <div className="notice" style={{ marginTop: ".75rem" }}>
        Resultados basados en un filtrado simple del listado completo.
      </div>

      {tableRows.length > 0 ? (
        <table className="table" aria-label="Resultados de búsqueda" style={{ marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>Proteína</th>
              <th>ID</th>
              <th>Fuente</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((protein) => (
              <tr key={protein.idProteina}>
                <td>{protein.fastaNombre}</td>
                <td>{protein.idProteina}</td>
                <td>{protein.fuente}</td>
                <td>
                  <button
                    className="btn secondary"
                    type="button"
                    onClick={() => navigate(`/protein/${protein.idProteina}`)}
                  >
                    Ver detalle
                  </button>{" "}
                  <button
                    className="btn"
                    type="button"
                    onClick={() => handleFavorite(protein)}
                  >
                    Agregar a favoritos
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && (
          <p className="helper" style={{ marginTop: "1rem" }}>
            No hay resultados. Intenta con otra búsqueda.
          </p>
        )
      )}
    </section>
  );
}

export default SearchPage;