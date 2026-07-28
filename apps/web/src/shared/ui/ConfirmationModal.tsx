"use client";

import { useEffect, type CSSProperties, type ReactNode } from "react";

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  icon?: ReactNode;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Hapus",
  cancelText = "Batal",
  variant = "danger",
  icon,
}: ConfirmationModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          iconBg: "rgba(239, 68, 68, 0.12)",
          iconColor: "#DC2626",
          btnBg: "#DC2626",
          btnHover: "#B91C1C",
          btnColor: "#FFFFFF",
        };
      case "warning":
        return {
          iconBg: "rgba(245, 158, 11, 0.12)",
          iconColor: "#D97706",
          btnBg: "#D97706",
          btnHover: "#B45309",
          btnColor: "#FFFFFF",
        };
      default:
        return {
          iconBg: "rgba(59, 130, 246, 0.12)",
          iconColor: "#2563EB",
          btnBg: "#2563EB",
          btnHover: "#1D4ED8",
          btnColor: "#FFFFFF",
        };
    }
  };

  const vStyles = getVariantStyles();

  const backdropStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    backdropFilter: "blur(4px)",
    zIndex: 99999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  };

  const cardStyle: CSSProperties = {
    backgroundColor: "var(--putih, #ffffff)",
    borderRadius: 20,
    maxWidth: 440,
    width: "100%",
    padding: "24px 24px 20px 24px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(226, 232, 240, 0.8)",
    position: "relative",
  };

  return (
    <div style={backdropStyle} onClick={onClose} role="dialog" aria-modal="true">
      <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 18 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              backgroundColor: vStyles.iconBg,
              color: vStyles.iconColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon || (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <h3
              style={{
                margin: "0 0 6px 0",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--tv-navy, #0a0b5f)",
                fontFamily: "'Fredoka', 'Quicksand', sans-serif",
              }}
            >
              {title}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "0.88rem",
                color: "#64748B",
                lineHeight: 1.5,
                fontFamily: "'Quicksand', sans-serif",
              }}
            >
              {description}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            style={{
              padding: "9px 18px",
              borderRadius: 12,
              fontSize: "0.88rem",
              fontWeight: 600,
              color: "#475569",
              backgroundColor: "#F1F5F9",
              border: "1px solid #E2E8F0",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{
              padding: "9px 18px",
              borderRadius: 12,
              fontSize: "0.88rem",
              fontWeight: 700,
              color: vStyles.btnColor,
              backgroundColor: vStyles.btnBg,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              transition: "all 0.15s ease",
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
