import { Link } from "react-router-dom";

const DASHBOARD_LINKS = [
  { to: "/search", title: "🔍 Buscar proteínas", description: "Consulta por nombre, ID o palabra clave." },
  { to: "/favorites", title: "⭐ Mis favoritos", description: "Tu colección personal de proteínas." },
  { to: "/history", title: "📜 Historial", description: "Búsquedas recientes y reutilización." },
  { to: "/analysis", title: "🧪 Análisis e integración", description: "Herramientas de análisis y fuentes externas." },
  { to: "/profile", title: "👤 Perfil", description: "Datos de usuario y preferencias." },
  { to: "/login", title: "🚪 Cerrar sesión", description: "Finaliza la sesión actual." },
];

function DashboardPage() {
  return (
    <section className="card">
      <h1>Dashboard</h1>
      <p className="helper">Accesos rápidos a funcionalidades principales.</p>
      <div className="grid cols-3" role="list">
        {DASHBOARD_LINKS.map((item) => (
          <Link key={item.to} role="listitem" className="card" to={item.to}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default DashboardPage;