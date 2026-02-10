import { useEffect, useState } from "react";

function AddPayment() {
  const [sales, setSales] = useState([]);
  const [saleId, setSaleId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSales = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://127.0.0.1:8080/api/sales/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setSales(data);
    };

    fetchSales();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch("http://127.0.0.1:8080/api/payments/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        sale: saleId,
        amount_paid: amount,
        payment_method: method,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("✅ Payment successful");
      setSaleId("");
      setAmount("");
      setMethod("");
    } else {
      setMessage("❌ " + JSON.stringify(data));
    }
  };

  return (
    <div>
      <h2>Make Payment</h2>

      <form onSubmit={handleSubmit}>
        <select onChange={(e) => setSaleId(e.target.value)}>
          <option>Select sale</option>
          {sales.map((sale) => (
            <option key={sale.id} value={sale.id}>
              Sale #{sale.id} - Total {sale.total_price}
            </option>
          ))}
        </select>

        <br /><br />

        <input
          type="number"
          placeholder="Amount paid"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <br /><br />

        <select onChange={(e) => setMethod(e.target.value)}>
          <option>Select payment method</option>
          <option value="cash">Cash</option>
          <option value="mobile">Mobile</option>
          <option value="card">Card</option>
        </select>

        <br /><br />
        <button type="submit">Pay</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default AddPayment;
