import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import api from "../services/httpClient";
import "../styles/pages/users.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "user",
  });

  const fetchUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const startAdd = () => {
    setEditingId("new");
    setForm({ email: "", password: "", fullName: "", role: "user" });
  };

  const startEdit = (u) => {
    setEditingId(u.id);
    setForm({
      email: u.email,
      password: "",
      fullName: u.fullName,
      role: u.role,
    });
  };

  const save = async () => {
    setError("");
    try {
      if (editingId === "new") {
        await api.post("/users", form);
      } else {
        await api.put(`/users/${editingId}`, {
          fullName: form.fullName,
          role: form.role,
        });
      }
      setEditingId(null);
      fetchUsers();
    } catch (e) {
      setError(e.response?.data?.message || "Action failed");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    await api.delete(`/users/${id}`);
    fetchUsers();
  };

  return (
    <AppLayout>
      <div className="users-page">
        <div className="users-card">
          <div className="users-header">
            <h2 className="users-title">Users</h2>
            <button className="btn btn-primary" onClick={startAdd}>
              Add user
            </button>
          </div>

          {error && <p className="users-error">{error}</p>}

          {/* ADD / EDIT FORM */}
          {editingId && (
            <div className="users-form-card">
              <h3 className="users-form-title">
                {editingId === "new" ? "Add user" : "Edit user"}
              </h3>

              {editingId === "new" && (
                <div className="users-form-field">
                  <label className="users-form-label">Email</label>
                  <input
                    className="users-form-input"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
              )}

              <div className="users-form-field">
                <label className="users-form-label">Full name</label>
                <input
                  className="users-form-input"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                />
              </div>

              {editingId === "new" && (
                <div className="users-form-field">
                  <label className="users-form-label">Password</label>
                  <input
                    type="password"
                    className="users-form-input"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                </div>
              )}

              <div className="users-form-field">
                <label className="users-form-label">Role</label>
                <select
                  className="users-form-input"
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value })
                  }
                >
                  <option value="user">User</option>
                  <option value="tenant_admin">Tenant admin</option>
                </select>
              </div>

              <div className="users-form-actions">
                <button className="btn btn-primary" onClick={save}>
                  Save
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* USERS TABLE */}
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Full name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th style={{ width: "140px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td data-label="Full name">{u.fullName}</td>
                    <td data-label="Email">{u.email}</td>
                    <td data-label="Role">{u.role}</td>
                    <td data-label="Status">
                      <span
                        className={
                          u.isActive ? "badge badge-green" : "badge badge-red"
                        }
                      >
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td data-label="Actions">
                      <div className="users-row-actions">
                        <button
                          className="btn btn-secondary"
                          onClick={() => startEdit(u)}
                        >
                          Edit
                        </button>
                        {u.isActive && (
                          <button
                            className="btn btn-danger"
                            onClick={() => deleteUser(u.id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <p className="users-empty">No users found</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
