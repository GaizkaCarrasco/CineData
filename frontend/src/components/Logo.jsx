export default function Logo() {
  return (
    <img
      src="/logo.jpg"
      alt="CineData Logo"
      style={{
        position: "fixed",
        top: 16,
        left: 16,
        width: 80,
        height: 80,
        objectFit: "contain",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    />
  );
}
