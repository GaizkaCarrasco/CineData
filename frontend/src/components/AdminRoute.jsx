import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    if (!token) {
      setAllowed(false);
      return;
    }

    fetch("http://127.0.0.1:8000/users/me", {
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
