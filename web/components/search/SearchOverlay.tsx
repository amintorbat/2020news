"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { search, getSuggestions, initializeIndex } from "@/lib/search";
import type { SearchResult } from "@/lib/search/types";
import { truncateWithHighlight } from "@/lib/search/highlight";

const STORAGE_KEY = "2020news_recent_searches";
const MAX_RECENT_SEARCHES = 5;
const DEBOUNCE_MS = 300;

type SearchOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const suggestions = getSuggestions();

  // Initialize search index on mount
  useEffect(() => {
    initializeIndex();
  }, []);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setRecentSearches(JSON.parse(stored));
        }
      } catch {
        // Ignore
      }
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const updated = [
      searchQuery,
      ...recentSearches.filter((s) => s !== searchQuery),
    ].slice(0, MAX_RECENT_SEARCHES);

    setRecentSearches(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  }, [recentSearches]);

  // Debounced search
  useEffect(() => {
    if (!isOpen) return;

    const trimmedQuery = query.trim();
    if (trimmedQuery.length === 0) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      const searchResults = search(trimmedQuery, {}, 10);
      setResults(searchResults);
      setIsLoading(false);
      setSelectedIndex(-1);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery("");
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        return;
      }

      if (e.key === "Enter" && selectedIndex >= 0 && results[selectedIndex]) {
        e.preventDefault();
        const selected = results[selectedIndex];
        saveRecentSearch(query);
        router.push(selected.document.href);
        onClose();
        return;
      }

      if (e.key === "Enter" && query.trim() && results.length === 0 && !isLoading) {
        e.preventDefault();
        saveRecentSearch(query);
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        onClose();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, query, results, selectedIndex, isLoading, onClose, router, saveRecentSearch]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [selectedIndex]);

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    saveRecentSearch(suggestion);
  };

  const handleRecentSearchClick = (recent: string) => {
    setQuery(recent);
    saveRecentSearch(recent);
  };

  const handleResultClick = (result: SearchResult) => {
    saveRecentSearch(query);
    router.push(result.document.href);
    onClose();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      saveRecentSearch(trimmedQuery);
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      dir="rtl"
    >
      <div
        className="mx-auto mt-20 w-full max-w-2xl rounded-2xl border border-[var(--border)] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="border-b border-[var(--border)]">
          <div className="flex items-center gap-3 p-4">
            <svg
              className="h-5 w-5 flex-shrink-0 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو..."
              className="flex-1 border-0 bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
              dir="rtl"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="flex-shrink-0 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="پاک کردن"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </form>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {!query.trim() ? (
            /* Empty State - Suggestions and Recent Searches */
            <div className="p-4 space-y-6">
              {/* Suggestions */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-700">پیشنهادات</h3>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm text-slate-700 transition hover:border-brand hover:bg-brand/5 hover:text-brand"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-slate-700">جستجوهای اخیر</h3>
                  <div className="space-y-2">
                    {recentSearches.map((recent, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleRecentSearchClick(recent)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-right text-sm text-slate-700 transition hover:bg-slate-50"
                      >
                        <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="flex-1">{recent}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : isLoading ? (
            /* Loading State */
            <div className="flex items-center justify-center py-12">
              <div className="text-sm text-slate-500">در حال جستجو...</div>
            </div>
          ) : results.length === 0 ? (
            /* No Results */
            <div className="py-12 text-center">
              <p className="text-sm text-slate-500">نتیجه‌ای یافت نشد</p>
            </div>
          ) : (
            /* Results */
            <div ref={resultsRef} className="divide-y divide-[var(--border)]">
              {results.map((result, index) => (
                <Link
                  key={result.document.id}
                  href={result.document.href}
                  onClick={() => handleResultClick(result)}
                  className={`block px-4 py-3 transition ${
                    index === selectedIndex
                      ? "bg-brand/10"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex gap-3">
                    {result.document.imageUrl && (
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden">
                        <Image
                          src={result.document.imageUrl}
                          alt={result.document.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h4
                        className="mb-1 text-sm font-semibold text-slate-900"
                        dangerouslySetInnerHTML={{
                          __html: result.highlights?.title || result.document.title,
                        }}
                      />
                      <p
                        className="text-xs text-slate-600"
                        dangerouslySetInnerHTML={{
                          __html: truncateWithHighlight(
                            result.highlights?.excerpt || result.document.excerpt,
                            100
                          ),
                        }}
                      />
                      {result.document.category && (
                        <span className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          {result.document.category}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Keyboard hint */}
        <div className="border-t border-[var(--border)] bg-slate-50 px-4 py-2 rounded-b-2xl">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>برای بستن: Esc</span>
            <span>برای جستجو: Enter</span>
          </div>
        </div>
      </div>
    </div>
  );
}

