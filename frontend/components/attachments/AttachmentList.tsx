"use client";

import api from "@/lib/axios";
import { useCallback, useEffect, useState } from "react";
import { Download, Trash2, FileText, FileImage, FileType } from "lucide-react";

interface Attachment {
  id: number;
  originalName: string;
  fileSize: number;
  uploadDate: string;
}

interface AttachmentListProps {
  taskId: number;
}

export default function AttachmentList({ taskId }: AttachmentListProps) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  /* ── Helpers ── */
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getFileIcon = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (!ext) return <FileText size={18} />;
    if (ext === "pdf") return <FileType size={18} />;
    if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext))
      return <FileImage size={18} />;
    return <FileText size={18} />;
  };

  const getFileColor = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "file-icon--red";
    if (ext && ["jpg", "jpeg", "png", "webp", "gif"].includes(ext))
      return "file-icon--blue";
    return "file-icon--gray";
  };

  /* ── Fetch ── */
  const fetchAttachments = useCallback(async () => {
    try {
      const res = await api.get(`/tasks/${taskId}/attachments`);
      setAttachments(res.data);
    } catch {
      console.error("Attachment fetch error");
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchAttachments();
  }, [fetchAttachments]);

  /* ── Delete ── */
  const handleDelete = async (id: number) => {
    if (!confirm("Bu dosyayı silmek istiyor musun?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/tasks/attachments/${id}`);
      setAttachments((prev) => prev.filter((f) => f.id !== id));
    } catch {
      alert("Bu dosyayı silme yetkin yok.");
    } finally {
      setDeletingId(null);
    }
  };

  /* ── Download ── */
  const handleDownload = async (id: number, filename: string) => {
    setDownloadingId(id);
    try {
      const res = await api.get(`/tasks/attachments/${id}/download`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Dosya indirilemedi.");
      console.error(error);
    } finally {
      setDownloadingId(null);
    }
  };

  /* ── States ── */
  if (loading) {
    return (
      <div className="attach-state">
        <span className="attach-spinner" />
        Dosyalar yükleniyor...
      </div>
    );
  }

  if (attachments.length === 0) {
    return (
      <div className="attach-state attach-state--empty">
        <FileText size={22} />
        Henüz dosya eklenmemiş.
      </div>
    );
  }

  /* ── Render ── */
  return (
    <>
      <ul className="attach-list">
        {attachments.map((file) => (
          <li key={file.id} className="attach-item">
            {/* Icon */}
            <div className={`attach-icon ${getFileColor(file.originalName)}`}>
              {getFileIcon(file.originalName)}
            </div>

            {/* Info */}
            <div className="attach-info">
              <span className="attach-name">{file.originalName}</span>
              <span className="attach-meta">
                {formatFileSize(file.fileSize)} · {formatDate(file.uploadDate)}
              </span>
            </div>

            {/* Actions */}
            <div className="attach-actions">
              <button
                className="attach-btn attach-btn--download"
                onClick={() => handleDownload(file.id, file.originalName)}
                disabled={downloadingId === file.id}
                title="İndir"
                aria-label={`${file.originalName} indir`}
              >
                {downloadingId === file.id ? (
                  <span className="attach-btn-spinner" />
                ) : (
                  <Download size={15} />
                )}
              </button>

              <button
                className="attach-btn attach-btn--delete"
                onClick={() => handleDelete(file.id)}
                disabled={deletingId === file.id}
                title="Sil"
                aria-label={`${file.originalName} sil`}
              >
                {deletingId === file.id ? (
                  <span className="attach-btn-spinner attach-btn-spinner--red" />
                ) : (
                  <Trash2 size={15} />
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>

      <style>{`
        .attach-state {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 0;
          font-size: 0.82rem;
          color: #9ca3af;
        }

        .attach-state--empty {
          color: #c4b5fd;
        }

        .attach-spinner {
          width: 13px; height: 13px;
          border: 2px solid #e9d5ff;
          border-top-color: #7c3aed;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .attach-list {
          list-style: none;
          padding: 0;
          margin: 0.5rem 0 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .attach-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.85rem;
          background: #faf5ff;
          border: 1px solid #ede9fe;
          border-radius: 10px;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .attach-item:hover {
          border-color: #c4b5fd;
          box-shadow: 0 2px 8px rgba(109,40,217,0.08);
        }

        /* Icon */
        .attach-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px; height: 34px;
          border-radius: 8px;
          flex-shrink: 0;
        }
        .file-icon--red   { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
        .file-icon--blue  { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
        .file-icon--gray  { background: #f3f4f6; color: #6b7280; border: 1px solid #e5e7eb; }

        /* Info */
        .attach-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }
        .attach-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: #4c1d95;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .attach-meta {
          font-size: 0.72rem;
          color: #9ca3af;
        }

        /* Action buttons */
        .attach-actions {
          display: flex;
          gap: 0.4rem;
          flex-shrink: 0;
        }

        .attach-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px; height: 30px;
          border-radius: 7px;
          border: 1px solid;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s, opacity 0.15s;
        }
        .attach-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .attach-btn:active:not(:disabled) { transform: scale(0.94); }

        .attach-btn--download {
          background: #eff6ff;
          border-color: #bfdbfe;
          color: #2563eb;
        }
        .attach-btn--download:hover:not(:disabled) {
          background: #dbeafe;
        }

        .attach-btn--delete {
          background: #fef2f2;
          border-color: #fecaca;
          color: #dc2626;
        }
        .attach-btn--delete:hover:not(:disabled) {
          background: #fee2e2;
        }

        .attach-btn-spinner {
          width: 12px; height: 12px;
          border: 2px solid rgba(37,99,235,0.3);
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
        }
        .attach-btn-spinner--red {
          border-color: rgba(220,38,38,0.3);
          border-top-color: #dc2626;
        }
      `}</style>
    </>
  );
}