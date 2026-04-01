"use client";
import React, { useState, useEffect } from "react";
import InputField from "@/components/InputField";
import { Task } from "@/types/task";
import DropdownSmall from "./ui/DropdownSmall";
import { X } from "lucide-react";

interface AddTaskModalProps {
  onClose: () => void;
  onAdd: (task: Task) => void;
  token: string;
}

interface User {
  id: number;
  email: string;
}

type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export default function AddTaskModal({ onClose, onAdd, token }: AddTaskModalProps) {
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [assignedUserId, setAssignedUserId] = useState<number | null>(null);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "",
    status: "PENDING" as TaskStatus,
    dueDate: "",
    dueTime: "",
  });

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  useEffect(() => {
    if (role === "admin") {
      fetch("http://localhost:3001/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data: User[]) => setUsers(data))
        .catch(() => console.error("Kullanıcılar alınamadı"));
    }
  }, [role, token]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      title: newTask.title,
      description: newTask.description,
      category: newTask.category || undefined,
      status: newTask.status,
      dueDate: newTask.dueDate || undefined,
      dueTime: newTask.dueTime || undefined,
      ...(role === "admin" && assignedUserId ? { assignedUserId } : {}),
    };

    try {
      const res = await fetch("http://localhost:3001/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data: Task = await res.json();
      onAdd(data);
      handleClose();
    } catch (err) {
      console.error("Görev eklenemedi:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className={`modal-box ${isVisible ? "modal-box--in" : "modal-box--out"}`}>

        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="modal-title">Yeni Görev Ekle</h2>
          </div>
          <button className="modal-close" onClick={handleClose} aria-label="Kapat">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          <InputField
            label="Başlık"
            name="title"
            value={newTask.title}
            onChange={handleChange}
            placeholder="Görev başlığı"
            required
          />

          <InputField
            label="Açıklama"
            name="description"
            value={newTask.description}
            onChange={handleChange}
            placeholder="Görev hakkında kısa bir açıklama..."
            textarea
            required
          />

          <InputField
            label="Kategori"
            name="category"
            value={newTask.category}
            onChange={handleChange}
            placeholder="örn. iş, kişisel, alışveriş"
          />

          {/* Admin: Kullanıcı atama */}
          {role === "admin" && (
            <div className="modal-field">
              <label className="modal-field-label">Atanacak Kullanıcı</label>
              <select
                className="modal-select"
                value={assignedUserId ?? ""}
                onChange={(e) => setAssignedUserId(Number(e.target.value))}
              >
                <option value="">Kullanıcı seç</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.email}</option>
                ))}
              </select>
            </div>
          )}

          <DropdownSmall
            label="Durum"
            value={newTask.status}
            options={["PENDING", "IN_PROGRESS", "COMPLETED"]}
            onChange={(v) => setNewTask((prev) => ({ ...prev, status: v as TaskStatus }))}
          />

          <div className="modal-date-row">
            <InputField
              label="Bitiş Tarihi"
              type="date"
              name="dueDate"
              value={newTask.dueDate}
              onChange={handleChange}
            />
            <InputField
              label="Bitiş Saati"
              type="time"
              name="dueTime"
              value={newTask.dueTime}
              onChange={handleChange}
            />
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn modal-btn--cancel"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              İptal
            </button>
            <button
              type="submit"
              className="modal-btn modal-btn--save"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="modal-spinner" />
                  Kaydediliyor...
                </>
              ) : (
                "Görevi Kaydet"
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(6px);
          z-index: 100;
          padding: 1rem;
        }

        .modal-box {
          background: #fff;
          border-radius: 20px;
          width: 100%;
          max-width: 460px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow:
            0 0 0 1px rgba(109,40,217,0.1),
            0 24px 60px rgba(109,40,217,0.18),
            0 4px 16px rgba(0,0,0,0.08);
          transform-origin: center;
          transition: opacity 0.2s ease, transform 0.2s ease;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .modal-box--in  { opacity: 1; transform: scale(1); }
        .modal-box--out { opacity: 0; transform: scale(0.95); }

        /* Header */
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem 1rem;
          border-bottom: 1px solid #f3f0ff;
        }

        .modal-header-left {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .modal-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px; height: 34px;
          border-radius: 9px;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          box-shadow: 0 3px 10px rgba(109,40,217,0.3);
          flex-shrink: 0;
        }

        .modal-title {
          font-size: 1rem;
          font-weight: 700;
          color: #3b0764;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .modal-close {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px; height: 30px;
          border-radius: 8px;
          border: 1px solid #ede9fe;
          background: #faf5ff;
          color: #9ca3af;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          flex-shrink: 0;
        }
        .modal-close:hover {
          background: #f3f0ff;
          color: #7c3aed;
        }

        /* Form */
        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1.25rem 1.5rem 1.5rem;
        }

        .modal-field { display: flex; flex-direction: column; gap: 0.35rem; }

        .modal-field-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: #4c1d95;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .modal-select {
          width: 100%;
          padding: 0.65rem 0.85rem;
          border: 1.5px solid #ede9fe;
          border-radius: 10px;
          font-size: 0.875rem;
          color: #1f2937;
          background: #faf5ff;
          outline: none;
          font-family: inherit;
          cursor: pointer;
          transition: border-color 0.15s, box-shadow 0.15s;
          appearance: none;
        }
        .modal-select:focus {
          border-color: #7c3aed;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
        }

        .modal-date-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        /* Actions */
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.6rem;
          padding-top: 0.25rem;
        }

        .modal-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.65rem 1.2rem;
          font-size: 0.875rem;
          font-weight: 600;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s, opacity 0.15s;
          font-family: inherit;
        }
        .modal-btn:active:not(:disabled) { transform: scale(0.97); }
        .modal-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .modal-btn--cancel {
          background: #f3f4f6;
          color: #6b7280;
        }
        .modal-btn--cancel:hover:not(:disabled) {
          background: #e5e7eb;
          color: #374151;
        }

        .modal-btn--save {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: #fff;
          box-shadow: 0 4px 12px rgba(109,40,217,0.3);
        }
        .modal-btn--save:hover:not(:disabled) {
          box-shadow: 0 6px 18px rgba(109,40,217,0.4);
          transform: translateY(-1px);
        }

        .modal-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}