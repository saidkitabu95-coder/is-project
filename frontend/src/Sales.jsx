import { useEffect, useState } from "react";
import api from "./api";
import "./AddSale.css";

function Sales() {
  const [storeId, setStoreId] = useState("");
  const [medicine, setMedicine] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [stores, setStores] = useState([]);
  const [sales, setSales] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const storesRes = await api.get("/store/");
        setStores(storesRes.data);
        if (storesRes.data.length > 0) {
          setStoreId(storesRes.data[0].id);
        }

        const salesRes = await api.get("/sales/");
        setSales(salesRes.data);
        setError("");
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Error loading data. Make sure backend is running on port 8080.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!medicine || !quantity || !price) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await api.post("/sales/", {
        store: storeId,
        medicine,
        quantity,
        price,
      });
      setMessage("Sale added successfully!");
      setMedicine("");
      setQuantity(1);
      setPrice(0);
      setError("");

      // Refresh sales list
      const salesRes = await api.get("/sales/");
      setSales(salesRes.data);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error adding sale:", err);
      setError("Error adding sale. " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Sales</h2>

      {error && <div style={{ color: "red", padding: "10px", backgroundColor: "#ffe0e0", borderRadius: "5px", marginBottom: "15px" }}>{error}</div>}
      {message && <div style={{ color: "green", padding: "10px", backgroundColor: "#e0ffe0", borderRadius: "5px", marginBottom: "15px" }}>{message}</div>}

      {stores.length === 0 && !loading && (
        <div style={{ color: "orange", padding: "10px", backgroundColor: "#fff3cd", borderRadius: "5px", marginBottom: "15px" }}
        >
          ⚠️ No stores found. Please add a store first from the Store menu.
        </div>
      )}

      <div style={{ marginBottom: "30px", padding: "15px", backgroundColor: "#f9f9f9", borderRadius: "8px", border: "1px solid #ddd" }}>
        <h3>Add New Sale</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Store:</label>
            <select
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc", boxSizing: "border-box" }}
            >
              <option value="">Select a store</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Medicine:</label>
            <input
              type="text"
              placeholder="Enter medicine name"
              value={medicine}
              onChange={(e) => setMedicine(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              required
              style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Price:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="0.01"
              required
              style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc", boxSizing: "border-box" }}
            />
          </div>

          <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Add Sale</button>
        </form>
      </div>

      <div>
        <h3>Sales List</h3>
        {loading && <p>Loading sales...</p>}
        {!loading && sales.length === 0 && <p>No sales found. Add one above!</p>}
        {!loading && sales.length > 0 && (
          <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: "#4CAF50", color: "white" }}>
              <tr>
                <th>ID</th>
                <th>Store</th>
                <th>Medicine</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id}>
                  <td>{sale.id}</td>
                  <td>{sale.store}</td>
                  <td>{sale.medicine}</td>
                  <td>{sale.quantity}</td>
                  <td>${parseFloat(sale.price).toFixed(2)}</td>
                  <td>${parseFloat(sale.total).toFixed(2)}</td>
                  <td>{new Date(sale.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Sales;
