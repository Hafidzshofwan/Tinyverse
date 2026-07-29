/*
 * Titik masuk fitur Kalkulator Dosis Obat.
 *
 * WHY nama DosisTool dipertahankan sebagai alias: sejak versi React murni
 * (DosisToolNative) menggantikan island iframe, seluruh pemanggil lama --
 * terutama widgets/dosing-panel -- tidak perlu diubah sama sekali. Satu berkas
 * ini menjadi SATU tempat peralihan, sehingga tidak ada pemanggil yang
 * tertinggal menunjuk /dosis-tool.html yang sudah dihapus.
 *
 * Berkas DosisTool.tsx (pemuat iframe) sengaja belum dihapus di sini. Ia tidak
 * lagi diekspor, jadi tidak ikut terbawa ke bundel; penghapusannya dilakukan
 * pada langkah pembersihan tersendiri bersama useIslandSrc.
 */
export { DosisToolNative } from "./DosisToolNative";
export { DosisToolNative as DosisTool } from "./DosisToolNative";
