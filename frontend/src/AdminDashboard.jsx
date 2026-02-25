import { useEffect, useMemo, useState } from "react";
import api from "./api";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "./dashboard.css";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stores, setStores] = useState([]);
  const [sales, setSales] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loginActivities, setLoginActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const adminName = localStorage.getItem("username") || "admin";

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      const [storeRes, saleRes, paymentRes, loginRes] = await Promise.all([
        api.get("/store/"),
        api.get("/sales/"),
        api.get("/payment/"),
        api.get("/login-activity/"),
      ]);

      setStores(storeRes.data);
      setSales(saleRes.data);
      setPayments(paymentRes.data);
      setLoginActivities(loginRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load admin dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalSalesAmount = useMemo(
    () => sales.reduce((sum, sale) => sum + Number(sale.total || 0), 0),
    [sales]
  );

  const totalPaymentsAmount = useMemo(
    () => payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
    [payments]
  );

  const pendingAmount = useMemo(
    () => totalSalesAmount - totalPaymentsAmount,
    [totalSalesAmount, totalPaymentsAmount]
  );

  const recentStores = useMemo(() => [...stores].slice(0, 5), [stores]);

  const recentSales = useMemo(() => [...sales].slice(0, 5), [sales]);

  const recentPayments = useMemo(() => [...payments].slice(0, 5), [payments]);

  const recentLogins = useMemo(() => [...loginActivities].slice(0, 5), [loginActivities]);

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-body">
        <Sidebar />

        <div className="dashboard-content admin-content">
          <div className="admin-header">
            <div>
              <h2>Admin Dashboard</h2>
              <p className="admin-subtitle">Logged in as: {adminName}</p>
            </div>
            <button className="admin-refresh-btn" onClick={fetchDashboardData}>
              Refresh
            </button>
          </div>

          {loading && <p>Loading dashboard...</p>}
          {error && <p className="admin-error">{error}</p>}

          {!loading && !error && (
            <>
              <div className="admin-stats-grid">
                <div className="admin-card">
                  <h3>Total Stores</h3>
                  <p>{stores.length}</p>
                </div>

                <div className="admin-card">
                  <h3>Total Sales</h3>
                  <p>{sales.length}</p>
                </div>

                <div className="admin-card">
                  <h3>Total Revenue</h3>
                  <p>${totalSalesAmount.toFixed(2)}</p>
                </div>

                <div className="admin-card">
                  <h3>Total Payments</h3>
                  <p>${totalPaymentsAmount.toFixed(2)}</p>
                </div>

                <div className="admin-card admin-card-alert">
                  <h3>Pending Balance</h3>
                  <p>${pendingAmount.toFixed(2)}</p>
                </div>
              </div>

              <div className="admin-tables-grid">
                <div className="admin-table-wrap">
                  <h3>Recent Stores</h3>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentStores.map((store) => (
                        <tr key={store.id}>
                          <td>{store.id}</td>
                          <td>{store.name}</td>
                          <td>{store.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="admin-table-wrap">
                  <h3>Recent Logins</h3>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentLogins.map((login) => (
                        <tr key={login.id}>
                          <td>{login.id}</td>
                          <td>{login.username}</td>
                          <td>{new Date(login.logged_in_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="admin-table-wrap">
                  <h3>Recent Sales</h3>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Store</th>
                        <th>Medicine</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSales.map((sale) => (
                        <tr key={sale.id}>
                          <td>{sale.id}</td>
                          <td>{sale.store}</td>
                          <td>{sale.medicine}</td>
                          <td>{sale.quantity}</td>
                          <td>${Number(sale.price || 0).toFixed(2)}</td>
                          <td>${Number(sale.total || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="admin-table-wrap">
                  <h3>Recent Payments</h3>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Sale</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPayments.map((payment) => (
                        <tr key={payment.id}>
                          <td>{payment.id}</td>
                          <td>{payment.sale}</td>
                          <td>${Number(payment.amount || 0).toFixed(2)}</td>
                          <td>{payment.method}</td>
                          <td>{new Date(payment.date).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
