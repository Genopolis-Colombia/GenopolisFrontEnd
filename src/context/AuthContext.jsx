import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authService } from "../services/authService.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("accessToken"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("authUser");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    const validate = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const payload = await authService.validate(token);
        setUser(payload);
        localStorage.setItem("authUser", JSON.stringify(payload));
      } catch (err) {
        console.warn("Token inválido", err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = async ({ username, password }) => {
    const { accessToken } = await authService.login({ username, password });
    localStorage.setItem("accessToken", accessToken);
    setToken(accessToken);

    const payload = await authService.validate(accessToken);
    setUser(payload);
    localStorage.setItem("authUser", JSON.stringify(payload));
  };

  const register = async (payload) => authService.register(payload);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authUser");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      loading,
    }),
    [token, user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {loading ? <p className="container">Cargando sesión...</p> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);