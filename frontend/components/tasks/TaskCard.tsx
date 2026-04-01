"use client";
import { Task } from "@/types/task";
import { Pencil, Trash2, Clock, Tag, User, Paperclip } from "lucide-react";
import React, { useState } from "react";

import UploadAttachment from "@/components/attachments/UploadAttachment";
import AttachmentList from "@/components/attachments/AttachmentList";

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  showUser?: boolean;
  onAttachmentUploaded?: () => void;
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  showUser = false,
  onAttachmentUploaded,
}: TaskCardProps) {
  const [showAttachments, setShowAttachments] = useState(false);

  /* ── Status config ── */
  const statusConfig: Record<
    NonNullable<Task["status"]>,
    { label: string; accent: string; badge: string; dot: string }
  > = {
    PENDING: {
      label: "Beklemede",
      accent: "#f59e0b",
      badge: "tc-badge--yellow",
      dot: "tc-dot--yellow",
    },
    IN_PROGRESS: {
      label: "Devam Ediyor",
      accent: "#3b82f6",
      badge: "tc-badge--blue",
      dot: "tc-dot--blue",
    },
    COMPLETED: {
      label: "Tamamlandı",
      accent: "#10b981",
      badge: "tc-badge--green",
      dot: "tc-dot--green",
    },
  };

  const status = task.status ?? "PENDING";
  const { label: statusText, accent, badge, dot } = statusConfig[status];
  const isCompleted = status === "COMPLETED";

  /* ── Due date warning ── */
  let dueWarningText: string | null = null;
  let dueWarningClass = "";

  if (task.dueDate && !isCompleted) {
    const dueDateTime = new Date(`${task.dueDate}T${task.dueTime ?? "23:59"}`);
    const diffHours = (dueDateTime.getTime() - Date.now()) / (1000 * 60 * 60);

    if (diffHours < 0) {
      dueWarningText = "Süresi geçti";
      dueWarningClass = "tc-due--overdue";
    } else if (diffHours <= 24) {
      dueWarningText = "1 günden az kaldı";
      dueWarningClass = "tc-due--soon";
    }
  }

  return (
    <li
      className="tc-root"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <div className="tc-body">
        {/* ── Sol ── */}
        <div className="tc-left">
          {/* Status dot + title */}
          <div className="tc-title-row">
            <span className={`tc-dot ${dot}`} />
            <h2 className={`tc-title ${isCompleted ? "tc-title--done" : ""}`}>
              {task.title}
            </h2>
          </div>

          {/* Admin: kullanıcı etiketi */}
          {showUser && task.user && (
            <div className="tc-user-badge">
              <User size={12} />
              {task.user.email}
            </div>
          )}

          {/* Açıklama */}
          {task.description && (
            <p className="tc-desc">{task.description}</p>
          )}

          {/* Meta row */}
          <div className="tc-meta">
            {task.category && (
              <span className="tc-meta-item">
                <Tag size={13} />
                {task.category}
              </span>
            )}

            <span className={`tc-badge ${badge}`}>{statusText}</span>

            {task.dueDate && (
              <span className="tc-meta-item">
                <Clock size={13} />
                {task.dueDate} {task.dueTime ?? ""}
                {dueWarningText && (
                  <span className={`tc-due-warn ${dueWarningClass}`}>
                    · {dueWarningText}
                  </span>
                )}
              </span>
            )}
          </div>
        </div>

        {/* ── Sağ – Actions ── */}
        <div className="tc-actions">
          <button
            className="tc-btn tc-btn--edit"
            onClick={onEdit}
            title="Düzenle"
            aria-label="Görevi düzenle"
          >
            <Pencil size={15} />
          </button>
          <button
            className="tc-btn tc-btn--delete"
            onClick={onDelete}
            title="Sil"
            aria-label="Görevi sil"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* ── Ekler ── */}
      <div className="tc-attach-section">
        <button
          className="tc-attach-toggle"
          onClick={() => setShowAttachments(!showAttachments)}
        >
          <Paperclip size={14} />
          Ekler
          <span className="tc-attach-chevron">
            {showAttachments ? "▲" : "▼"}
          </span>
        </button>

        {showAttachments && (
          <div className="tc-attach-body">
            <UploadAttachment taskId={task.id} onUploaded={onAttachmentUploaded} />
            <AttachmentList taskId={task.id} />
          </div>
        )}
      </div>

      <style>{`
        .tc-root {
          background: #fff;
          border-radius: 16px;
          border-left: 3.5px solid var(--accent);
          box-shadow:
            0 0 0 1px rgba(109,40,217,0.06),
            0 4px 16px rgba(109,40,217,0.07),
            0 1px 4px rgba(0,0,0,0.04);
          transition: box-shadow 0.2s, transform 0.15s;
          overflow: hidden;
          list-style: none;
        }
        .tc-root:hover {
          box-shadow:
            0 0 0 1px rgba(109,40,217,0.1),
            0 8px 28px rgba(109,40,217,0.12),
            0 2px 8px rgba(0,0,0,0.05);
          transform: translateY(-1px);
        }

        .tc-body {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          padding: 1rem 1.1rem 0.85rem;
        }

        .tc-left { flex: 1; min-width: 0; }

        .tc-title-row {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          margin-bottom: 0.3rem;
        }

        .tc-dot {
          width: 9px; height: 9px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .tc-dot--yellow { background: #f59e0b; }
        .tc-dot--blue   { background: #3b82f6; }
        .tc-dot--green  { background: #10b981; }

        .tc-title {
          font-size: 1rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .tc-title--done {
          text-decoration: line-through;
          color: #9ca3af;
        }

        .tc-user-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.72rem;
          font-weight: 600;
          color: #7c3aed;
          background: #faf5ff;
          border: 1px solid #e9d5ff;
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
          margin: 0.35rem 0 0;
        }

        .tc-desc {
          font-size: 0.82rem;
          color: #6b7280;
          margin: 0.4rem 0 0;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }

        .tc-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.55rem;
          margin-top: 0.65rem;
        }

        .tc-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.78rem;
          color: #6b7280;
        }

        .tc-badge {
          display: inline-flex;
          align-items: center;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
        }
        .tc-badge--yellow { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
        .tc-badge--blue   { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
        .tc-badge--green  { background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }

        .tc-due-warn {
          font-weight: 600;
        }
        .tc-due--overdue { color: #dc2626; }
        .tc-due--soon    { color: #d97706; }

        /* Actions */
        .tc-actions {
          display: flex;
          gap: 0.4rem;
          flex-shrink: 0;
          padding-top: 0.1rem;
        }

        .tc-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px; height: 32px;
          border-radius: 8px;
          border: 1px solid;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          flex-shrink: 0;
        }
        .tc-btn:active { transform: scale(0.93); }

        .tc-btn--edit {
          background: #fefce8;
          border-color: #fde68a;
          color: #ca8a04;
        }
        .tc-btn--edit:hover { background: #fef08a; }

        .tc-btn--delete {
          background: #fef2f2;
          border-color: #fecaca;
          color: #dc2626;
        }
        .tc-btn--delete:hover { background: #fee2e2; }

        /* Attachments */
        .tc-attach-section {
          border-top: 1px solid #f3f0ff;
          padding: 0.6rem 1.1rem;
        }

        .tc-attach-toggle {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          font-weight: 500;
          color: #9ca3af;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: color 0.15s;
        }
        .tc-attach-toggle:hover { color: #7c3aed; }

        .tc-attach-chevron {
          font-size: 0.65rem;
          color: inherit;
        }

        .tc-attach-body {
          margin-top: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
      `}</style>
    </li>
  );
}