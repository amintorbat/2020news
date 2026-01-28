"use client";

import { useState, useRef, useEffect } from "react";
import jalaali from "jalaali-js";
import { toPersianDigits } from "@/lib/utils/persianNumbers";

type PersianDatePickerProps = {
  value: string; // Format: YYYY-MM-DD (Jalali)
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export function PersianDatePicker({
  value,
  onChange,
  placeholder = "انتخاب تاریخ",
  className = "",
  disabled = false,
}: PersianDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Get current Jalali date
  const getCurrentJalali = () => {
    const now = new Date();
    return jalaali.toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  };

  useEffect(() => {
    if (value) {
      try {
        const [year, month, day] = value.split("-").map(Number);
        const formatted = `${year}/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`;
        setDisplayValue(toPersianDigits(formatted));
      } catch {
        setDisplayValue(value);
      }
    } else {
      setDisplayValue("");
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
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const currentJalali = getCurrentJalali();
  const currentYear = currentJalali.jy;
  const currentMonth = currentJalali.jm;
  const currentDay = currentJalali.jd;

  const [viewYear, setViewYear] = useState(currentYear);
  const [viewMonth, setViewMonth] = useState(currentMonth);

  useEffect(() => {
    if (value) {
      try {
        const [year, month] = value.split("-").map(Number);
        setViewYear(year);
        setViewMonth(month);
      } catch {
        // Ignore
      }
    } else {
      setViewYear(currentYear);
      setViewMonth(currentMonth);
    }
  }, [value, currentYear, currentMonth]);

  const monthNames = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  const weekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

  const getDaysInMonth = (year: number, month: number) => {
    if (month <= 6) return 31;
    if (month <= 11) return 30;
    return jalaali.isLeapJalaaliYear(year) ? 30 : 29;
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    const gregorian = jalaali.toGregorian(year, month, 1);
    const date = new Date(gregorian.gy, gregorian.gm - 1, gregorian.gd);
    const day = date.getDay();
    // Convert to RTL: Saturday (6) = 0, Sunday (0) = 1, ..., Friday (5) = 6
    return day === 6 ? 0 : day + 1;
  };

  const handleDateSelect = (day: number) => {
    const newValue = `${viewYear}-${String(viewMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onChange(newValue);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const isToday = (day: number) => {
    return viewYear === currentYear && viewMonth === currentMonth && day === currentDay;
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    const [year, month, selectedDay] = value.split("-").map(Number);
    return year === viewYear && month === viewMonth && day === selectedDay;
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`} dir="rtl">
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
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 bg-black/20 z-[9998] sm:hidden"
            onClick={() => setIsOpen(false)}
          />
          {/* Calendar */}
          <div className="absolute top-full mt-2 right-0 z-[9999] bg-white rounded-xl border border-[var(--border)] shadow-xl p-3 w-[370px] max-w-[calc(100vw-2rem)]">
          {/* Header */}
          <div className="flex items-center mb-3 gap-1">
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
              aria-label="ماه بعد"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="flex items-center gap-1.5 flex-1 min-w-0 overflow-hidden justify-center">
              <div className="relative flex-1 min-w-0 max-w-[140px]">
                <select
                  value={viewMonth}
                  onChange={(e) => setViewMonth(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand/50 bg-white text-slate-900"
                  dir="rtl"
                >
                  {monthNames.map((name, index) => (
                    <option 
                      key={index} 
                      value={index + 1}
                      className="text-slate-900 bg-white"
                    >
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative flex-1 min-w-0 max-w-[110px]">
                <select
                  value={viewYear}
                  onChange={(e) => setViewYear(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand/50 bg-white text-slate-900"
                  dir="rtl"
                >
                  {Array.from({ length: 20 }, (_, i) => currentYear - 5 + i).map((year) => (
                    <option 
                      key={year} 
                      value={year}
                      className="text-slate-900 bg-white"
                    >
                      {toPersianDigits(year)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
              aria-label="ماه قبل"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-bold text-slate-700 py-2 bg-slate-50 rounded-lg"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {emptyDays.map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}
            {days.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => handleDateSelect(day)}
                className={`
                  aspect-square rounded-lg text-sm font-medium transition-all duration-200
                  flex items-center justify-center
                  ${isSelected(day) 
                    ? "bg-brand text-white shadow-md scale-105" 
                    : "hover:bg-slate-100 text-slate-900 hover:scale-105"
                  }
                  ${isToday(day) && !isSelected(day) 
                    ? "ring-2 ring-brand/50 bg-brand/10" 
                    : ""
                  }
                `}
              >
                {toPersianDigits(day)}
              </button>
            ))}
          </div>

          {/* Today Button */}
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={() => {
                const today = getCurrentJalali();
                const todayValue = `${today.jy}-${String(today.jm).padStart(2, "0")}-${String(today.jd).padStart(2, "0")}`;
                onChange(todayValue);
                setIsOpen(false);
              }}
              className="w-full rounded-lg px-4 py-2 text-sm font-medium text-brand border border-brand hover:bg-brand hover:text-white transition-colors"
            >
              انتخاب امروز
            </button>
          </div>
        </div>
        </>
      )}
    </div>
  );
}
