/**
 * Tailwind preset bersama — design tokens TinyVerse (Phase 2).
 * Memetakan NAMA token ke CSS variable di @tinyverse/ui-kit/tokens.css.
 * Pakai var(...) agar ganti tema (data-theme) jalan tanpa build ulang.
 * Additive: hanya menambah utility berbasis token (mis. bg-kuning, text-teks,
 * shadow-etail). Tidak mengubah UI apa pun.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        kuning: "var(--kuning)",
        "kuning-tua": "var(--kuning-tua)",
        biru: "var(--biru)",
        "biru-tua": "var(--biru-tua)",
        hijau: "var(--hijau)",
        "hijau-tua": "var(--hijau-tua)",
        oranye: "var(--oranye)",
        "oranye-tua": "var(--oranye-tua)",
        pink: "var(--pink)",
        "pink-tua": "var(--pink-tua)",
        krem: "var(--krem)",
        putih: "var(--putih)",
        teks: "var(--teks)",
        "teks-lembut": "var(--teks-lembut)",
        "merah-lembut": "var(--merah-lembut)",
        "etail-navy": "var(--etail-navy)",
        "etail-navy-2": "var(--etail-navy-2)",
        "etail-magenta": "var(--etail-magenta)",
        "etail-soft": "var(--etail-soft)",
        "etail-line": "var(--etail-line)",
      },
      boxShadow: {
        etail: "var(--etail-shadow)",
        "etail-soft": "var(--etail-soft-shadow)",
      },
    },
  },
}
