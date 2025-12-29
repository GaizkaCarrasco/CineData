import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

// Usar el API Gateway como punto de entrada
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    if (!token) {
      setAllowed(false);
      return;
    }

    fetch(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((user) => {
        if (user.role === "admin") setAllowed(true);
        else setAllowed(false);
      })
      .catch(() => setAllowed(false));
  }, [token]);

  if (allowed === null) return <p>Cargando...</p>;
  return allowed ? children : <Navigate to="/" />;
}
