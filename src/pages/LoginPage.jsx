import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", message: "" });
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setFeedback({
        type: "error",
        message: "Credenciales inválidas. Revisa correo y contraseña.",
      });
    }
  };

  return (
    <div className="grid cols-2">
      <section className="card">
        <h1>Iniciar sesión</h1>
        {feedback.message && (
          <p className={feedback.type === "error" ? "error" : "notice"}>
            {feedback.message}
          </p>
        )}
        <form onSubmit={handleSubmit} aria-labelledby="login-title">
          <div className="form-row">
            <label className="label" htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              className="input"
              type="email"
              required
              placeholder="tu@correo.com"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>
          <div className="form-row">
            <label className="label" htmlFor="pwd">
              Contraseña
            </label>
            <input
              id="pwd"
              className="input"
              type="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <div className="helper">
              Mínimo 8 caracteres · 1 mayúscula · 1 número
            </div>
          </div>
          <div className="form-row">
            <button className="btn" type="submit">
              Entrar
            </button>
            <Link className="btn secondary" to="/register">
              Crear cuenta
            </Link>
          </div>
        </form>
        <p className="helper">
          ¿Olvidaste tu contraseña? <a href="#">Recupérala</a>
        </p>
      </section>

      <aside className="card">
        <h2>Seguridad y accesibilidad</h2>
        <ul>
          <li>Validación de campos y mensajes claros.</li>
          <li>Navegable con teclado y lectores de pantalla.</li>
          <li>Contraste alto y estados de foco visibles.</li>
        </ul>
      </aside>
    </div>
  );
}

export default LoginPage;