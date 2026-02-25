import { Link } from "react-router-dom";

function Sidebar() {
  const username = localStorage.getItem("username") || "";
  const isAdmin = localStorage.getItem("is_admin") === "true" || username.toLowerCase() === "admin";

  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/dashboard/store">Store</Link></li>
        <li><Link to="/dashboard/sales">Sales</Link></li>
        <li><Link to="/dashboard/payment">Payment</Link></li>
        {isAdmin && <li><Link to="/admin">Admin</Link></li>}
      </ul>
    </div>
  );
}

export default Sidebar;
