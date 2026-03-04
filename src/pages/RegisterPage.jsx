import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function sanitizeUsername(name, email) {
  const base = name?.trim() ? name.trim().toLowerCase() : "";
  if (base) {
    return base
      .replace(/\s+/g, "_")
      .replace(/[^\w-]/g, "")
      .substring(0, 30) || email.split("@")[0];
  }
  return email.split("@")[0];
}

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", message: "" });

    if (form.password !== form.confirmPassword) {
      setFeedback({ type: "error", message: "Las contraseñas no coinciden." });
      return;
    }
    if (!form.acceptTerms) {
      setFeedback({
        type: "error",
        message: "Debes aceptar los términos y condiciones.",
      });
      return;
    }

    try {
      const username = sanitizeUsername(form.fullName, form.email);
      await register({
        username,
        email: form.email,
        password: form.password,
        role: "USER",
      });
      setFeedback({
        type: "success",
        message: "Registro exitoso. Te llevaremos al login.",
      });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      setFeedback({
        type: "error",
        message: "No se pudo completar el registro. Intenta más tarde.",
      });
    }
  };

  return (
    <section className="card" style={{ maxWidth: "700px", marginInline: "auto" }}>
      <h1>Crear cuenta</h1>
      {feedback.message && (
        <p className={feedback.type === "error" ? "error" : "notice"}>
          {feedback.message}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label className="label" htmlFor="name">
            Nombre completo
          </label>
          <input
            id="name"
            className="input"
            type="text"
            placeholder="Nombre y apellidos"
            required
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        </div>
        <div className="form-row">
          <label className="label" htmlFor="remail">
            Correo electrónico
          </label>
          <input
            id="remail"
            className="input"
            type="email"
            placeholder="tu@correo.com"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="form-row grid cols-2">
          <div>
            <label className="label" htmlFor="rpwd">
              Contraseña
            </label>
            <input
              id="rpwd"
              className="input"
              type="password"
              placeholder="••••••••"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div>
            <label className="label" htmlFor="rcpwd">
              Confirmar contraseña
            </label>
            <input
              id="rcpwd"
              className="input"
              type="password"
              placeholder="••••••••"
              required
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
          </div>
        </div>
        <div className="form-row">
          <label>
            <input
              type="checkbox"
              checked={form.acceptTerms}
              onChange={(e) =>
                setForm({ ...form, acceptTerms: e.target.checked })
              }
              required
            />{" "}
            Acepto términos y condiciones
          </label>
        </div>
        <div className="form-row">
          <button className="btn" type="submit">
            Registrarme
          </button>
          <Link className="btn secondary" to="/login">
            Volver a Login
          </Link>
        </div>
      </form>
    </section>
  );
}

export default RegisterPage;