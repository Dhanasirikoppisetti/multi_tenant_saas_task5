// src/context/DashboardDataProvider.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/httpClient";

const DashboardDataContext = createContext(null);

export function DashboardDataProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  // initial load
  useEffect(() => {
    Promise.all([
      api.get("/projects"),
      api.get("/tasks"),
      api.get("/users"),
    ]).then(([pRes, tRes, uRes]) => {
      setProjects(pRes.data.data || []);
      setTasks(tRes.data.data || []);
      setUsers(uRes.data.data || []);
    });
  }, []);

  const value = {
    projects,
    tasks,
    users,
    setProjects,
    setTasks,
    setUsers,
  };

  return (
    <DashboardDataContext.Provider value={value}>
      {children}
    </DashboardDataContext.Provider>
  );
}

export function useDashboardData() {
  const ctx = useContext(DashboardDataContext);
  if (!ctx) throw new Error("useDashboardData must be used inside provider");
  return ctx;
}
