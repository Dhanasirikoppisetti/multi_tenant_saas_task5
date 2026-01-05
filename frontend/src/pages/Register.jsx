import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/httpClient";
import "../styles/pages/register.css";


export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    organizationName: "",
    subdomain: "",
    adminEmail: "",
    adminFullName: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // -------- Frontend validations --------
    if (!form.organizationName.trim()) {
      return setError("Organization name is required");
    }

    if (!form.subdomain.trim()) {
      return setError("Subdomain is required");
    }

    if (!/^[a-z0-9]+$/.test(form.subdomain)) {
      return setError(
        "Subdomain must contain only lowercase letters and numbers"
      );
    }

    if (!form.adminEmail.trim()) {
      return setError("Email is required");
    }

    if (!/^\S+@\S+\.\S+$/.test(form.adminEmail)) {
      return setError("Enter a valid email address");
    }

    if (form.password.length < 8) {
      return setError("Password must be at least 8 characters long");
    }

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (!form.agree) {
      return setError("You must agree to the Terms & Conditions");
    }

    setLoading(true);

    const payload = {
      tenantName: form.organizationName,
      subdomain: form.subdomain,
      adminEmail: form.adminEmail,
      adminFullName: form.adminFullName,
      adminPassword: form.password,
    };

    try {
      await api.post("/auth/register-tenant", payload);

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("REGISTER ERROR:", err.response?.data);

      // Show backend-specific error if available
      setError(
        err.response?.data?.message ||
          "Registration failed. Please check your inputs."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="register-page">
    <div className="register-card">
      <h2 className="register-title">Register Organization</h2>
      <p className="register-subtitle">
        Create a new tenant with an admin account.
      </p>

      {error && <p className="register-error">{error}</p>}
      {success && <p className="register-success">{success}</p>}

      <form className="register-form" onSubmit={submit}>
        <div className="register-field">
          <label className="register-label">Organization Name</label>
          <input
            className="register-input"
            name="organizationName"
            value={form.organizationName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="register-field">
          <label className="register-label">Subdomain</label>
          <input
            className="register-input"
            name="subdomain"
            value={form.subdomain}
            onChange={handleChange}
            required
          />
          <span className="register-hint">
            Your workspace URL:{" "}
            <b>{form.subdomain || "yourorg"}.yourapp.com</b>
          </span>
        </div>

        <div className="register-field">
          <label className="register-label">Admin Email</label>
          <input
            className="register-input"
            type="email"
            name="adminEmail"
            placeholder="admin@company.com"
            value={form.adminEmail}
            onChange={handleChange}
            required
          />
        </div>

        <div className="register-field">
          <label className="register-label">Admin Full Name</label>
          <input
            className="register-input"
            name="adminFullName"
            value={form.adminFullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="register-field">
          <label className="register-label">Password</label>
          <div className="register-password-row">
            <input
              className="register-input"
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="register-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "View"}
            </button>
          </div>
        </div>

        <div className="register-field">
          <label className="register-label">Confirm Password</label>
          <div className="register-password-row">
            <input
              className="register-input"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="register-toggle-btn"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? "Hide" : "View"}
            </button>
          </div>
        </div>

        <div className="register-field register-checkbox-row">
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
          />
          <span>I agree to Terms &amp; Conditions</span>
        </div>

        <button
          type="submit"
          className="register-submit"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="register-footer">
        Already have an account?{" "}
        <Link to="/login" className="register-footer-link">
          Login
        </Link>
      </p>
    </div>
  </div>
);

}