import LogoutButton from "../components/LogoutButton";
import Logo from "../components/Logo";

function Dashboard() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <p>No estás autenticado</p>;
  }

  return (
    <div style={{ padding: "32px", textAlign: "center" }}>
      <Logo />
      <LogoutButton />
      <h2>Bienvenido al dashboard privado 🚀</h2>
    </div>
  );
}

export default Dashboard;
