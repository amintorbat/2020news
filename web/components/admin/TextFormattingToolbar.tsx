"use client";

import { useState, useRef, useEffect } from "react";

type TextFormattingToolbarProps = {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function TextFormattingToolbar({
  textareaRef,
  value,
  onChange,
  disabled = false,
}: TextFormattingToolbarProps) {
  const [isSticky, setIsSticky] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleScroll = () => {
      if (!textarea || !toolbarRef.current) return;
      
      const rect = textarea.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible && rect.top < 100) {
        setIsSticky(true);
        if (toolbarRef.current) {
          toolbarRef.current.style.top = "0px";
        }
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    textarea.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      textarea.removeEventListener("scroll", handleScroll);
    };
  }, [textareaRef]);

  const insertText = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea || disabled) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);

    onChange(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const formatActions = [
    {
      label: "بولد",
      action: () => insertText("**", "**"),
      icon: "B",
      title: "بولد (Ctrl+B)",
    },
    {
      label: "ایتالیک",
      action: () => insertText("*", "*"),
      icon: "I",
      title: "ایتالیک (Ctrl+I)",
    },
    {
      label: "لینک",
      action: () => insertText("[", "](url)"),
      icon: "🔗",
      title: "لینک",
    },
    {
      label: "کد",
      action: () => insertText("`", "`"),
      icon: "</>",
      title: "کد",
    },
  ];

  return (
    <div
      ref={toolbarRef}
      className={`flex items-center gap-1 rounded-lg border border-[var(--border)] bg-white p-1.5 shadow-sm ${
        isSticky ? "sticky top-0 z-50 mb-2" : "mb-2"
      }`}
      dir="rtl"
    >
      {formatActions.map((action, idx) => (
        <div key={idx}>
          <button
            type="button"
            onClick={action.action}
            disabled={disabled}
            title={action.title}
            className="flex h-8 w-8 items-center justify-center rounded text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-50 sm:h-9 sm:w-9"
          >
            {action.icon}
          </button>
        </div>
      ))}
      <div className="h-6 w-px bg-[var(--border)]" />
      <button
        type="button"
        onClick={() => {
          const textarea = textareaRef.current;
          if (textarea) {
            const start = textarea.selectionStart;
            const lines = value.substring(0, start).split("\n");
            const currentLine = lines[lines.length - 1];
            const indent = "  ";
            const newValue =
              value.substring(0, start - currentLine.length) +
              indent +
              currentLine +
              value.substring(start);
            onChange(newValue);
            setTimeout(() => {
              textarea.focus();
              textarea.setSelectionRange(
                start + indent.length,
                start + indent.length
              );
            }, 0);
          }
        }}
        disabled={disabled}
        title="تورفتگی"
        className="flex h-8 w-8 items-center justify-center rounded text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-50 sm:h-9 sm:w-9"
      >
        →
      </button>
    </div>
  );
}
