import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/dashboard/store">Store</Link></li>
        <li><Link to="/dashboard/sales">Sales</Link></li>
        <li><Link to="/dashboard/payment">Payment</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;

