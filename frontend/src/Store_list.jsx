import { useEffect, useState } from "react";

function StoreList() {
  const [store, setStore] = useState([]);

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

  return (
    <div>
      <h2>Store List</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>

        <tbody>
          {store.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StoreList;
