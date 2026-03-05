import { NavLink, Outlet } from "react-router-dom";
import logo from "../assets/Logo_Genopolis.jpeg";
import { useAuth } from "../context/AuthContext.jsx";

const NAV_ITEMS = [
  { to: "/login", label: "Login", hideWhenAuth: true },
  { to: "/register", label: "Registro", hideWhenAuth: true },
  { to: "/", label: "Dashboard", requiresAuth: true },
  { to: "/search", label: "Búsqueda", requiresAuth: true },
  { to: "/favorites", label: "Favoritos", requiresAuth: true },
  { to: "/history", label: "Historial", requiresAuth: true },
  { to: "/analysis", label: "Análisis", requiresAuth: true },
  { to: "/profile", label: "Perfil", requiresAuth: true },
];

function Layout() {
  const { isAuthenticated } = useAuth();

  const filteredNav = NAV_ITEMS.filter((item) => {
    if (item.hideWhenAuth && isAuthenticated) return false;
    if (item.requiresAuth && !isAuthenticated) return false;
    return true;
  });

  return (
    <>
      <header className="header" role="banner">
        <a className="skip-link" href="#contenido">
          Saltar al contenido principal
        </a>
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div className="brand">
            <div className="brand__logo" aria-hidden="true">
              <img
                src={logo}
                alt="Genopolis"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div>
              <strong>Genopolis</strong>
              <div className="helper">Explorar • Analizar • Integrar</div>
            </div>
          </div>
          <nav className="nav" role="navigation" aria-label="Navegación principal">
            {filteredNav.map(({ to, label }) => (
              <NavLink key={to} to={to} end>
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main id="contenido" className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>

      <footer className="footer" role="contentinfo">
        <div className="container">
          <div>
            © 2026 Genopolis. <span className="badge">Maquetación</span>{" "}
            <span className="badge">Accesible</span>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Layout;