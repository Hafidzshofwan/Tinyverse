"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("tv-theme");
    if (saved === "dark" || saved === "light") {
      setTheme(saved);
      applyTheme(saved);
    } else {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = systemDark ? "dark" : "light";
      setTheme(initial);
      applyTheme(initial);
    }
  }, []);

  const applyTheme = (t: "light" | "dark") => {
    document.documentElement.setAttribute("data-theme", t);
    if (t === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("tv-theme", nextTheme);
    applyTheme(nextTheme);
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className="tv-theme-toggle"
        aria-label="Ganti mode gelap/terang"
        disabled
      >
        <span style={{ opacity: 0 }}>🌙</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`tv-theme-toggle ${theme}`}
      onClick={toggleTheme}
      title={theme === "dark" ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
      aria-label={theme === "dark" ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
    >
      <div className="tv-theme-icon-wrapper">
        {/* Sun Icon (Visible in dark mode) */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`tv-theme-icon tv-theme-icon-sun ${theme === "dark" ? "active" : "inactive"}`}
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>

        {/* Moon Icon (Visible in light mode) */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`tv-theme-icon tv-theme-icon-moon ${theme === "light" ? "active" : "inactive"}`}
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </div>
    </button>
  );
}
