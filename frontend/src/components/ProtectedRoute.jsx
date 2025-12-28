import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    if (!token) {
      setAuthenticated(false);
      return;
    }

    // Verificar que el token sea válido
    fetch("http://127.0.0.1:8000/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.ok) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      })
      .catch(() => setAuthenticated(false));
  }, [token]);

  if (authenticated === null) return <p>Cargando...</p>;
  return authenticated ? children : <Navigate to="/" />;
}
