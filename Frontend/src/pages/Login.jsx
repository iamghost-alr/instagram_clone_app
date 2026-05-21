import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loading } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!usernameOrEmail || !password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      await login(usernameOrEmail, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-mockup" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            width: "280px",
            height: "500px",
            borderRadius: "36px",
            border: "12px solid #262626",
            background: "var(--bg-dark)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "20px"
          }}>
            <div style={{ width: "60px", height: "4px", backgroundColor: "#262626", borderRadius: "2px", margin: "0 auto 10px" }} />
            <div style={{
              flexGrow: 1,
              borderRadius: "16px",
              background: "linear-gradient(135deg, #f09433, #dc2743, #bc1888)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              color: "#fff",
              textAlign: "center",
              padding: "20px"
            }}>
              <div style={{ fontSize: "2rem", fontWeight: "bold", fontFamily: "Georgia, serif" }}>Instagram</div>
              <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>Connect with friends, share what you're up to, or see what's new from others.</div>
            </div>
            <div style={{ width: "30px", height: "30px", border: "2px solid #262626", borderRadius: "50%", margin: "10px auto 0" }} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div className="auth-card">
            <h1 className="auth-brand">Instagram</h1>
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
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-input-group">
                <input
                  type="text"
                  placeholder="Username or email"
                  className="auth-input"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
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
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>
          </div>

          <div className="auth-card" style={{ padding: "20px", marginTop: "0" }}>
            <p className="auth-footer" style={{ margin: "0" }}>
              Don't have an account?
              <Link to="/register" className="auth-link">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
