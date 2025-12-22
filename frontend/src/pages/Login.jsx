import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import Logo from "../components/Logo";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // OAuth2PasswordRequestForm on the backend expects form-encoded fields
      const params = new URLSearchParams();
      params.append("username", email); // backend expects 'username' field
      params.append("password", password);

      const response = await fetch("http://127.0.0.1:8000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      if (!response.ok) {
        throw new Error("Credenciales incorrectas");
      }

      const data = await response.json();

      // Guardar token
      localStorage.setItem("token", data.access_token);

      // Comprobar role del usuario y redirigir según corresponda
      try {
        const meRes = await fetch("http://127.0.0.1:8000/users/me", {
          headers: { Authorization: `Bearer ${data.access_token}` },
        });
        if (meRes.ok) {
          const me = await meRes.json();
          if (me.role === "admin") {
            // ir a vista de administración
            navigate("/admin/users");
            return;
          }
        }
      } catch (err) {
        // si falla la comprobación, caerá a dashboard
      }

      alert("Login correcto");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Logo />
      <div className="login-container">
        <h2>Iniciar sesión</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <div className="alert error">{error}</div>
        )}

        <button type="submit">Iniciar Sesión</button>
      </form>

      <div style={{ marginTop: 12 }}>
        <Link to="/register">
          <button style={{ padding: '8px 16px', cursor: 'pointer' }}>Registrarse</button>
        </Link>
      </div>
      </div>
    </>
  );
}

export default Login;
