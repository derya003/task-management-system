"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import TasksStatsChart from "@/components/TasksStatsChart";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function TaskStatsPage() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="stats-root">
        {/* Header */}
        <div className="stats-header">
          <button
            className="stats-back-btn"
            onClick={() => router.push("/tasks")}
            aria-label="Görevlere dön"
          >
            <ArrowLeft size={16} />
            Geri
          </button>

          <div className="stats-header-title-wrap">
            <div className="stats-header-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 3v18h18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 16l4-5 4 3 4-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h1 className="stats-title">Görev İstatistikleri</h1>
              <p className="stats-subtitle">Tamamlanan ve bekleyen görevlerin özeti</p>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="stats-grid">
          <section className="stats-card">
            <div className="stats-card-header">
              <div className="stats-card-badge stats-card-badge--personal">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Kişisel
              </div>
              <h2 className="stats-card-title">Kendi Görevlerim</h2>
              <p className="stats-card-desc">Size atanmış görevlerin istatistikleri</p>
            </div>
            <div className="stats-card-body">
              <TasksStatsChart userScope="user" />
            </div>
          </section>

          <section className="stats-card">
            <div className="stats-card-header">
              <div className="stats-card-badge stats-card-badge--global">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M12 3c2.5 3 4 5.5 4 9s-1.5 6-4 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Global
              </div>
              <h2 className="stats-card-title">Tüm Görevler</h2>
              <p className="stats-card-desc">Sistemdeki tüm görevlerin istatistikleri</p>
            </div>
            <div className="stats-card-body">
              <TasksStatsChart userScope="global" />
            </div>
          </section>
        </div>
      </div>

      <style>{`
        .stats-root {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .stats-header {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .stats-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          font-weight: 600;
          color: #7c3aed;
          background: #faf5ff;
          border: 1px solid #e9d5ff;
          border-radius: 8px;
          padding: 0.4rem 0.85rem;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          width: fit-content;
          font-family: inherit;
        }
        .stats-back-btn:hover {
          background: #f3f0ff;
          transform: translateX(-2px);
        }

        .stats-header-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .stats-header-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px; height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          box-shadow: 0 4px 14px rgba(109,40,217,0.35);
          flex-shrink: 0;
        }

        .stats-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #3b0764;
          margin: 0 0 0.15rem;
          letter-spacing: -0.02em;
        }

        .stats-subtitle {
          font-size: 0.82rem;
          color: #6b7280;
          margin: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }

        @media (min-width: 900px) {
          .stats-grid { grid-template-columns: 1fr 1fr; }
        }

        .stats-card {
          background: #fff;
          border-radius: 18px;
          box-shadow:
            0 0 0 1px rgba(109,40,217,0.08),
            0 8px 28px rgba(109,40,217,0.09),
            0 2px 8px rgba(0,0,0,0.04);
          overflow: hidden;
        }

        .stats-card-header {
          padding: 1.2rem 1.4rem 0.9rem;
          border-bottom: 1px solid #f3f0ff;
        }

        .stats-card-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.22rem 0.6rem;
          border-radius: 20px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 0.6rem;
        }

        .stats-card-badge--personal {
          background: #faf5ff;
          color: #7c3aed;
          border: 1px solid #e9d5ff;
        }

        .stats-card-badge--global {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
        }

        .stats-card-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.2rem;
        }

        .stats-card-desc {
          font-size: 0.78rem;
          color: #9ca3af;
          margin: 0;
        }

        .stats-card-body {
          padding: 1.1rem 1.4rem 1.4rem;
        }
      `}</style>
    </DashboardLayout>
  );
}