import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { favoriteService } from "../services/favoriteService.js";

function FavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });

  const loadFavorites = async () => {
    try {
      const response = await favoriteService.getByUser(user.id);
      setFavorites(response.favorites ?? []);
    } catch (err) {
      console.error(err);
      setFavorites([]);
      setStatus({ type: "error", message: "No se pudo cargar favoritos." });
    }
  };

  useEffect(() => {
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const handleDelete = async (favoriteId) => {
    try {
      await favoriteService.delete(favoriteId);
      setStatus({ type: "success", message: "Favorito eliminado." });
      loadFavorites();
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "No se pudo eliminar el favorito." });
    }
  };

  return (
    <section className="card">
      <h1>Mis favoritos</h1>
      <p className="helper">Proteínas guardadas para acceso rápido.</p>

      {status.message && (
        <p className={status.type === "error" ? "error" : "notice"}>
          {status.message}
        </p>
      )}

      {favorites.length === 0 ? (
        <p className="helper">Todavía no tienes proteínas favoritas.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Proteína</th>
              <th>ID</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {favorites.map((fav) => (
              <tr key={fav.favoriteId}>
                <td>{fav.fastaName}</td>
                <td>{fav.proteinId}</td>
                <td>
                  <Link className="btn secondary" to={`/protein/${fav.proteinId}`}>
                    Ver
                  </Link>{" "}
                  <button
                    className="btn danger"
                    type="button"
                    onClick={() => handleDelete(fav.favoriteId)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default FavoritesPage;