import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, PlusSquare, User, LogOut, Compass } from "lucide-react";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isInfluencerOrAdmin = user.role === "influencer" || user.role === "admin";

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">Instagram</div>
      
      <ul className="sidebar-menu">
        <li>
          <Link
            to="/"
            className={`sidebar-item ${isActive("/") ? "sidebar-item-active" : ""}`}
          >
            <Home className="sidebar-item-icon" />
            <span className="sidebar-item-text">Home</span>
          </Link>
        </li>

        {isInfluencerOrAdmin && (
          <li>
            <Link
              to="/create"
              className={`sidebar-item ${isActive("/create") ? "sidebar-item-active" : ""}`}
            >
              <PlusSquare className="sidebar-item-icon" />
              <span className="sidebar-item-text">Create</span>
            </Link>
          </li>
        )}

        <li>
          <Link
            to={`/profile/${user._id}`}
            className={`sidebar-item ${isActive(`/profile/${user._id}`) ? "sidebar-item-active" : ""}`}
          >
            <User className="sidebar-item-icon" />
            <span className="sidebar-item-text">Profile</span>
          </Link>
        </li>

        <li className="sidebar-footer">
          <button
            onClick={logout}
            className="sidebar-item"
            style={{ background: "none", border: "none", width: "100%", textAlign: "left" }}
          >
            <LogOut className="sidebar-item-icon" />
            <span className="sidebar-item-text">Log Out</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
