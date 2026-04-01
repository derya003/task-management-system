"use client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface DropdownSmallProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export default function DropdownSmall({
  label,
  value,
  options,
  onChange,
}: DropdownSmallProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full select-none">
      {/* BUTTON */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // ⭐ MODAL KAPANMASINI ENGELLER
          setOpen(!open);
        }}
        className="
          flex items-center justify-between
          w-full px-3 py-2 
          bg-white border border-gray-300 
          rounded-lg shadow-sm
          hover:border-purple-400 
          transition
        "
      >
        <span className="text-gray-700 text-sm">{value || label}</span>

        <ChevronDown
          size={16}
          className={`text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* MENU */}
      {open && (
        <div
          onClick={(e) => e.stopPropagation()} // ⭐ MENÜ İÇİNDEKİ TIKLAMALAR MODAL'A GİTMEZ
          className="
            absolute mt-2 w-full 
            bg-white shadow-lg border border-gray-200 
            rounded-lg p-2 z-50
          "
        >
          {options.map((opt, index) => (
            <div key={opt}>
              <button
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className="
                  block w-full text-center px-3 py-2 
                  rounded-md text-gray-700 text-sm
                  hover:bg-purple-50 hover:text-purple-600
                "
              >
                {opt}
              </button>

              {index !== options.length - 1 && (
                <div className="w-full h-px bg-gray-200 my-1" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
