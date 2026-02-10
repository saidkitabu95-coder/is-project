import { useState } from "react";

function AddStore() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch("http://127.0.0.1:8080/api/store/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        description,
        price,
        quantity,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("✅ Product added successfully");
      setName("");
      setDescription("");
      setPrice("");
      setQuantity("");
    } else {
      setMessage("❌ Error: " + JSON.stringify(data));
    }
  };

  return (
    <div>
      <h2>Add Store Product</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><br /><br />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        /><br /><br />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        /><br /><br />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        /><br /><br />

        <button type="submit">Save</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default AddStore;
