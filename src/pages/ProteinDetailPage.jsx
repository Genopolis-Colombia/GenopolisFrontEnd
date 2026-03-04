import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { proteinService } from "../services/proteinService.js";
import { favoriteService } from "../services/favoriteService.js";
import { useAuth } from "../context/AuthContext.jsx";

function ProteinDetailPage() {
  const { proteinId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [protein, setProtein] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await proteinService.get(proteinId);
        setProtein(data);
      } catch (err) {
        console.error(err);
        setStatus({
          type: "error",
          message: "No se pudo cargar la proteína solicitada.",
        });
      }
    };
    load();
  }, [proteinId]);

  const handleFavorite = async () => {
    if (!protein) return;
    try {
      await favoriteService.create({
        userId: user.id,
        proteinId: protein.idProteina,
        fastaName: protein.fastaNombre,
      });
      setStatus({ type: "success", message: "Se agregó a favoritos." });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "No fue posible agregar a favoritos." });
    }
  };

  if (!protein) {
    return (
      <section className="card">
        <h1>Detalle de proteína</h1>
        {status.message ? (
          <p className={status.type === "error" ? "error" : "notice"}>
            {status.message}
          </p>
        ) : (
          <p className="helper">Cargando información...</p>
        )}
      </section>
    );
  }

  return (
    <section className="card">
      <h1>Detalle de proteína</h1>
      {status.message && (
        <p className={status.type === "error" ? "error" : "notice"}>
          {status.message}
        </p>
      )}
      <div className="grid cols-2">
        <div>
          <p>
            <strong>Nombre:</strong> {protein.fastaNombre}
          </p>
          <p>
            <strong>ID:</strong> {protein.idProteina}
          </p>
          <p>
            <strong>Fuente:</strong> {protein.fuente}
          </p>
          <p>
            <strong>Descripción:</strong> {protein.clasificacion}
          </p>
          <div className="form-row">
            <button className="btn" type="button" onClick={handleFavorite}>
              Agregar a favoritos
            </button>
            <Link className="btn secondary" to="/analysis" state={{ protein }}>
              Iniciar análisis
            </Link>
          </div>
        </div>

        <div>
          <div className="badge">Metadatos</div>
          <ul>
            <li>Organismo: {protein.organismo}</li>
            <li>Clasificación EC: {protein.ecClasificacion ?? "N/A"}</li>
            <li>
              Enlaces:{" "}
              <a
                href={`https://www.uniprot.org/uniprotkb/${protein.idProteina}/entry`}
                target="_blank"
                rel="noreferrer"
              >
                UniProt
              </a>{" "}
              ·{" "}
              <a
                href={`https://www.ncbi.nlm.nih.gov/search/all/?term=${protein.idProteina}`}
                target="_blank"
                rel="noreferrer"
              >
                NCBI
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="notice" style={{ marginTop: "1.5rem" }}>
        <strong>Secuencia FASTA:</strong>
        <pre style={{ whiteSpace: "pre-wrap" }}>{protein.fastaSecuencia}</pre>
      </div>
      <button className="btn secondary" type="button" onClick={() => navigate(-1)}>
        Volver
      </button>
    </section>
  );
}

export default ProteinDetailPage;