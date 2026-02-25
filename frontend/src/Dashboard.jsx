import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Store from "./Store";
import Sales from "./Sales";
import Payment from "./Payment";
import "./dashboard.css";
import { useEffect, useState } from "react";

function Dashboard() {
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("username");
    const admin = localStorage.getItem("is_admin") === "true";
    setUsername(user || "Guest");
    setIsAdmin(admin);
  }, []);

  return (
    <div className="dashboard">
      <Navbar />

      <div className="dashboard-body">
        <Sidebar />

        <div className="dashboard-content">
          <div style={{ padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "8px", marginBottom: "20px" }}>
            <h3>Welcome, {username}!</h3>
            {isAdmin && <p style={{ color: "green", fontWeight: "bold" }}>✓ Admin Access</p>}
          </div>

          <Routes>
            <Route path="/" element={<h2>Welcome to Dashboard</h2>} />
            <Route path="/store" element={<Store />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/payment" element={<Payment />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;


