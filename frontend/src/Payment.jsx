import React, { useState, useEffect } from "react";
import api from "./api";

function Payment() {
  const [payments, setPayments] = useState([]);
  const [sales, setSales] = useState([]);
  const [saleId, setSaleId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const paymentsRes = await api.get("/payment/");
        setPayments(paymentsRes.data);

        const salesRes = await api.get("/sales/");
        setSales(salesRes.data);
        if (salesRes.data.length > 0) {
          setSaleId(salesRes.data[0].id);
        }
        setError("");
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Error loading payments. Make sure backend is running on port 8080.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!saleId || !amount) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await api.post("/payment/", {
        sale: saleId,
        amount,
        method,
      });
      setMessage("Payment added successfully!");
      setSaleId("");
      setAmount("");
      setMethod("cash");
      setError("");

      // Refresh payments list
      const paymentsRes = await api.get("/payment/");
      setPayments(paymentsRes.data);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error adding payment:", err);
      setError("Error adding payment. " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Payments</h2>

      {error && <div style={{ color: "red", padding: "10px", backgroundColor: "#ffe0e0", borderRadius: "5px", marginBottom: "15px" }}>{error}</div>}
      {message && <div style={{ color: "green", padding: "10px", backgroundColor: "#e0ffe0", borderRadius: "5px", marginBottom: "15px" }}>{message}</div>}

      {sales.length === 0 && !loading && (
        <div style={{ color: "orange", padding: "10px", backgroundColor: "#fff3cd", borderRadius: "5px", marginBottom: "15px" }}>
          ⚠️ No sales found. Please add a sale first from the Sales menu.
        </div>
      )}

      <div style={{ marginBottom: "30px", padding: "15px", backgroundColor: "#f9f9f9", borderRadius: "8px", border: "1px solid #ddd" }}>
        <h3>Add New Payment</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Sale:</label>
            <select
              value={saleId}
              onChange={(e) => setSaleId(e.target.value)}
              style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc", boxSizing: "border-box" }}
            >
              <option value="">Select a sale</option>
              {sales.map((sale) => (
                <option key={sale.id} value={sale.id}>
                  Sale #{sale.id} - {sale.medicine}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Amount:</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              required
              style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Method:</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc", boxSizing: "border-box" }}
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>

          <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Add Payment</button>
        </form>
      </div>

      <div>
        <h3>Payment List</h3>
        {loading && <p>Loading payments...</p>}
        {!loading && payments.length === 0 && <p>No payments found. Add one above!</p>}
        {!loading && payments.length > 0 && (
          <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: "#4CAF50", color: "white" }}>
              <tr>
                <th>ID</th>
                <th>Sale</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{payment.sale}</td>
                  <td>${parseFloat(payment.amount).toFixed(2)}</td>
                  <td>{payment.method}</td>
                  <td>{new Date(payment.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Payment;
