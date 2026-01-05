import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import "../styles/pages/login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    tenantSubdomain: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Sign in</h1>
        <p className="login-subtitle">
          Access your tenant dashboard, projects and tasks.
        </p>

        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={submit}>
          <div>
            <label className="login-label" htmlFor="tenantSubdomain">
              Domain
            </label>
            <input
              id="tenantSubdomain"
              className="login-input"
              placeholder="your-tenant (leave empty for super admin)"
              value={form.tenantSubdomain}
              onChange={(e) =>
                setForm({ ...form, tenantSubdomain: e.target.value })
              }
            />
          </div>

          <div>
            <label className="login-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="login-input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="login-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="login-input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="login-footer">
          New organization?{" "}
          <Link to="/register" className="login-footer-link">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
