"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  TooltipProps,
} from "recharts";

import { getUserTaskStats, getGlobalTaskStats, TaskStats } from "@/lib/axios";

interface TasksStatsChartProps {
  userScope?: "user" | "global";
}

/* ── Custom Tooltip ── */
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="chart-tooltip-row">
          <span
            className="chart-tooltip-dot"
            style={{ background: entry.color }}
          />
          <span className="chart-tooltip-name">
            {entry.name === "completed" ? "Tamamlanan" : "Tamamlanmayan"}
          </span>
          <span className="chart-tooltip-value">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

/* ── Custom Legend ── */
const CustomLegend = () => (
  <div className="chart-legend">
    <div className="chart-legend-item">
      <span className="chart-legend-dot" style={{ background: "#7c3aed" }} />
      Tamamlanan
    </div>
    <div className="chart-legend-item">
      <span className="chart-legend-dot" style={{ background: "#e9d5ff" }} />
      Tamamlanmayan
    </div>
  </div>
);

const TasksStatsChart: React.FC<TasksStatsChartProps> = ({ userScope = "user" }) => {
  const [data, setData] = useState<TaskStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const stats =
          userScope === "global"
            ? await getGlobalTaskStats()
            : await getUserTaskStats();
        setData(stats);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userScope]);

  if (loading) {
    return (
      <div className="chart-state">
        <span className="chart-spinner" />
        Veriler yükleniyor...
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-state chart-state--error">
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7.5" stroke="currentColor" />
          <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {error}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="chart-state">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M7 16l4-5 4 3 4-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Henüz görev istatistiği yok.
      </div>
    );
  }

  return (
    <div className="chart-root">
      <CustomLegend />
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, left: -16, bottom: 24 }}
          barCategoryGap="35%"
          barGap={3}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f3f0ff"
          />
          <XAxis
            dataKey="category"
            interval={0}
            angle={-15}
            textAnchor="end"
            tick={{ fontSize: 12, fill: "#9ca3af", fontFamily: "Inter, system-ui, sans-serif" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#9ca3af", fontFamily: "Inter, system-ui, sans-serif" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#faf5ff" }} />
          <Bar
            dataKey="completed"
            name="completed"
            stackId="a"
            fill="#7c3aed"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="incomplete"
            name="incomplete"
            stackId="a"
            fill="#e9d5ff"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      <style>{`
        .chart-root {
          width: 100%;
        }

        .chart-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          padding: 2.5rem 1rem;
          text-align: center;
          font-size: 0.85rem;
          color: #9ca3af;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .chart-state--error {
          flex-direction: row;
          justify-content: center;
          color: #dc2626;
          padding: 1rem;
          background: #fef2f2;
          border-radius: 10px;
          border: 1px solid #fecaca;
        }

        .chart-spinner {
          width: 16px; height: 16px;
          border: 2px solid #e9d5ff;
          border-top-color: #7c3aed;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .chart-legend {
          display: flex;
          gap: 1.25rem;
          justify-content: flex-end;
          margin-bottom: 0.75rem;
        }

        .chart-legend-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          font-weight: 500;
          color: #6b7280;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .chart-legend-dot {
          width: 10px; height: 10px;
          border-radius: 3px;
          flex-shrink: 0;
        }

        .chart-tooltip {
          background: #fff;
          border: 1.5px solid #ede9fe;
          border-radius: 10px;
          padding: 0.65rem 0.85rem;
          box-shadow: 0 4px 16px rgba(109,40,217,0.12);
          font-family: 'Inter', system-ui, sans-serif;
          min-width: 160px;
        }

        .chart-tooltip-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: #3b0764;
          margin: 0 0 0.5rem;
        }

        .chart-tooltip-row {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.78rem;
          color: #4b5563;
          margin-bottom: 0.25rem;
        }

        .chart-tooltip-dot {
          width: 8px; height: 8px;
          border-radius: 2px;
          flex-shrink: 0;
        }

        .chart-tooltip-name {
          flex: 1;
          font-weight: 500;
        }

        .chart-tooltip-value {
          font-weight: 700;
          color: #3b0764;
        }
      `}</style>
    </div>
  );
};

export default TasksStatsChart;