import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!username || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      await register(username, email, password, role);
      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div className="auth-card" style={{ width: "350px" }}>
          <h1 className="auth-brand">Instagram</h1>
          <p style={{
            color: "var(--text-secondary)",
            fontSize: "0.9rem",
            fontWeight: "600",
            textAlign: "center",
            marginBottom: "20px"
          }}>
            Sign up to see photos and videos from your friends.
          </p>

          {error && (
            <div style={{
              color: "var(--ig-red)",
              backgroundColor: "rgba(255, 48, 64, 0.1)",
              border: "1px solid rgba(255, 48, 64, 0.2)",
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              fontSize: "0.8rem",
              marginBottom: "16px",
              textAlign: "center"
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              color: "#4caf50",
              backgroundColor: "rgba(76, 175, 80, 0.1)",
              border: "1px solid rgba(76, 175, 80, 0.2)",
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              fontSize: "0.8rem",
              marginBottom: "16px",
              textAlign: "center"
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-input-group">
              <input
                type="text"
                placeholder="Username"
                className="auth-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="auth-input-group">
              <input
                type="email"
                placeholder="Email address"
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="auth-input-group">
              <input
                type="password"
                placeholder="Password"
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="auth-input-group">
              <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "600", display: "block", marginBottom: "4px" }}>
                Account Role (Choose Influencer to Post)
              </label>
              <select
                className="auth-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">User (View and interact only)</option>
                <option value="influencer">Influencer (Create posts and upload images)</option>
              </select>
            </div>
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Signing up..." : "Sign up"}
            </button>
          </form>
        </div>

        <div className="auth-card" style={{ padding: "20px", marginTop: "0" }}>
          <p className="auth-footer" style={{ margin: "0" }}>
            Have an account?
            <Link to="/login" className="auth-link">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
