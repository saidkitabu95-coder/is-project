import { useEffect, useMemo, useState } from "react";
import api from "./api";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "./Dashboard.css";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stores, setStores] = useState([]);
  const [sales, setSales] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loginActivities, setLoginActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [editing, setEditing] = useState({ type: "", id: null });
  const [editForm, setEditForm] = useState({});
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

  const recentLogins = useMemo(() => [...loginActivities].slice(0, 5), [loginActivities]);

  const storeNameById = useMemo(
    () => new Map(stores.map((store) => [store.id, store.name])),
    [stores]
  );

  const saleById = useMemo(
    () => new Map(sales.map((sale) => [sale.id, sale])),
    [sales]
  );

  const startEdit = (type, item) => {
    setEditing({ type, id: item.id });
    if (type === "store") {
      setEditForm({
        name: item.name || "",
        location: item.location || "",
        owner: item.owner || "",
      });
    }
    if (type === "sale") {
      setEditForm({
        store: item.store || "",
        medicine: item.medicine || "",
        quantity: item.quantity || 1,
        price: item.price || 0,
      });
    }
    if (type === "payment") {
      setEditForm({
        sale: item.sale || "",
        amount: item.amount || 0,
        method: item.method || "cash",
      });
    }
    setActionMessage("");
    setActionError("");
  };

  const cancelEdit = () => {
    setEditing({ type: "", id: null });
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editing.type || !editing.id) return;
    setActionMessage("");
    setActionError("");

    try {
      if (editing.type === "store") {
        await api.patch(`/store/${editing.id}/`, {
          name: editForm.name,
          location: editForm.location,
          owner: editForm.owner || null,
        });
        setActionMessage("Store updated successfully.");
      }
      if (editing.type === "sale") {
        await api.patch(`/sales/${editing.id}/`, {
          store: editForm.store,
          medicine: editForm.medicine,
          quantity: Number(editForm.quantity),
          price: Number(editForm.price),
        });
        setActionMessage("Sale updated successfully.");
      }
      if (editing.type === "payment") {
        await api.patch(`/payment/${editing.id}/`, {
          sale: editForm.sale,
          amount: Number(editForm.amount),
          method: editForm.method,
        });
        setActionMessage("Payment updated successfully.");
      }

      cancelEdit();
      fetchDashboardData();
      setTimeout(() => setActionMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setActionError("Failed to save changes.");
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    setActionMessage("");
    setActionError("");

    try {
      if (type === "store") {
        await api.delete(`/store/${id}/`);
        setActionMessage("Store deleted.");
      }
      if (type === "sale") {
        await api.delete(`/sales/${id}/`);
        setActionMessage("Sale deleted.");
      }
      if (type === "payment") {
        await api.delete(`/payment/${id}/`);
        setActionMessage("Payment deleted.");
      }
      fetchDashboardData();
      setTimeout(() => setActionMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setActionError("Failed to delete record.");
    }
  };

  const handleApprove = async (type, item) => {
    setActionMessage("");
    setActionError("");

    try {
      if (type === "store") {
        await api.patch(`/store/${item.id}/`, { approved: !item.approved });
        setActionMessage(item.approved ? "Store unapproved." : "Store approved.");
      }
      if (type === "sale") {
        await api.patch(`/sales/${item.id}/`, { approved: !item.approved });
        setActionMessage(item.approved ? "Sale unapproved." : "Sale approved.");
      }
      if (type === "payment") {
        await api.patch(`/payment/${item.id}/`, { approved: !item.approved });
        setActionMessage(item.approved ? "Payment unapproved." : "Payment approved.");
      }
      fetchDashboardData();
      setTimeout(() => setActionMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setActionError("Failed to update approval status.");
    }
  };

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
          {actionError && <p className="admin-error">{actionError}</p>}
          {actionMessage && <p className="admin-success">{actionMessage}</p>}

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
                  <h3>Stores</h3>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Approved</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stores.map((store) => (
                        <tr key={store.id}>
                          <td>{store.id}</td>
                          <td>{store.name}</td>
                          <td>{store.location}</td>
                          <td>{store.approved ? "Yes" : "No"}</td>
                          <td>
                            <button
                              className="admin-action-btn"
                              onClick={() => startEdit("store", store)}
                            >
                              Edit
                            </button>
                            <button
                              className="admin-action-btn admin-action-approve"
                              onClick={() => handleApprove("store", store)}
                            >
                              {store.approved ? "Unapprove" : "Approve"}
                            </button>
                            <button
                              className="admin-action-btn admin-action-danger"
                              onClick={() => handleDelete("store", store.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {editing.type === "store" && (
                    <div className="admin-edit-card">
                      <h4>Edit Store #{editing.id}</h4>
                      <div className="admin-edit-grid">
                        <label>
                          Name
                          <input
                            type="text"
                            value={editForm.name || ""}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          />
                        </label>
                        <label>
                          Location
                          <input
                            type="text"
                            value={editForm.location || ""}
                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          />
                        </label>
                      </div>
                      <div className="admin-edit-actions">
                        <button className="admin-action-btn admin-action-primary" onClick={saveEdit}>
                          Save
                        </button>
                        <button className="admin-action-btn" onClick={cancelEdit}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
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
                  <h3>Sales</h3>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Store</th>
                        <th>Medicine</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                        <th>Approved</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales.map((sale) => (
                        <tr key={sale.id}>
                          <td>{sale.id}</td>
                          <td>{storeNameById.get(sale.store) || sale.store}</td>
                          <td>{sale.medicine}</td>
                          <td>{sale.quantity}</td>
                          <td>${Number(sale.price || 0).toFixed(2)}</td>
                          <td>${Number(sale.total || 0).toFixed(2)}</td>
                          <td>{sale.approved ? "Yes" : "No"}</td>
                          <td>
                            <button
                              className="admin-action-btn"
                              onClick={() => startEdit("sale", sale)}
                            >
                              Edit
                            </button>
                            <button
                              className="admin-action-btn admin-action-approve"
                              onClick={() => handleApprove("sale", sale)}
                            >
                              {sale.approved ? "Unapprove" : "Approve"}
                            </button>
                            <button
                              className="admin-action-btn admin-action-danger"
                              onClick={() => handleDelete("sale", sale.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {editing.type === "sale" && (
                    <div className="admin-edit-card">
                      <h4>Edit Sale #{editing.id}</h4>
                      <div className="admin-edit-grid">
                        <label>
                          Store
                          <select
                            value={editForm.store || ""}
                            onChange={(e) => setEditForm({ ...editForm, store: e.target.value })}
                          >
                            <option value="">Select a store</option>
                            {stores.map((store) => (
                              <option key={store.id} value={store.id}>
                                {store.name}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          Medicine
                          <input
                            type="text"
                            value={editForm.medicine || ""}
                            onChange={(e) => setEditForm({ ...editForm, medicine: e.target.value })}
                          />
                        </label>
                        <label>
                          Quantity
                          <input
                            type="number"
                            min="1"
                            value={editForm.quantity || 1}
                            onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                          />
                        </label>
                        <label>
                          Price
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={editForm.price || 0}
                            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                          />
                        </label>
                      </div>
                      <div className="admin-edit-actions">
                        <button className="admin-action-btn admin-action-primary" onClick={saveEdit}>
                          Save
                        </button>
                        <button className="admin-action-btn" onClick={cancelEdit}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="admin-table-wrap">
                  <h3>Payments</h3>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Sale</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Date</th>
                        <th>Approved</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id}>
                          <td>{payment.id}</td>
                          <td>
                            Sale #{payment.sale}
                            {saleById.has(payment.sale) ? ` • ${saleById.get(payment.sale).medicine}` : ""}
                          </td>
                          <td>${Number(payment.amount || 0).toFixed(2)}</td>
                          <td>{payment.method}</td>
                          <td>{new Date(payment.date).toLocaleString()}</td>
                          <td>{payment.approved ? "Yes" : "No"}</td>
                          <td>
                            <button
                              className="admin-action-btn"
                              onClick={() => startEdit("payment", payment)}
                            >
                              Edit
                            </button>
                            <button
                              className="admin-action-btn admin-action-approve"
                              onClick={() => handleApprove("payment", payment)}
                            >
                              {payment.approved ? "Unapprove" : "Approve"}
                            </button>
                            <button
                              className="admin-action-btn admin-action-danger"
                              onClick={() => handleDelete("payment", payment.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {editing.type === "payment" && (
                    <div className="admin-edit-card">
                      <h4>Edit Payment #{editing.id}</h4>
                      <div className="admin-edit-grid">
                        <label>
                          Sale
                          <select
                            value={editForm.sale || ""}
                            onChange={(e) => setEditForm({ ...editForm, sale: e.target.value })}
                          >
                            <option value="">Select a sale</option>
                            {sales.map((sale) => (
                              <option key={sale.id} value={sale.id}>
                                Sale #{sale.id} - {sale.medicine}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          Amount
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={editForm.amount || 0}
                            onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                          />
                        </label>
                        <label>
                          Method
                          <select
                            value={editForm.method || "cash"}
                            onChange={(e) => setEditForm({ ...editForm, method: e.target.value })}
                          >
                            <option value="cash">Cash</option>
                            <option value="card">Card</option>
                            <option value="transfer">Transfer</option>
                          </select>
                        </label>
                      </div>
                      <div className="admin-edit-actions">
                        <button className="admin-action-btn admin-action-primary" onClick={saveEdit}>
                          Save
                        </button>
                        <button className="admin-action-btn" onClick={cancelEdit}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
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
