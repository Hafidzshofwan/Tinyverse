/**
 * Ikon kutu (bug), penanda area pemantauan error produksi.
 *
 * Dipisahkan dari ShieldUserIcon: dua menu ini menuju dua area yang sangat
 * berbeda -- satu mengelola akun, satu memantau galat produksi. Memakai
 * ikon yang sama untuk keduanya membuat pengguna sulit membedakan tujuan
 * setiap tautan sekilas pandang.
 */
export function BugIcon({
  size = 16,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 6V5a3 3 0 0 1 6 0v1" />
      <rect x="7" y="9" width="10" height="10" rx="5" />
      <path d="M12 9v10" />
      <path d="M5 12H3" />
      <path d="M21 12h-2" />
      <path d="m4.5 7.5 2 1.5" />
      <path d="m19.5 7.5-2 1.5" />
      <path d="m4.5 18 2-2" />
      <path d="m19.5 18-2-2" />
    </svg>
  );
}
