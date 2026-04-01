"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export default function Dropdown({ label, value, options, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* Dışarı tıklayınca kapat */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const statusLabels: Record<string, string> = {
    PENDING: "Beklemede",
    IN_PROGRESS: "Devam Ediyor",
    COMPLETED: "Tamamlandı",
  };

  const displayValue = value
    ? (statusLabels[value] ?? value)
    : label;

  const isActive = !!value;

  return (
    <div ref={ref} className="dd-root">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className={`dd-trigger ${isActive ? "dd-trigger--active" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="dd-label">{displayValue}</span>
        <ChevronDown
          size={15}
          className={`dd-chevron ${open ? "dd-chevron--open" : ""}`}
        />
      </button>

      {/* Menu */}
      {open && (
        <div className="dd-menu" role="listbox">
          <button
            className={`dd-item ${!value ? "dd-item--selected" : ""}`}
            onClick={() => { onChange(""); setOpen(false); }}
            role="option"
            aria-selected={!value}
          >
            Hepsi
          </button>

          {options.length > 0 && <div className="dd-divider" />}

          {options.map((item) => (
            <button
              key={item}
              className={`dd-item ${value === item ? "dd-item--selected" : ""}`}
              onClick={() => { onChange(item); setOpen(false); }}
              role="option"
              aria-selected={value === item}
            >
              {statusLabels[item] ?? item}
            </button>
          ))}
        </div>
      )}

      <style>{`
        .dd-root {
          position: relative;
          width: 160px;
          user-select: none;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .dd-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0.5rem 0.75rem;
          background: #faf5ff;
          border: 1.5px solid #ede9fe;
          border-radius: 10px;
          cursor: pointer;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
          gap: 0.4rem;
        }
        .dd-trigger:hover {
          border-color: #a78bfa;
          background: #fff;
        }
        .dd-trigger:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.15);
        }
        .dd-trigger--active {
          border-color: #7c3aed;
          background: #fff;
        }

        .dd-label {
          font-size: 0.85rem;
          font-weight: 500;
          color: #4c1d95;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          text-align: left;
        }

        .dd-chevron {
          color: #a78bfa;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }
        .dd-chevron--open {
          transform: rotate(180deg);
        }

        .dd-menu {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          width: 100%;
          background: #fff;
          border: 1.5px solid #ede9fe;
          border-radius: 12px;
          padding: 0.35rem;
          z-index: 50;
          box-shadow:
            0 0 0 1px rgba(109,40,217,0.06),
            0 8px 24px rgba(109,40,217,0.12),
            0 2px 6px rgba(0,0,0,0.04);
          animation: ddFadeIn 0.15s ease;
        }

        @keyframes ddFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .dd-item {
          display: block;
          width: 100%;
          padding: 0.45rem 0.7rem;
          border-radius: 8px;
          border: none;
          background: none;
          font-size: 0.83rem;
          font-weight: 500;
          color: #4b5563;
          text-align: left;
          cursor: pointer;
          transition: background 0.12s, color 0.12s;
          font-family: inherit;
        }
        .dd-item:hover {
          background: #faf5ff;
          color: #7c3aed;
        }
        .dd-item--selected {
          background: #f3f0ff;
          color: #7c3aed;
          font-weight: 600;
        }

        .dd-divider {
          height: 1px;
          background: #f3f0ff;
          margin: 0.3rem 0;
        }
      `}</style>
    </div>
  );
}