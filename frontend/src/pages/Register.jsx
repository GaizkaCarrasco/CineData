import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // Usa el mismo CSS del login
import Logo from "../components/Logo";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "@gmail.com",
    password: "",
  });

  // checkbox para indicar si se trata de un admin
  const [isAdmin, setIsAdmin] = useState(false);

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
      // Elegir endpoint según checkbox
      const url = isAdmin
        ? "http://127.0.0.1:8000/admin/open-create-admin"
        : "http://127.0.0.1:8000/users/register";

      // Payload: enviar sólo username/email/password (sin isAdmin)
      const payload = {
        username: form.username,
        email: form.email,
        password: form.password,
      };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Usuario creado correctamente 🚀" });
        setForm({ username: "", email: "@gmail.com", password: "" });
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
    <>
      <Logo />
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

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            aria-label="Soy admin"
          />
          <span className="checkbox-label">Soy admin</span>
        </label>

        <button type="submit">Registrarse</button>
      </form>

      {message && (
        <div className={`alert ${message.type}`}>
          {message.text}
        </div>
      )}
      </div>
    </>
  );
}
