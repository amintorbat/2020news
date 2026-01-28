"use client";

import { useState, useRef, useEffect } from "react";
import { toPersianDigits } from "@/lib/utils/persianNumbers";

type PersianTimePickerProps = {
  value: string; // Format: HH:MM (24-hour)
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export function PersianTimePicker({
  value,
  onChange,
  placeholder = "انتخاب ساعت",
  className = "",
  disabled = false,
}: PersianTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState(12);
  const [minutes, setMinutes] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":").map(Number);
      setHours(isNaN(h) ? 12 : h);
      setMinutes(isNaN(m) ? 0 : m);
    } else {
      setHours(12);
      setMinutes(0);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Scroll to selected values
      setTimeout(() => {
        if (hoursRef.current) {
          const selectedHour = hoursRef.current.querySelector(`[data-hour="${hours}"]`);
          if (selectedHour) {
            selectedHour.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
        if (minutesRef.current) {
          const selectedMinute = minutesRef.current.querySelector(`[data-minute="${minutes}"]`);
          if (selectedMinute) {
            selectedMinute.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      }, 100);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, hours, minutes]);

  const formatTime = (h: number, m: number) => {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const displayValue = value ? toPersianDigits(formatTime(hours, minutes)) : "";

  const handleHourChange = (hour: number) => {
    setHours(hour);
    onChange(formatTime(hour, minutes));
  };

  const handleMinuteChange = (minute: number) => {
    setMinutes(minute);
    onChange(formatTime(hours, minute));
  };

  const hourOptions = Array.from({ length: 24 }, (_, i) => i);
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div ref={containerRef} className={`relative ${className}`} dir="rtl">
      <input
        type="text"
        value={displayValue}
        readOnly
        onClick={() => !disabled && setIsOpen(!isOpen)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-right"
      />

      {isOpen && !disabled && (
        <div className="absolute top-full mt-2 right-0 z-50 bg-white rounded-xl border border-[var(--border)] shadow-xl p-4 w-[280px] max-w-[calc(100vw-2rem)] sm:max-w-none">
          <div className="flex items-start justify-center gap-6">
            {/* Hours Column */}
            <div className="flex flex-col items-center">
              <label className="text-xs font-bold text-slate-700 mb-3">ساعت</label>
              <div
                ref={hoursRef}
                className="flex flex-col gap-1 max-h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 pr-1"
                style={{ scrollbarWidth: "thin" }}
              >
                {hourOptions.map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    data-hour={hour}
                    onClick={() => handleHourChange(hour)}
                    className={`
                      w-14 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      flex items-center justify-center
                      ${hours === hour 
                        ? "bg-brand text-white shadow-md scale-105" 
                        : "hover:bg-slate-100 text-slate-900"
                      }
                    `}
                  >
                    {toPersianDigits(String(hour).padStart(2, "0"))}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-3xl font-bold text-slate-400 mt-8">:</span>

            {/* Minutes Column */}
            <div className="flex flex-col items-center">
              <label className="text-xs font-bold text-slate-700 mb-3">دقیقه</label>
              <div
                ref={minutesRef}
                className="flex flex-col gap-1 max-h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 pr-1"
                style={{ scrollbarWidth: "thin" }}
              >
                {minuteOptions.map((minute) => (
                  <button
                    key={minute}
                    type="button"
                    data-minute={minute}
                    onClick={() => handleMinuteChange(minute)}
                    className={`
                      w-14 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      flex items-center justify-center
                      ${minutes === minute 
                        ? "bg-brand text-white shadow-md scale-105" 
                        : "hover:bg-slate-100 text-slate-900"
                      }
                    `}
                  >
                    {toPersianDigits(String(minute).padStart(2, "0"))}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <div className="mt-5 pt-4 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white bg-brand hover:bg-brand/90 transition-colors shadow-sm"
            >
              تایید
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
