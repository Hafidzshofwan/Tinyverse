"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

export interface RedFlagAction {
  label: string;
  href?: string;
  onClick?: () => void;
  primary?: boolean;
  icon?: React.ReactNode;
}

export interface RedFlagCrossLinkProps {
  title: string;
  description: string;
  badge?: string;
  level?: "crit" | "warn" | "info";
  actions: RedFlagAction[];
}

export function RedFlagCrossLink({
  title,
  description,
  badge = "RED-FLAG KLINIS",
  level = "crit",
  actions,
}: RedFlagCrossLinkProps) {
  const isCrit = level === "crit";
  const isWarn = level === "warn";

  const containerStyle: CSSProperties = {
    marginTop: 16,
    padding: "16px 18px",
    borderRadius: 16,
    background: isCrit
      ? "#FEF2F2"
      : isWarn
      ? "#FFFBEB"
      : "#EFF6FF",
    border: `1.5px solid ${
      isCrit
        ? "#FCA5A5"
        : isWarn
        ? "#FDE68A"
        : "#BFDBFE"
    }`,
    boxShadow: isCrit
      ? "0 4px 14px rgba(239, 68, 68, 0.12)"
      : "0 4px 12px rgba(245, 158, 11, 0.08)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    animation: "fadeIn 0.25s ease-out",
  };

  const badgeStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    fontSize: "0.72rem",
    fontWeight: 800,
    letterSpacing: "0.5px",
    padding: "3px 9px",
    borderRadius: 999,
    background: isCrit
      ? "#DC2626"
      : isWarn
      ? "#D97706"
      : "#2563EB",
    color: "#FFFFFF",
    textTransform: "uppercase",
    width: "fit-content",
  };

  const titleStyle: CSSProperties = {
    fontSize: "0.98rem",
    fontWeight: 800,
    color: isCrit ? "#991B1B" : isWarn ? "#92400E" : "#1E40AF",
    lineHeight: 1.35,
    marginTop: 2,
  };

  const descStyle: CSSProperties = {
    fontSize: "0.85rem",
    color: isCrit ? "#7F1D1D" : isWarn ? "#78350F" : "#1E3A8A",
    lineHeight: 1.5,
  };

  const actionsWrapStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 4,
  };

  return (
    <div style={containerStyle} className="tv-redflag-banner">
      <div>
        <span style={badgeStyle}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 22H22L12 2Z" fill="#FFFFFF" />
            <path d="M12 8V14M12 17H12.01" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          {badge}
        </span>
        <div style={titleStyle}>{title}</div>
        <div style={descStyle}>{description}</div>
      </div>

      {actions.length > 0 && (
        <div style={actionsWrapStyle}>
          {actions.map((act, i) => {
            const btnStyle: CSSProperties = {
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 10,
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s ease",
              textDecoration: "none",
              border: act.primary
                ? "none"
                : `1px solid ${
                    isCrit
                      ? "#F87171"
                      : isWarn
                      ? "#FBBF24"
                      : "#60A5FA"
                  }`,
              background: act.primary
                ? isCrit
                  ? "#DC2626"
                  : isWarn
                  ? "#D97706"
                  : "#2563EB"
                : "#FFFFFF",
              color: act.primary
                ? "#FFFFFF"
                : isCrit
                ? "#B91C1C"
                : isWarn
                ? "#B45309"
                : "#1D4ED8",
              boxShadow: act.primary
                ? "0 2px 6px rgba(0,0,0,0.15)"
                : "0 1px 2px rgba(0,0,0,0.04)",
            };

            if (act.href) {
              return (
                <Link key={i} href={act.href} style={btnStyle}>
                  {act.icon && <span>{act.icon}</span>}
                  <span>{act.label}</span>
                  <span style={{ fontSize: "0.9rem" }}>→</span>
                </Link>
              );
            }

            return (
              <button
                key={i}
                type="button"
                onClick={act.onClick}
                style={btnStyle}
              >
                {act.icon && <span>{act.icon}</span>}
                <span>{act.label}</span>
                <span style={{ fontSize: "0.9rem" }}>→</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
