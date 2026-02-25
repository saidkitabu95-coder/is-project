import React, { useState, useEffect } from "react";
import api from "./api";

function Store() {
  const [stores, setStores] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await api.get("/store/");
      setStores(res.data);
      setError("");
    } catch (err) {
      console.error("Error loading stores:", err);
      setError("Error loading stores. Make sure backend is running on port 8080.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !location) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await api.post("/store/", { name, location });
      setSuccess("Store added successfully!");
      setName("");
      setLocation("");
      setError("");
      fetchStores();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error adding store:", err);
      setError("Error adding store. " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Stores</h2>

      {error && <div style={{ color: "red", padding: "10px", backgroundColor: "#ffe0e0", borderRadius: "5px", marginBottom: "15px" }}>{error}</div>}
      {success && <div style={{ color: "green", padding: "10px", backgroundColor: "#e0ffe0", borderRadius: "5px", marginBottom: "15px" }}>{success}</div>}

      <div style={{ marginBottom: "30px", padding: "15px", backgroundColor: "#f9f9f9", borderRadius: "8px", border: "1px solid #ddd" }}>
        <h3>Add New Store</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Store Name:</label>
            <input
              type="text"
              placeholder="Enter store name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Location:</label>
            <input
              type="text"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc", boxSizing: "border-box" }}
            />
          </div>
          <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Add Store</button>
        </form>
      </div>

      <div>
        <h3>Store List</h3>
        {loading && <p>Loading stores...</p>}
        {!loading && stores.length === 0 && <p>No stores found. Add one above!</p>}
        {!loading && stores.length > 0 && (
          <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: "#4CAF50", color: "white" }}>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store.id}>
                  <td>{store.id}</td>
                  <td>{store.name}</td>
                  <td>{store.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Store;

