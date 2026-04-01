"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

import EditTaskModal from "@/components/EditTaskModal";
import AddTaskModal from "@/components/AddTaskModal";
import TaskCard from "@/components/tasks/TaskCard";

import { Task } from "@/types/task";
import { parseDate } from "@/utils/date";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Dropdown from "@/components/ui/Dropdown";

const isUpcoming = (task: Task, days: number) => {
  const taskDate = parseDate(task.dueDate, task.dueTime);
  if (!taskDate) return false;
  const now = new Date();
  const limit = new Date();
  limit.setDate(limit.getDate() + days);
  return taskDate >= now && taskDate <= limit;
};

export default function TasksPage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<"admin" | "user" | null>(null);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    setMounted(true);
    const t = localStorage.getItem("token");
    const r = localStorage.getItem("role") as "admin" | "user" | null;
    setToken(t);
    setRole(r);
    if (!t) router.push("/login");
  }, [router]);

  useEffect(() => {
    if (!token) return;
    api
      .get("/api/tasks/categories", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => { if (Array.isArray(res.data)) setCategories(res.data); })
      .catch(() => {});
  }, [token]);

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedStatus) params.append("status", selectedStatus);
      const res = await api.get(`/api/tasks?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
      setAllTasks(res.data);
    } catch (err) {
      console.error("Görevler alınamadı:", err);
    }
  };

  useEffect(() => {
    if (token && role) fetchTasks();
  }, [token, role, selectedCategory, selectedStatus]);

  const upcomingTasks = tasks.filter(
    (t) => t.status !== "COMPLETED" && isUpcoming(t, 3)
  );

  const handleDelete = async (id: number) => {
    await api.delete(`/api/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    const res = await api.put(`/api/tasks/${editingTask.id}`, editingTask, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? res.data : t)));
    setShowEditModal(false);
    setEditingTask(null);
  };

  const handleTaskAdded = (task: Task) => {
    setTasks((prev) => [task, ...prev]);
    setAllTasks((prev) => [task, ...prev]);
  };

  const handleSearch = (value: string) => {
    if (!value.trim()) { setTasks(allTasks); return; }
    setTasks(allTasks.filter((t) => t.title.toLowerCase().includes(value.toLowerCase())));
  };

  if (!mounted || !role) {
    return (
      <DashboardLayout>
        <div className="tasks-loading">
          <span className="tasks-loading-spinner" />
          Yükleniyor...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      onSearch={handleSearch}
      onNewTask={() => setShowAddModal(true)}
    >
      <div className="tasks-inner">
        {/* ASIDE */}
        <aside className="tasks-aside">
          <div className="upcoming-card">
            <div className="upcoming-card-header">
              <div className="upcoming-card-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
                  <path d="M12 7v5l3 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="upcoming-title">Yaklaşan Görevler</h2>
            </div>

            {upcomingTasks.length === 0 ? (
              <div className="upcoming-empty">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 2v4M16 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <p>Önümüzdeki 3 günde yaklaşan görev yok.</p>
              </div>
            ) : (
              <ul className="upcoming-list">
                {upcomingTasks.map((task) => (
                  <li key={task.id} className="upcoming-item">
                    <span className="upcoming-item-dot" />
                    <div>
                      <p className="upcoming-item-title">{task.title}</p>
                      {task.dueDate && (
                        <p className="upcoming-item-date">
                          {task.dueDate} {task.dueTime ?? ""}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {/* MAIN */}
        <section className="tasks-main">
          <div className="tasks-page-header">
            <div>
              <h1 className="tasks-page-title">
                {role === "admin" ? "Admin Panel" : "Görevlerim"}
              </h1>
              <p className="tasks-page-subtitle">
                {role === "admin"
                  ? "Sistemdeki tüm görevleri yönetin"
                  : `${tasks.length} görev listeleniyor`}
              </p>
            </div>
          </div>

          <div className="tasks-filters">
            <Dropdown
              label="Kategori"
              value={selectedCategory}
              options={categories}
              onChange={setSelectedCategory}
            />
            <Dropdown
              label="Durum"
              value={selectedStatus}
              options={["PENDING", "IN_PROGRESS", "COMPLETED"]}
              onChange={setSelectedStatus}
            />
            {(selectedCategory || selectedStatus) && (
              <button
                className="tasks-filter-clear"
                onClick={() => { setSelectedCategory(""); setSelectedStatus(""); }}
              >
                ✕ Filtreleri Temizle
              </button>
            )}
          </div>

          {tasks.length === 0 ? (
            <div className="tasks-empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
                <path d="M9 12h6M9 8h6M9 16h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p>Görev bulunamadı.</p>
            </div>
          ) : (
            <ul className="tasks-list">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => openEditModal(task)}
                  onDelete={() => handleDelete(task.id)}
                  showUser={role === "admin"}
                />
              ))}
            </ul>
          )}
        </section>
      </div>

      {showEditModal && editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditSubmit}
          onChange={(k, v) => setEditingTask({ ...editingTask, [k]: v })}
        />
      )}
      {showAddModal && token && (
        <AddTaskModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleTaskAdded}
          token={token}
        />
      )}

      <style>{`
        /* ── Grid ── */
        .tasks-inner {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 1.5rem;
          min-width: 0;
        }

        @media (max-width: 768px) {
          .tasks-inner { grid-template-columns: 1fr; }
        }

        /* Loading */
        .tasks-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 4rem;
          color: #6b7280;
          font-size: 0.9rem;
        }
        .tasks-loading-spinner {
          width: 18px; height: 18px;
          border: 2px solid #e9d5ff;
          border-top-color: #7c3aed;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Aside */
        .tasks-aside {
          position: sticky;
          top: 1rem;
          align-self: start;
          min-width: 0;
        }

        .upcoming-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(109,40,217,0.08),
            0 8px 28px rgba(109,40,217,0.1),
            0 2px 6px rgba(0,0,0,0.04);
        }

        .upcoming-card-header {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 1rem 1.1rem 0.85rem;
          border-bottom: 1px solid #f3f0ff;
        }

        .upcoming-card-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px; height: 30px;
          border-radius: 8px;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(109,40,217,0.3);
        }

        .upcoming-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: #3b0764;
          margin: 0;
        }

        .upcoming-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.5rem 1rem;
          text-align: center;
          color: #c4b5fd;
          font-size: 0.78rem;
        }
        .upcoming-empty p { color: #9ca3af; margin: 0; }

        .upcoming-list {
          list-style: none;
          padding: 0.65rem 0.85rem 0.85rem;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 280px;
          overflow-y: auto;
        }

        .upcoming-item {
          display: flex;
          align-items: flex-start;
          gap: 0.55rem;
          padding: 0.6rem 0.75rem;
          background: #faf5ff;
          border: 1px solid #e9d5ff;
          border-radius: 9px;
        }

        .upcoming-item-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #7c3aed;
          flex-shrink: 0;
          margin-top: 4px;
        }

        .upcoming-item-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: #4c1d95;
          margin: 0 0 0.1rem;
          word-break: break-word;
        }

        .upcoming-item-date {
          font-size: 0.72rem;
          color: #9ca3af;
          margin: 0;
        }

        /* Main */
        .tasks-main {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-width: 0;
        }

        .tasks-page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .tasks-page-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #3b0764;
          margin: 0 0 0.15rem;
          letter-spacing: -0.02em;
        }

        .tasks-page-subtitle {
          font-size: 0.82rem;
          color: #6b7280;
          margin: 0;
        }

        .tasks-filters {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-wrap: wrap;
          padding: 0.7rem 0.9rem;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 0 0 1px rgba(109,40,217,0.07), 0 2px 8px rgba(0,0,0,0.04);
        }

        .tasks-filter-clear {
          font-size: 0.78rem;
          color: #9ca3af;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.3rem 0.5rem;
          border-radius: 6px;
          transition: color 0.15s, background 0.15s;
        }
        .tasks-filter-clear:hover { color: #7c3aed; background: #faf5ff; }

        .tasks-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 3rem;
          background: #fff;
          border-radius: 14px;
          color: #9ca3af;
          font-size: 0.875rem;
          box-shadow: 0 0 0 1px rgba(109,40,217,0.06);
          text-align: center;
        }

        .tasks-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
      `}</style>
    </DashboardLayout>
  );
}