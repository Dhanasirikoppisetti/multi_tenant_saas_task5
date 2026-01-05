import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import api from "../services/httpClient";
import "../styles/pages/tenants.css";


const PLAN_LIMITS = {
  free: { maxUsers: 5, maxProjects: 5 },
  pro: { maxUsers: 25, maxProjects: 15 },
  enterprise: { maxUsers: 100, maxProjects: 50 },
};

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [error, setError] = useState("");

  const fetchTenants = async () => {
    try {
      const res = await api.get("/tenants");
      setTenants(res.data.data);
    } catch {
      setError("Failed to load tenants");
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const updatePlan = async (tenantId, newPlan) => {
    const limits = PLAN_LIMITS[newPlan];

    api.patch(`/tenants/${tenantId}/plan`, {
        subscriptionPlan: newPlan,
    });


    fetchTenants();
  };

  const toggleStatus = async (tenantId, currentStatus) => {
    await api.patch(`/tenants/${tenantId}/status`, {
      status: currentStatus === "active" ? "suspended" : "active",
    });

    fetchTenants();
  };
  const updateStatus = async (tenantId, newStatus) => {
    await api.patch(`/tenants/${tenantId}/status`, {
        status: newStatus,
    });

    fetchTenants();
 };
  return (
    <AppLayout>
      <div className="tenants-page">
        <div className="tenants-card">
          <div className="tenants-header">
            <h2 className="tenants-title">Tenants</h2>
          </div>

          {error && <p className="tenants-error">{error}</p>}

          <table className="tenants-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Subdomain</th>
                <th>Plan</th>
                <th>Max users</th>
                <th>Max projects</th>
                <th>Status</th>
                <th>Change status</th>
              </tr>
            </thead>
            <tbody>
  {tenants.map((t) => {
    const limits = PLAN_LIMITS[t.subscriptionPlan];

    return (
      <tr key={t.id}>
        <td data-label="Name">{t.name}</td>
        <td data-label="Subdomain">{t.subdomain}</td>
        <td data-label="Plan">
          <select
            className="tenants-select"
            value={t.subscriptionPlan}
            onChange={(e) => updatePlan(t.id, e.target.value)}
          >
            <option value="free">Free</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </td>
        <td data-label="Max users">{limits.maxUsers}</td>
        <td data-label="Max projects">{limits.maxProjects}</td>
        <td data-label="Status">
          <span
            className={
              t.status === "active" ? "badge badge-green" : "badge badge-red"
            }
          >
            {t.status}
          </span>
        </td>
        <td data-label="Change status">
          <select
            className="tenants-select"
            value={t.status}
            onChange={(e) => updateStatus(t.id, e.target.value)}
          >
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </td>
      </tr>
    );
  })}
</tbody>

          </table>
        </div>
      </div>
    </AppLayout>
  );
}
