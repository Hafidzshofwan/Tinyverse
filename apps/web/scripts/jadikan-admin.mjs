/**
 * Memasang custom claim { role: "admin" } pada satu pengguna.
 *
 * WHY skrip sekali pakai, bukan endpoint: kewenangan admin tidak boleh bisa
 * diberikan lewat jaringan. Bila ada endpoint yang menaikkan peran, endpoint
 * itu sendiri menjadi sasaran. Custom claim hanya diubah dari mesin yang
 * memegang service account.
 *
 * Jalankan dari folder apps/web:
 *   node scripts/jadikan-admin.mjs                     -> daftar semua pengguna
 *   node scripts/jadikan-admin.mjs email@contoh.com    -> jadikan admin
 *   node scripts/jadikan-admin.mjs <UID>               -> jadikan admin
 *   node scripts/jadikan-admin.mjs email@contoh.com --cabut
 */
import { readFileSync } from "node:fs";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function muatEnvLokal(berkas = ".env.local") {
  let teks;
  try {
    teks = readFileSync(berkas, "utf8");
  } catch {
    return;
  }
  for (const baris of teks.split(/\r?\n/)) {
    const bersih = baris.trim();
    if (!bersih || bersih.startsWith("#")) continue;
    const pisah = bersih.indexOf("=");
    if (pisah < 0) continue;
    const nama = bersih.slice(0, pisah).trim();
    let nilai = bersih.slice(pisah + 1).trim();
    if (
      (nilai.startsWith('"') && nilai.endsWith('"')) ||
      (nilai.startsWith("'") && nilai.endsWith("'"))
    ) {
      nilai = nilai.slice(1, -1);
    }
    if (process.env[nama] === undefined) process.env[nama] = nilai;
  }
}

function wajib(nama) {
  const nilai = process.env[nama];
  if (!nilai) {
    console.error(`GAGAL: environment variable ${nama} belum diset.`);
    console.error("Pastikan berkas apps/web/.env.local ada dan skrip dijalankan dari folder apps/web.");
    process.exit(1);
  }
  return nilai;
}

muatEnvLokal();

const app = initializeApp({
  credential: cert({
    projectId: wajib("FIREBASE_PROJECT_ID"),
    clientEmail: wajib("FIREBASE_CLIENT_EMAIL"),
    privateKey: wajib("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
  }),
});

const auth = getAuth(app);

const arg = process.argv[2];
const cabut = process.argv.includes("--cabut");

/* Tanpa argumen: tampilkan daftar. UID Firebase penuh karakter yang mudah
   tertukar saat dibaca mata (I vs l, O vs 0), jadi jangan pernah menyalinnya
   dari tangkapan layar. Salin dari keluaran ini. */
if (!arg || arg.startsWith("--")) {
  const hasil = await auth.listUsers(100);
  if (hasil.users.length === 0) {
    console.log("Belum ada pengguna terdaftar di project ini.");
  } else {
    console.log(`Ada ${hasil.users.length} pengguna:`);
    console.log("");
    for (const u of hasil.users) {
      const peran = u.customClaims?.role ?? "-";
      console.log(`  email : ${u.email ?? "(tanpa email)"}`);
      console.log(`  uid   : ${u.uid}`);
      console.log(`  peran : ${peran}`);
      console.log("");
    }
    console.log("Jadikan admin dengan:");
    console.log("  node scripts/jadikan-admin.mjs <email di atas>");
  }
  process.exit(0);
}

/* Email jauh lebih aman diketik daripada UID. */
const pengguna = await (arg.includes("@")
  ? auth.getUserByEmail(arg)
  : auth.getUser(arg)
).catch((e) => {
  console.error(`GAGAL: pengguna "${arg}" tidak ditemukan.`);
  console.error(String(e && e.message ? e.message : e));
  console.error("");
  console.error("Jalankan tanpa argumen untuk melihat daftar pengguna:");
  console.error("  node scripts/jadikan-admin.mjs");
  process.exit(1);
});

const klaimBaru = { ...(pengguna.customClaims ?? {}) };
if (cabut) delete klaimBaru.role;
else klaimBaru.role = "admin";

await auth.setCustomUserClaims(pengguna.uid, klaimBaru);

/* Sesi lama masih membawa klaim lama. Mencabut refresh token memaksa
   pengguna masuk ulang, sehingga cookie sesi berikutnya membawa klaim baru. */
await auth.revokeRefreshTokens(pengguna.uid);

const sesudah = await auth.getUser(pengguna.uid);
console.log("Selesai.");
console.log("  email :", sesudah.email ?? "(tanpa email)");
console.log("  uid   :", sesudah.uid);
console.log("  klaim :", JSON.stringify(sesudah.customClaims ?? {}));
console.log("");
console.log("Salin uid di atas — itu juga accountId Anda untuk langkah aktivasi.");
console.log("Sesi lama sudah dicabut. Keluar lalu masuk kembali di browser.");
