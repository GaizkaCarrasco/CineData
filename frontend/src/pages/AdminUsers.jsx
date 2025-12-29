import { useEffect, useState } from "react";
import LogoutButton from "../components/LogoutButton";
import Logo from "../components/Logo";
// Usar el API Gateway como punto de entrada
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No autorizado");
      return;
    }

    fetch(`${API_URL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("No tienes permisos");
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => setError(err.message));
  }, []);

  const handleDelete = async (user_id) => {
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch(`${API_URL}/admin/users/${user_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const err = await response.json();
        alert(err.detail || "Error al borrar usuario");
        return;
      }

      // Actualizar la lista de usuarios eliminando el usuario borrado
      setUsers(users.filter((u) => u._id !== user_id));
    } catch (err) {
      alert("Error de conexión");
    }
  };

  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;

  // Calcular el ancho mínimo basado en "username - email" más largo
  const longestText = users.length > 0
    ? Math.max(...users.map((u) => `${u.username} — ${u.email}`.length))
    : 10;
  const minWidth = `${longestText * 8.5 + 50}px`; // aprox 8.5px por carácter + espacio para botón

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <Logo />
      <LogoutButton />
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Usuarios registrados</h2>

      {users.length === 0 && <p>No hay usuarios registrados (o todos son admins)</p>}

      <ul
        style={{
          marginTop: 20,
          listStyle: "none",
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          maxHeight: 420,
          overflowY: "auto",
          paddingRight: 6,
        }}
      >
        {users.map((u) => (
          <li
            key={u._id}
            style={{
              padding: "10px",
              background: "#eee",
              borderRadius: "8px",
              color: "#111",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              minWidth: minWidth,
            }}
          >
            <span>
              <b style={{ color: "#000" }}>{u.username}</b> — {u.email}
            </span>
            <button
              onClick={() => {
                if (confirm(`¿Estás seguro de que quieres borrar a ${u.username}?`)) {
                  handleDelete(u._id);
                }
              }}
              style={{
                background: "#42a5f5",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: 32,
                height: 32,
                padding: 0,
                cursor: "pointer",
                fontSize: 20,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
                letterSpacing: 0,
                transition: "transform 0.1s ease, box-shadow 0.1s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
