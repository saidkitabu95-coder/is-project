import { useEffect, useState } from "react";

function AddSale() {
  const [store, setStore] = useState([]);
  const [storeId, setStoreId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchStore = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://127.0.0.1:8080/api/store/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setStore(data);
    };

    fetchStore();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch("http://127.0.0.1:8080/api/sales/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        store: storeId,
        quantity,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("✅ Sale completed");
    } else {
      setMessage("❌ " + JSON.stringify(data));
    }
  };

  return (
    <div>
      <h2>Make Sale</h2>

      <form onSubmit={handleSubmit}>
        <select onChange={(e) => setStoreId(e.target.value)}>
          <option>Select product</option>
          {store.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} (Available: {item.quantity})
            </option>
          ))}
        </select>

        <br /><br />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <br /><br />
        <button type="submit">Sell</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default AddSale;
