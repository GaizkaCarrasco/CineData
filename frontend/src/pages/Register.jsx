import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // Usa el mismo CSS del login

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Usuario creado correctamente 🚀" });
        setForm({ username: "", email: "", password: "" });
        // Redirigir al login para iniciar sesión
        setTimeout(() => navigate('/'), 700);
      } else {
        const err = await response.json();
        setMessage({ type: "error", text: err.detail });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Error de conexión con el servidor" });
    }
  };

  return (
    <div className="login-container">
      <h2>Crear cuenta</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          value={form.username}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Registrarse</button>
      </form>

      {message && (
        <div className={`alert ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
