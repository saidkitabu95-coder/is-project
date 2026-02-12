import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
  // 🔐 check kama user ame-login (JWT token)
  const isAuthenticated = !!localStorage.getItem("access_token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Home route */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
          }
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/navbar" element={<Navbar />} />

        <Route
          path="/addstore"
          element={
            <ProtectedRoute>
              <AddStore />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Store_list"
          element={
            <ProtectedRoute>
              <StoreList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Addsales"
          element={
            <ProtectedRoute>
              <Sales />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Addpayment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
