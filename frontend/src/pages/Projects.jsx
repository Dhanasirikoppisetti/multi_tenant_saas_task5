import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import api from "../services/httpClient";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import "../styles/pages/projects.css";

export default function Projects() {
  const { user } = useAuth();
  const isAdmin = user?.role === "tenant_admin";

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Create project form
  const [createProjectForm, setCreateProjectForm] = useState({
    name: "",
    description: "",
    status: "active",
  });

  // Edit project
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editProjectForm, setEditProjectForm] = useState({
    name: "",
    description: "",
    status: "active",
  });

  const fetchProjects = async () => {
    const res = await api.get("/projects");
    setProjects(res.data.data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  /* ---------------- CREATE ---------------- */
  const createProject = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/projects", createProjectForm);
      setCreateProjectForm({
        name: "",
        description: "",
        status: "active",
      });
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- EDIT ---------------- */
  const startEditProject = (project) => {
    setEditingProjectId(project.id);
    setEditProjectForm({
      name: project.name,
      description: project.description || "",
      status: project.status,
    });
  };

  const cancelEdit = () => {
    setEditingProjectId(null);
  };

  const updateProject = async (projectId) => {
    await api.put(`/projects/${projectId}`, editProjectForm);
    setEditingProjectId(null);
    fetchProjects();
  };

  /* ---------------- DELETE ---------------- */
  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await api.delete(`/projects/${id}`);
    fetchProjects();
  };

    return (
    <AppLayout>
      <div className="projects-page">
        <div className="projects-header">
          <h1 className="projects-title">Projects</h1>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* CREATE PROJECT (ADMIN ONLY) */}
        {isAdmin && (
          <div className="project-create-card">
            <h3 className="project-create-title">Create New Project</h3>

            <form className="project-create-form" onSubmit={createProject}>
              <div className="project-create-field">
                <label className="project-create-label">Project Name</label>
                <input
                  className="project-create-input"
                  required
                  value={createProjectForm.name}
                  onChange={(e) =>
                    setCreateProjectForm({
                      ...createProjectForm,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="project-create-field">
                <label className="project-create-label">Status</label>
                <select
                  className="project-create-select"
                  value={createProjectForm.status}
                  onChange={(e) =>
                    setCreateProjectForm({
                      ...createProjectForm,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="project-create-field project-create-field-full">
                <label className="project-create-label">Description</label>
                <textarea
                  className="project-create-textarea"
                  value={createProjectForm.description}
                  onChange={(e) =>
                    setCreateProjectForm({
                      ...createProjectForm,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Project"}
              </button>
            </form>
          </div>
        )}

        {/* PROJECT LIST */}
        <div className="projects-grid">
          {projects.map((p) => {
            const isEditing = editingProjectId === p.id;

            return (
              <div key={p.id} className="project-card">
                {isEditing ? (
                  <>
                    <div className="project-card-name">Edit Project</div>

                    <div className="project-card-field">
                      <label className="project-card-label">Name</label>
                      <input
                        className="project-card-input"
                        value={editProjectForm.name}
                        onChange={(e) =>
                          setEditProjectForm({
                            ...editProjectForm,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="project-card-field">
                      <label className="project-card-label">
                        Description
                      </label>
                      <textarea
                        className="project-card-textarea"
                        value={editProjectForm.description}
                        onChange={(e) =>
                          setEditProjectForm({
                            ...editProjectForm,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="project-card-field">
                      <label className="project-card-label">Status</label>
                      <select
                        className="project-card-select"
                        value={editProjectForm.status}
                        onChange={(e) =>
                          setEditProjectForm({
                            ...editProjectForm,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="active">Active</option>
                        <option value="archived">Archived</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div className="project-card-actions">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => updateProject(p.id)}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="project-card-name">{p.name}</div>

                    {p.description && (
                      <div className="project-card-desc">
                        {p.description}
                      </div>
                    )}

                    <div className="project-card-status">
                      <span className="badge badge-green">{p.status}</span>
                    </div>

                    <div className="project-card-meta">
                      <span>
                        Created:{" "}
                        {new Date(p.createdAt).toLocaleDateString()}
                      </span>
                      <span>
                        Updated:{" "}
                        {new Date(p.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

               <div className="project-card-footer">
  <Link to={`/projects/${p.id}`} className="project-card-link">
    View tasks
  </Link>

  {isAdmin && (
    <div className="project-card-actions">
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => startEditProject(p)}
      >
        Edit
      </button>
      <button
        type="button"
        className="btn btn-danger"
        onClick={() => deleteProject(p.id)}
      >
        Delete
      </button>
    </div>
  )}
</div>

                  </>
                )}
              </div>
            );
          })}
        </div>

        {projects.length === 0 && !loading && (
          <p style={{ marginTop: "1rem" }}>No projects found</p>
        )}
      </div>
    </AppLayout>
  );
}
