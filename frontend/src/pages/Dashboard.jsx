function Dashboard() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <p>No estás autenticado</p>;
  }

  return <h2>Bienvenido al dashboard privado 🚀</h2>;
}

export default Dashboard;
