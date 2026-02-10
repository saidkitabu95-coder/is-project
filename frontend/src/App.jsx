
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard"; 
import Navbar from "./Navbar"; 
import ProtectedRoute from "./Protectroute";  
import AddStore from "./Addstore";
import StoreList from "./Store_list";
import Sales from "./Addsales";
import Payment from "./Addpayment";



function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Navbar" element={<Navbar />} />
        <Route path="/Protectroute" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/Addstore" element={<AddStore />} />
        <Route path="/Store_list" element={<StoreList />} />
        <Route path="/Addsales" element={<Sales />} />
        <Route path="/Addpayment" element={<Payment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;






