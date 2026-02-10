import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Store from "./Store";
import Sales from "./Sales";
import Payment from "./Payment";
import "./dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      <Navbar />

      <div className="dashboard-body">
        <Sidebar />

        <div className="dashboard-content">
          <Routes>
            <Route path="/" element={<h2>Welcome to Dashboard</h2>} />
            <Route path="store" element={<Store />} />
            <Route path="sales" element={<Sales />} />
            <Route path="payment" element={<Payment />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;


