import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { userService } from "../services/userService.js";
import { authService } from "../services/authService.js";

const DEFAULT_PROFILE = {
  firstName: "",
  lastName: "",
  address: "",
  gender: "OTHER",
  birthDate: "",
};

function splitName(fullName) {
  const tokens = fullName.trim().split(/\s+/);
  if (tokens.length === 0) {
    return { firstName: "", lastName: "" };
  }
  if (tokens.length === 1) {
    return { firstName: tokens[0], lastName: "" };
  }
  return {
    firstName: tokens.slice(0, -1).join(" "),
    lastName: tokens.slice(-1).join(" "),
  };
}

function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    address: "",
    gender: "OTHER",
    birthDate: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await userService.get(user.id);
        setProfile(data);
        setForm((prev) => ({
          ...prev,
          fullName: `${data.firstName} ${data.lastName}`.trim(),
          address: data.address ?? "",
          gender: data.gender ?? "OTHER",
          birthDate: data.birthDate
            ? data.birthDate.slice(0, 16)
            : "",
        }));
      } catch {
        setProfile(null);
        setForm((prev) => ({
          ...prev,
          fullName: "",
          address: "",
          gender: "OTHER",
          birthDate: "",
        }));
      }
    };
    load();
  }, [user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    const { firstName, lastName } = splitName(form.fullName);
    if (!firstName) {
      setStatus({ type: "error", message: "Debes indicar nombre completo válido." });
      return;
    }

    const payload = {
      firstName,
      lastName,
      address: form.address || "Sin dirección",
      gender: form.gender || "OTHER",
      birthDate: form.birthDate
        ? `${form.birthDate}:00`
        : new Date().toISOString(),
    };

    try {
      if (profile) {
        await userService.update(user.id, payload);
      } else {
        await userService.create(payload);
      }

      if (form.newPassword) {
        if (form.newPassword !== form.confirmPassword) {
          setStatus({
            type: "error",
            message: "La confirmación de contraseña no coincide.",
          });
          return;
        }
        await authService.update({
          email: user.email,
          password: form.newPassword,
        });
      }

      setStatus({
        type: "success",
        message: "Perfil actualizado correctamente.",
      });
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: "Error al actualizar el perfil.",
      });
    }
  };

  const fullNameValue =
    form.fullName || `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim();

  return (
    <section className="card" style={{ maxWidth: "700px", marginInline: "auto" }}>
      <h1>Perfil de usuario</h1>
      {status.message && (
        <p className={status.type === "error" ? "error" : "notice"}>
          {status.message}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label className="label" htmlFor="pname">Nombre completo</label>
          <input
            id="pname"
            className="input"
            value={fullNameValue}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
          />
        </div>

        <div className="form-row">
          <label className="label" htmlFor="pemail">Correo</label>
          <input
            id="pemail"
            className="input"
            type="email"
            value={user.email ?? ""}
            disabled
          />
        </div>

        <div className="form-row">
          <label className="label" htmlFor="addr">Dirección</label>
          <input
            id="addr"
            className="input"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Dirección de contacto"
          />
        </div>

        <div className="form-row grid cols-2">
          <div>
            <label className="label" htmlFor="gender">Género</label>
            <select
              id="gender"
              className="input"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="MALE">MALE</option>
              <option value="FEMALE">FEMALE</option>
              <option value="NON_BINARY">NON_BINARY</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="birth">Fecha de nacimiento</label>
            <input
              id="birth"
              className="input"
              type="datetime-local"
              value={form.birthDate}
              onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row grid cols-2">
          <div>
            <label className="label" htmlFor="npwd">Nueva contraseña</label>
            <input
              id="npwd"
              className="input"
              type="password"
              placeholder="••••••••"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            />
          </div>
          <div>
            <label className="label" htmlFor="cpwd">Confirmar contraseña</label>
            <input
              id="cpwd"
              className="input"
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
          </div>
        </div>

        <div className="form-row">
          <button className="btn" type="submit">
            Guardar cambios
          </button>
        </div>
      </form>
    </section>
  );
}

export default ProfilePage;