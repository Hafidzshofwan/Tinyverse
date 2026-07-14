/** Util avatar bersama (setia dengan v17). */

export function inisial(nama?: string): string {
  const s = String(nama || "").trim();
  if (!s) return "?";
  const bagian = s.split(/\s+/).filter(Boolean);
  const pertama = bagian[0];
  const terakhir = bagian[bagian.length - 1];
  const a = pertama ? pertama[0] ?? "" : "";
  const b = bagian.length > 1 && terakhir ? terakhir[0] ?? "" : "";
  return (a + b).toUpperCase() || "?";
}

export function avatarValid(avatar?: string): boolean {
  const a = String(avatar || "").trim();
  return !!(a && (/^data:image\//i.test(a) || /^https?:\/\//i.test(a)));
}

/** Properti style untuk node avatar: foto (background) atau inisial (teks). */
export function avatarProps(avatar?: string, nama?: string) {
  if (avatarValid(avatar)) {
    return {
      teks: "",
      style: {
        backgroundImage: 'url("' + String(avatar).replace(/"/g, '\\"') + '")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      } as React.CSSProperties,
    };
  }
  return { teks: inisial(nama), style: {} as React.CSSProperties };
}

/** Kompres foto ke JPEG dataURL maksimal 220px (sama seperti v17). */
export function fotoKeDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const rd = new FileReader();
    rd.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const maks = 220;
        const w = img.width;
        const h = img.height;
        const skala = Math.min(1, maks / Math.max(w, h));
        const cw = Math.max(1, Math.round(w * skala));
        const ch = Math.max(1, Math.round(h * skala));
        const cv = document.createElement("canvas");
        cv.width = cw;
        cv.height = ch;
        const ctx = cv.getContext("2d");
        if (!ctx) {
          reject(new Error("Kanvas tidak tersedia."));
          return;
        }
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, cw, ch);
        ctx.drawImage(img, 0, 0, cw, ch);
        resolve(cv.toDataURL("image/jpeg", 0.78));
      };
      img.onerror = () =>
        reject(new Error("Foto tidak dapat dibaca. Coba gambar JPG/PNG lain."));
      img.src = ev.target?.result as string;
    };
    rd.onerror = () => reject(new Error("Gagal membaca berkas."));
    rd.readAsDataURL(file);
  });
}
