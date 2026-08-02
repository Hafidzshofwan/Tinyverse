/**
 * Ikon perisai-pengguna, penanda area administrasi.
 *
 * Diangkat ke shared/ui/icons karena dipakai di dua tempat: item menu "Kelola
 * pengguna" dan judul halamannya. Dua salinan path SVG yang sama pasti akan
 * berselisih begitu salah satunya disesuaikan.
 */
export function ShieldUserIcon({
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 16c0-2 2.5-3 5-3s5 1 5 3" />
    </svg>
  );
}
