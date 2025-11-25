import { useEffect, useState } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No autorizado");
      return;
    }

    fetch("http://127.0.0.1:8000/admin/users", {
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

  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Usuarios registrados</h2>

      {users.length === 0 && <p>No hay usuarios registrados (o todos son admins)</p>}

      <ul style={{ marginTop: 20 }}>
        {users.map((u) => (
          <li
            key={u._id}
            style={{
              padding: "10px",
              marginBottom: "8px",
              background: "#eee",
              borderRadius: "8px",
            }}
          >
            <b>{u.username}</b> — {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
