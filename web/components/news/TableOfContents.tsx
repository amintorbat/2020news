"use client";

import { useEffect, useState } from "react";

type Heading = {
  id: string;
  text: string;
  level: number;
};

type TableOfContentsProps = {
  html: string;
  collapsible?: boolean;
};

export function TableOfContents({ html, collapsible = false }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(!collapsible);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Wait for DOM to be ready, then extract headings from the rendered article body
    const timeoutId = setTimeout(() => {
      const articleBody = document.querySelector('[itemprop="articleBody"]');
      if (!articleBody) return;

      const extractedHeadings: Heading[] = [];
      const headingElements = articleBody.querySelectorAll("h2, h3");

      headingElements.forEach((heading) => {
        const text = heading.textContent?.trim() || "";
        if (!text || !heading.id) return;

        const level = heading.tagName === "H2" ? 2 : 3;

        extractedHeadings.push({
          id: heading.id,
          text,
          level,
        });
      });

      if (extractedHeadings.length === 0) return;

      setHeadings(extractedHeadings);

      // Intersection Observer for active heading
      const observerOptions = {
        rootMargin: "-100px 0px -66%",
        threshold: 0,
      };

      const observerCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      };

      const observer = new IntersectionObserver(observerCallback, observerOptions);

      headingElements.forEach((heading) => {
        if (heading.id) {
          observer.observe(heading);
        }
      });

      return () => {
        observer.disconnect();
      };
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [html]);

  if (headings.length === 0) return null;

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="space-y-3 rounded-xl border border-[var(--border)] bg-white p-4 lg:p-6" dir="rtl">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-sm font-bold text-slate-900"
      >
        <span>فهرست مطالب</span>
        {collapsible && (
          <svg
            className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>
      {isOpen && (
        <ul className="space-y-1 text-sm">
          {headings.map((heading) => (
            <li key={heading.id} className="relative">
              <button
                type="button"
                onClick={() => scrollToHeading(heading.id)}
                className={`block w-full rounded-lg px-3 py-2 text-right text-sm transition-all ${
                  activeId === heading.id
                    ? "bg-blue-50 font-semibold text-blue-600"
                    : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                }`}
              >
                <span className="block leading-relaxed">{heading.text}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
