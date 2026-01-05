import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import api from "../services/httpClient";
import { useAuth } from "../context/AuthProvider";
import "../styles/pages/projectDetails.css";




export default function ProjectDetails() {
    const { projectId } = useParams();
    const { user } = useAuth();

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");

    const [users, setUsers] = useState([]);
    const [assignedToId, setAssignedToId] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");
    const [dueDate, setDueDate] = useState("");

    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignedToId: "",
    dueDate: "",
    status: "todo",
    });




  const fetchProject = async () => {
    const res = await api.get("/projects");
    const p = res.data.data.find((x) => x.id === projectId);
    setProject(p);
  };

  const fetchUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data.data);
  };


  const fetchTasks = async () => {
    const res = await api.get(`/projects/${projectId}/tasks`);
    setTasks(res.data.data);
  };

  useEffect(() => {
    fetchProject();
    fetchTasks();
    if (user.role === "tenant_admin") {
        fetchUsers();
    }
  }, [projectId]);


  const createTask = async (e) => {
  e.preventDefault();

  if (!title.trim()) {
    alert("Task title is required");
    return;
  }

  try {
    const payload = {
      title,
      priority,
    };

    if (description.trim()) payload.description = description;
    if (assignedToId) payload.assignedToId = assignedToId;
    if (dueDate) {
        payload.dueDate = new Date(dueDate).toISOString();
    }


    await api.post(`/projects/${projectId}/tasks`, payload);

    setTitle("");
    setDescription("");
    setPriority("medium");
    setAssignedToId("");
    setDueDate("");

    fetchTasks();
  } catch (err) {
    alert(
      err.response?.data?.message ||
      JSON.stringify(err.response?.data) ||
      "Failed to create task"
    );
  }
};


    const updateStatus = async (taskId, status) => {
        await api.patch(`/tasks/${taskId}/status`, { status });
        fetchTasks();
    };
   const startEdit = (task) => {
  setEditingTaskId(task.id);
  setEditForm({
    title: task.title,
    description: task.description || "",
    priority: task.priority,
    assignedToId: task.assignedToId || "",
    dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    status: task.status,
  });
};

const updateTaskFull = async (taskId) => {
  try {
    const payload = {
      title: editForm.title,
      priority: editForm.priority,
    };

    if (editForm.description.trim()) {
      payload.description = editForm.description;
    }

    if (editForm.assignedToId) {
      payload.assignedToId = editForm.assignedToId;
    }

    if (editForm.dueDate) {
        payload.dueDate = new Date(editForm.dueDate).toISOString();
    }


    await api.put(`/tasks/${taskId}`, payload);

    // Status update (separate endpoint)
    if (editForm.status) {
      await api.patch(`/tasks/${taskId}/status`, {
        status: editForm.status,
      });
    }

    setEditingTaskId(null);
    fetchTasks();
  } catch (err) {
    alert(
      err.response?.data?.message ||
      JSON.stringify(err.response?.data) ||
      "Failed to update task"
    );
  }
};
  if (!project) return <AppLayout>Loading...</AppLayout>;

  if (!project) return <AppLayout>Loading...</AppLayout>;

const isTenantAdmin = user?.role === "tenant_admin";

return (
  <AppLayout>
    <div className="project-details-page">
      {/* Header card */}
      <div className="project-header-card">
        <div className="project-header-top">
          <h1>{project.name}</h1>
          <span className={`status-badge status-${project.status}`}>
            {project.status}
          </span>
        </div>
        <p className="project-description">
          {project.description || "No description"}
        </p>
      </div>

      {/* Main grid: form + tasks */}
      <div className="project-main">
        {/* LEFT: create / edit task form */}
        <div className="task-form-card">
          <h2>{editingTaskId ? "Edit Task" : "Create New Task"}</h2>

          {isTenantAdmin ? (
            editingTaskId ? (
              /* EDIT FORM */
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateTaskFull(editingTaskId);
                }}
              >
                <div className="form-row">
                  <div style={{ width: "100%" }}>
                    <label>Title</label>
                    <input
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div style={{ width: "100%" }}>
                    <label>Description</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label>Priority</label>
                    <select
                      value={editForm.priority}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          priority: e.target.value,
                        })
                      }
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label>Assign to</label>
                    <select
                      value={editForm.assignedToId}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          assignedToId: e.target.value,
                        })
                      }
                    >
                      <option value="">Unassigned</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.fullName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label>Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="todo">Todo</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label>Due date</label>
                    <input
                      type="date"
                      value={editForm.dueDate}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          dueDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setEditingTaskId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              /* CREATE FORM */
              <form onSubmit={createTask}>
                <div className="form-row">
                  <div style={{ width: "100%" }}>
                    <label>Title</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div style={{ width: "100%" }}>
                    <label>Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label>Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label>Assign to</label>
                    <select
                      value={assignedToId}
                      onChange={(e) => setAssignedToId(e.target.value)}
                    >
                      <option value="">Unassigned</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.fullName} ({u.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label>Due date</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    Create task
                  </button>
                </div>
              </form>
            )
          ) : (
            <p className="project-edit-muted">
              Only tenant admins can create or edit tasks.
            </p>
          )}
        </div>

        {/* RIGHT: tasks list */}
        <div className="tasks-card">
          <h2>Tasks</h2>

          <div className="tasks-table">
            <div className="tasks-header-row">
              <div>Title</div>
              <div>Status</div>
              <div>Priority</div>
              <div>Assignee</div>
              <div>Due</div>
              <div>Actions</div>
            </div>

            {tasks.length === 0 && (
              <div className="empty-row">No tasks yet</div>
            )}

            {tasks.map((t) => (
              <div key={t.id} className="task-row">
                <div>{t.title}</div>
                <div>
                  <span className={`status-pill status-${t.status}`}>
                    {t.status.replace("_", " ")}
                  </span>
                </div>
                <div>
                  <span
                    className={`priority-pill priority-${t.priority}`}
                  >
                    {t.priority}
                  </span>
                </div>
                <div>
                  {isTenantAdmin
                    ? users.find((u) => u.id === t.assignedToId)?.fullName ||
                      "Unassigned"
                    : !t.assignedToId
                    ? "Not assigned"
                    : t.assignedToId === user.id
                    ? "Assigned to you"
                    : "Not assigned to you"}
                </div>
                <div>
                  {t.dueDate
                    ? new Date(t.dueDate).toLocaleDateString()
                    : "-"}
                </div>
                <div className="task-actions">
                  {isTenantAdmin && (
                    <button
                      className="btn-secondary"
                      onClick={() => startEdit(t)}
                    >
                      Edit
                    </button>
                  )}

                  {user.role === "user" && t.assignedToId === user.id && (
                    <>
                      <button
                        className="btn-secondary"
                        onClick={() => updateStatus(t.id, "todo")}
                      >
                        Todo
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() =>
                          updateStatus(t.id, "in_progress")
                        }
                      >
                        In progress
                      </button>
                      <button
                        className="btn-primary"
                        onClick={() =>
                          updateStatus(t.id, "completed")
                        }
                      >
                        Completed
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
);
}