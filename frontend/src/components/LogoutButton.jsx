import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      if (token) {
        await fetch("http://127.0.0.1:8000/users/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      // Ignore network errors on logout; proceed to clear session
    } finally {
      localStorage.removeItem("token");
      navigate("/");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        padding: "10px 14px",
        background: "#42a5f5",
        color: "#fff",
        border: "none",
        borderRadius: 10,
        cursor: loading ? "not-allowed" : "pointer",
        fontWeight: 600,
        boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
        transition: "transform 0.12s ease, box-shadow 0.12s ease",
      }}
      disabled={loading}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.22)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.18)";
      }}
    >
      {loading ? "Cerrando..." : "Cerrar sesión"}
    </button>
  );
}
