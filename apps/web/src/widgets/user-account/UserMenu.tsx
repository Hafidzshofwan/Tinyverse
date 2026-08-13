"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { avatarProps } from "./avatar";
import { ShieldUserIcon } from "@/shared/ui/icons/ShieldUserIcon";
import { BugIcon } from "@/shared/ui/icons/BugIcon";

function UserIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LanggananIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 15h4" />
    </svg>
  );
}

function LogOutIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function TurIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 2-3 4" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

/**
 * Tombol profil di header + dropdown. Menggantikan placeholder "Profil (segera)".
 * Setia dengan v17: avatar/inisial, nama, badge peran, menu Profil / Kelola
 * pengguna (admin) / Keluar.
 */
export function UserMenu({ id }: { id?: string } = {}) {
  const { profil, keluar } = useAuth();
  const [buka, setBuka] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setBuka(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  if (!profil) return null;

  const admin = profil.role === "admin";
  const ava = avatarProps(profil.avatar, profil.nama);

  return (
    <div className="tv-user" ref={wrapRef} id={id}>
      <button
        type="button"
        className="tv-user-pill"
        onClick={(e) => {
          e.stopPropagation();
          setBuka((v) => !v);
        }}
      >
        <span
          className={"tv-user-av" + (ava.teks ? "" : " tv-user-av-foto")}
          style={ava.style}
          aria-hidden
        >
          {ava.teks}
        </span>
        <span className="tv-user-nama">{profil.nama || "Pengguna"}</span>
      </button>
      {buka && (
        <div className="tv-user-drop">
          <div className="tv-drop-info">
            <div className="n">{profil.nama || "Pengguna"}</div>
            <div className="e">{profil.email || ""}</div>
            <span className={"peran" + (admin ? " admin" : "")}>
              {admin ? "Admin" : "Pengguna"}
            </span>
          </div>
          <Link
            href="/profil"
            className="tv-drop-item"
            style={{ textDecoration: "none" }}
            onClick={() => setBuka(false)}
          >
            <UserIcon size={16} /> <span>Profil saya</span>
          </Link>
          <Link
            href="/langganan"
            className="tv-drop-item"
            style={{ textDecoration: "none" }}
            onClick={() => setBuka(false)}
          >
            <LanggananIcon size={16} /> <span>Langganan</span>
          </Link>
          {admin && (
            <Link
              href="/admin/pengguna"
              className="tv-drop-item"
              style={{ textDecoration: "none" }}
              onClick={() => setBuka(false)}
            >
              <ShieldUserIcon size={16} /> <span>Kelola pengguna</span>
            </Link>
          )}
          {admin && (
            <Link
              href="/admin/error-logs"
              className="tv-drop-item"
              style={{ textDecoration: "none" }}
              onClick={() => setBuka(false)}
            >
              <BugIcon size={16} /> <span>Pemantauan error</span>
            </Link>
          )}
          <button
            className="tv-drop-item"
            onClick={() => {
              setBuka(false);
              window.dispatchEvent(new Event("tv-mulai-tur"));
            }}
          >
            <TurIcon size={16} /> <span>Mulai tur fitur</span>
          </button>
          <button
            className="tv-drop-item"
            onClick={() => {
              setBuka(false);
              keluar();
            }}
          >
            <LogOutIcon size={16} /> <span>Keluar</span>
          </button>
        </div>
      )}
    </div>
  );
}
