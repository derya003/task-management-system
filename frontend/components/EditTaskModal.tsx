"use client";
import React, { useState, useEffect } from "react";
import InputField from "@/components/InputField";
import { X, Pencil } from "lucide-react";

interface Task {
  id: number;
  title: string;
  description: string;
  category?: string;
  status?: string;
  dueDate?: string;
  dueTime?: string;
}

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  onChange: (key: keyof Task, value: string) => void;
}

export default function EditTaskModal({ task, onClose, onSave, onChange }: EditTaskModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className={`modal-box ${isVisible ? "modal-box--in" : "modal-box--out"}`}>

        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-icon" aria-hidden="true">
              <Pencil size={16} color="white" />
            </div>
            <h2 className="modal-title">Görevi Düzenle</h2>
          </div>
          <button className="modal-close" onClick={handleClose} aria-label="Kapat">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSave} className="modal-form" noValidate>
          <InputField
            label="Başlık"
            name="title"
            value={task.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="Görev başlığı"
            required
          />

          <InputField
            label="Açıklama"
            name="description"
            value={task.description}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Görev açıklaması"
            textarea
            required
          />

          <InputField
            label="Kategori"
            name="category"
            value={task.category ?? ""}
            onChange={(e) => onChange("category", e.target.value)}
            placeholder="Kategori adı"
          />

          {/* Durum */}
          <div className="modal-field">
            <label className="modal-field-label">Durum</label>
            <select
              name="status"
              value={task.status ?? "PENDING"}
              onChange={(e) => onChange("status", e.target.value)}
              className="modal-select"
            >
              <option value="PENDING">Beklemede</option>
              <option value="IN_PROGRESS">Devam Ediyor</option>
              <option value="COMPLETED">Tamamlandı</option>
            </select>
          </div>

          {/* Tarih & Saat yan yana */}
          <div className="modal-date-row">
            <InputField
              label="Bitiş Tarihi"
              type="date"
              name="dueDate"
              value={task.dueDate ?? ""}
              onChange={(e) => onChange("dueDate", e.target.value)}
            />
            <InputField
              label="Bitiş Saati"
              type="time"
              name="dueTime"
              value={task.dueTime ?? ""}
              onChange={(e) => onChange("dueTime", e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn modal-btn--cancel"
              onClick={handleClose}
            >
              İptal
            </button>
            <button type="submit" className="modal-btn modal-btn--save">
              Değişiklikleri Kaydet
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
        }
        .modal-close:hover {
          background: #f3f0ff;
          color: #7c3aed;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1.25rem 1.5rem 1.5rem;
        }

        .modal-field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

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
          transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
          font-family: inherit;
        }
        .modal-btn:active { transform: scale(0.97); }

        .modal-btn--cancel {
          background: #f3f4f6;
          color: #6b7280;
        }
        .modal-btn--cancel:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .modal-btn--save {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: #fff;
          box-shadow: 0 4px 12px rgba(109,40,217,0.3);
        }
        .modal-btn--save:hover {
          box-shadow: 0 6px 18px rgba(109,40,217,0.4);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}