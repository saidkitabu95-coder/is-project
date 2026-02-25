import { useState } from "react";
import api from "./api";
import "./auth.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!username || !password) {
      setMessage("Please enter username and password");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/login/", {
        username,
        password,
      });

      const storedUsername = response.data.username || username;
      const isAdmin = Boolean(response.data.is_admin) || storedUsername.toLowerCase() === "admin";

      setMessage("Login successful! Redirecting...");
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("username", storedUsername);
      localStorage.setItem("is_admin", String(isAdmin));

      setTimeout(() => {
        window.location.href = isAdmin ? "/admin" : "/dashboard";
      }, 500);
    } catch (error) {
      console.error("Login error:", error);
      const errorMsg = error.response?.data?.error || error.message || "Invalid credentials";
      setMessage("❌ " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </form>

        {message && <p className="message" style={{ color: message.includes("✓") ? "green" : "red" }}>{message}</p>}

        <div className="auth-link">
          <p>
            New user? <a href="/register">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
