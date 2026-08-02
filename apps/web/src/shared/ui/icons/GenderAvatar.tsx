/**
 * Avatar jenis kelamin pasien.
 *
 * Keempat fungsi ini sebelumnya hidup di dalam PatientProfile.tsx, dan berkas
 * itu tergandakan di dua tempat sehingga avatarnya pun ikut punya dua salinan.
 * Diangkat ke sini supaya hanya ada satu sumber kebenaran: siapa pun yang
 * butuh avatar mengimpor dari berkas ini, bukan dari komponen profil pasien.
 *
 * Koordinat SVG disalin persis dari berkas asal. Jangan dirapikan atau
 * dibulatkan; bentuk ikonnya sudah disetujui apa adanya.
 */

export function MaleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-3px" }}>
      <circle cx="12" cy="12" r="10" fill="#E0E7FF" />
      <path d="M7 11C7 7.5 9 6 12 6C15 6 17 7.5 17 11C17 11 15 9.5 12 9.5C9 9.5 7 11 7 11Z" fill="#1D4ED8" />
      <circle cx="12" cy="11.5" r="4" fill="#FDE68A" />
      <circle cx="10.5" cy="11" r="0.6" fill="#1E293B" />
      <circle cx="13.5" cy="11" r="0.6" fill="#1E293B" />
      <path d="M11 13C11.5 13.5 12.5 13.5 13 13" stroke="#1E293B" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M6 20C6 16.5 8.5 15 12 15C15.5 15 18 16.5 18 20" fill="#2563EB" />
    </svg>
  );
}

export function FemaleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-3px" }}>
      <circle cx="12" cy="12" r="10" fill="#FCE7F3" />
      <path d="M6 13C5.5 9 8 6 12 6C16 6 18.5 9 18 13C17 10 15 9 12 9C9 9 7 10 6 13Z" fill="#BE185D" />
      <circle cx="6.5" cy="11" r="1.5" fill="#EC4899" />
      <circle cx="17.5" cy="11" r="1.5" fill="#EC4899" />
      <circle cx="12" cy="11.5" r="4" fill="#FDE68A" />
      <circle cx="10.5" cy="11" r="0.6" fill="#1E293B" />
      <circle cx="13.5" cy="11" r="0.6" fill="#1E293B" />
      <path d="M11 13C11.5 13.5 12.5 13.5 13 13" stroke="#1E293B" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M6 20C6 16.5 8.5 15 12 15C15.5 15 18 16.5 18 20" fill="#DB2777" />
    </svg>
  );
}

export function BabyIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "-3px" }}>
      <circle cx="12" cy="12" r="10" fill="#F3E8FF" />
      <circle cx="12" cy="12" r="5" fill="#FDE68A" />
      <path d="M12 7C12.8 6 13.5 6.2 13 7" stroke="#7C3AED" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="10.2" cy="11.5" r="0.7" fill="#1E293B" />
      <circle cx="13.8" cy="11.5" r="0.7" fill="#1E293B" />
      <circle cx="9.2" cy="13" r="0.8" fill="#F43F5E" opacity="0.5" />
      <circle cx="14.8" cy="13" r="0.8" fill="#F43F5E" opacity="0.5" />
      <path d="M11 14C11.5 14.5 12.5 14.5 13 14" stroke="#1E293B" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M7 20C7 18 9 16.5 12 16.5C15 16.5 17 18 17 20" fill="#8B5CF6" />
    </svg>
  );
}

export function GenderAvatar({ jk, size = 20 }: { jk?: string | null; size?: number }) {
  if (jk === "male") return <MaleIcon size={size} />;
  if (jk === "female") return <FemaleIcon size={size} />;
  return <BabyIcon size={size} />;
}
