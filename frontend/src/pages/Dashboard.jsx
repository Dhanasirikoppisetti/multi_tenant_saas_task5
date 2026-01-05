// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import api from "../services/httpClient";
import { useAuth } from "../context/AuthProvider";
import "../styles/pages/dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskFilter, setTaskFilter] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    fetchDashboardData();
  }, [user]);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      setError("");

      // 1) all projects
      const projectsRes = await api.get("/projects");
      const projectsData = projectsRes.data?.data || [];
      setProjects(projectsData);

      // 2) tasks assigned to current user
      const tasksRes = await api.get("/tasks/my");
      const allTasks = tasksRes.data?.data || [];

      const tasksWithProjects = allTasks.map((task) => {
        const project = projectsData.find((p) => p.id === task.projectId);
        return {
          ...task,
          project_name: project?.name || "Unknown Project",
        };
      });

      setMyTasks(tasksWithProjects);
    } catch (err) {
      console.error("Dashboard fetch error:", err.response?.data || err);
      setError(
        err.response?.data?.message || "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return <AppLayout>Loading user...</AppLayout>;
  }

  if (loading) {
    return <AppLayout>Loading dashboard...</AppLayout>;
  }

  const totalProjects = projects.length;
  const totalTasks = myTasks.length;
  const completedTasks = myTasks.filter(
    (t) => t.status === "completed" || t.status === "done"
  ).length;
  const pendingTasks = totalTasks - completedTasks;

  const filteredTasks =
    taskFilter === "all"
      ? myTasks
      : myTasks.filter((t) =>
          taskFilter === "completed"
            ? t.status === "completed" || t.status === "done"
            : t.status !== "completed" && t.status !== "done"
        );

  return (
    <AppLayout>
      <div className="dashboard">
        {error && <div className="dashboard-error">{error}</div>}

        {/* stats */}
        <div className="stats-grid">
          <StatCard title="Total Projects" value={totalProjects} />
          <StatCard title="Total Tasks" value={totalTasks} />
          <StatCard title="Completed Tasks" value={completedTasks} />
          <StatCard title="Pending Tasks" value={pendingTasks} />
        </div>

        {/* recent projects */}
        <section className="section">
          <div className="section-header">
            <h3>Recent Projects</h3>
            <span className="section-subtitle">
              Showing latest {Math.min(projects.length, 5)} projects
            </span>
          </div>

          {projects.length === 0 ? (
            <p className="empty-text">No projects available</p>
          ) : (
            <ul className="list list-projects">
              {projects.slice(0, 5).map((project, idx) => (
                <li
                  key={project.id}
                  className="list-item fade-in-up"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="list-item-main">
                    <strong className="item-title">{project.name}</strong>
                    <span className={`badge status-${project.status}`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="list-item-meta">
                    <span>Tasks: {project.taskCount ?? 0}</span>
                    {project.createdAt && (
                      <span>
                        Created:{" "}
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* my tasks */}
        <section className="section">
          <div className="section-header">
            <h3>My Tasks</h3>

            <select
              className="task-filter-select"
              value={taskFilter}
              onChange={(e) => setTaskFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {filteredTasks.length === 0 ? (
            <p className="empty-text">No tasks assigned</p>
          ) : (
            <ul className="list list-tasks">
              {filteredTasks.map((task, idx) => (
                <li
                  key={task.id}
                  className="list-item fade-in-up"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="list-item-main">
                    <strong className="item-title">{task.title}</strong>
                    <span
                      className={`badge badge-priority-${task.priority}`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <div className="list-item-meta">
                    <span>Project: {task.project_name}</span>
                    <span>Status: {task.status}</span>
                    {task.dueDate && (
                      <span>
                        Due:{" "}
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AppLayout>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="stat-card hover-lift fade-in">
      <h4 className="stat-title">{title}</h4>
      <p className="stat-value">{value}</p>
    </div>
  );
}
