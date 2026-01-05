import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import "../styles/layout/header.css";

export default function TopNavbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="app-header">
      <div className="app-header-left">
        <span className="app-logo">Multi-Tenant SaaS</span>

        <nav className="app-nav">
          <NavLink to="/dashboard" className="app-nav-link">
            Dashboard
          </NavLink>

          {(user.role === "tenant_admin" || user.role === "user") && (
            <NavLink to="/projects" className="app-nav-link">
              Projects
            </NavLink>
          )}

          {user.role === "tenant_admin" && (
            <NavLink to="/users" className="app-nav-link">
              Users
            </NavLink>
          )}

          {user.role === "super_admin" && (
            <NavLink to="/tenants" className="app-nav-link">
              Tenants
            </NavLink>
          )}
        </nav>
      </div>

      <div className="app-header-right">
        <div className="app-user-info">
          <span className="app-user-name">{user.fullName}</span>
          <span className="app-user-role">
            {user.role.replace("_", " ")}
          </span>
        </div>
        <button className="app-logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}
