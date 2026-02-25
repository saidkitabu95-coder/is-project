function Navbar() {
  return (
    <div className="navbar">
      <h2>Pharmacy System</h2>

      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;
