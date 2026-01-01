"use client";

import { useEffect, useState } from "react";

type Heading = {
  id: string;
  text: string;
  level: number;
};

type TableOfContentsProps = {
  html: string;
};

export function TableOfContents({ html }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

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
    <nav className="space-y-3" dir="rtl">
      <h3 className="mb-3 text-sm font-bold text-slate-900">فهرست مطالب</h3>
      <ul className="space-y-0.5 text-sm">
        {headings.map((heading) => (
          <li key={heading.id} className="relative">
            <button
              type="button"
              onClick={() => scrollToHeading(heading.id)}
              className={`block w-full rounded-md px-2 py-1.5 text-right transition-all hover:bg-slate-50 hover:text-blue-600 ${
                heading.level === 3 ? "mr-6 text-xs" : "text-sm"
              } ${
                activeId === heading.id
                  ? "bg-blue-50 font-semibold text-blue-600"
                  : "text-slate-700"
              }`}
            >
              {heading.level === 3 && (
                <span className="mr-1 inline-block h-1 w-1 rounded-full bg-slate-400 align-middle" />
              )}
              <span className="align-middle">{heading.text}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
