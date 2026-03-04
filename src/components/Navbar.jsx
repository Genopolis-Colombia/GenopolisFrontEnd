import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="container nav-content">
        <div className="brand">
          <div className="brand__logo">G</div>
          <span>Genopolis</span>
        </div>

        <nav className="links">
          <Link to="/">Inicio</Link>
          {isAuthenticated && <Link to="/profile">Perfil</Link>}
          {isAuthenticated && <Link to="/proteins">Proteínas</Link>}
          {isAuthenticated && <Link to="/favorites">Favoritos</Link>}

          {!isAuthenticated && <Link to="/login">Ingresar</Link>}
          {!isAuthenticated && <Link to="/register">Registro</Link>}

          {isAuthenticated && (
            <button className="btn secondary" onClick={handleLogout}>
              Cerrar sesión ({user?.username})
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;