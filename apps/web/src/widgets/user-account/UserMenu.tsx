"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";
import { avatarProps } from "./avatar";
import { ProfileModal } from "./ProfileModal";
import { AdminModal } from "./AdminModal";

/**
 * Tombol profil di header + dropdown. Menggantikan placeholder "Profil (segera)".
 * Setia dengan v17: avatar/inisial, nama, badge peran, menu Profil / Kelola
 * pengguna (admin) / Keluar.
 */
export function UserMenu() {
  const { profil, keluar } = useAuth();
  const [buka, setBuka] = useState(false);
  const [profilTampil, setProfilTampil] = useState(false);
  const [adminTampil, setAdminTampil] = useState(false);
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
    <div className="tv-user" ref={wrapRef}>
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
          <button
            className="tv-drop-item"
            onClick={() => {
              setBuka(false);
              setProfilTampil(true);
            }}
          >
            {"\uD83D\uDC64"} Profil saya
          </button>
          {admin && (
            <button
              className="tv-drop-item"
              onClick={() => {
                setBuka(false);
                setAdminTampil(true);
              }}
            >
              {"\uD83D\uDEE1\uFE0F"} Kelola pengguna
            </button>
          )}
          <button
            className="tv-drop-item"
            onClick={() => {
              setBuka(false);
              keluar();
            }}
          >
            {"\uD83D\uDEAA"} Keluar
          </button>
        </div>
      )}
      {profilTampil && (
        <ProfileModal onTutup={() => setProfilTampil(false)} />
      )}
      {adminTampil && admin && (
        <AdminModal onTutup={() => setAdminTampil(false)} />
      )}
    </div>
  );
}
