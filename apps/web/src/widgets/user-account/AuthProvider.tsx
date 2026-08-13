"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ADMIN_EMAILS,
  initFirebase,
  petaError,
} from "@/shared/firebase/firebaseClient";
import { akhiriSesi, pastikanSesiServer } from "@/shared/auth/sesiServer";
import { keluarAuthData } from "@/shared/lib/firebase";
import {
  setAkunPasien,
  bersihkanPasienLokal,
} from "@/shared/lib/patient";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

export interface Profil {
  uid: string;
  email: string;
  nama: string;
  institusi?: string;
  role: "admin" | "user";
  avatar?: string;
  preferensi?: { sembunyikanDekorasi?: boolean; tourSelesai?: boolean };
  dibuat?: number;
  terakhirMasuk?: number;
  aktif?: boolean;
}

export interface RiwayatItem {
  tipe: string;
  judul: string;
  detail: string;
  waktuLokal: number;
}

export interface PenggunaRow {
  id: string;
  nama: string;
  email: string;
  role: string;
  aktif: boolean;
  saya: boolean;
}

type Status = "loading" | "signedOut" | "signedIn" | "error";

interface AuthContextValue {
  status: Status;
  profil: Profil | null;
  errorMsg: string;
  infoMsg: string;
  /**
   * true hanya untuk sesi tempat akun BARU SAJA dibuat (mendaftar email atau
   * masuk Google pertama kali). Dipakai memicu tur onboarding otomatis --
   * bukan disimpan ke Firestore, jadi otomatis bernilai false lagi setelah
   * halaman dimuat ulang.
   */
  akunBaru: boolean;
  masuk: (email: string, pass: string) => Promise<void>;
  masukGoogle: () => Promise<void>;
  kirimResetSandi: (email: string) => Promise<void>;
  daftar: (
    nama: string,
    institusi: string,
    email: string,
    pass: string,
  ) => Promise<void>;
  keluar: () => void;
  simpanProfil: (data: {
    nama: string;
    institusi: string;
    avatar?: string;
  }) => Promise<void>;
  simpanPref: (
    pref: Partial<{ sembunyikanDekorasi: boolean; tourSelesai: boolean }>,
  ) => Promise<void>;
  muatRiwayat: () => Promise<RiwayatItem[]>;
  catatRiwayat: (tipe: string, judul: string, detail: string) => void;
  muatPengguna: () => Promise<PenggunaRow[]>;
  ubahPeran: (id: string, peran: string) => Promise<void>;
  toggleAktif: (id: string, aktif: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>.");
  return ctx;
}

function terapkanPref(profil: Profil | null) {
  if (typeof document === "undefined") return;
  const p = (profil && profil.preferensi) || {};
  document.body.classList.toggle("tv-tanpa-dekorasi", !!p.sembunyikanDekorasi);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>("loading");
  const [profil, setProfil] = useState<Profil | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [akunBaru, setAkunBaru] = useState(false);

  const authRef = useRef<Any>(null);
  const dbRef = useRef<Any>(null);
  const uidRef = useRef<string | null>(null);
  const sedangDaftar = useRef(false);
  const router = useRouter();
  /*
   * UID yang hasil render servernya sudah disegarkan setelah cookie sesi
   * terpasang. Penanda ini menjaga router.refresh() hanya berjalan sekali
   * per akun, bukan di setiap kunjungan saat cookie memang sudah ada.
   */
  const sesiDisegarkan = useRef<string | null>(null);

  // Tentukan peran akun baru: admin jika email terdaftar admin, atau jika ini
  // pengguna pertama di koleksi users. Selain itu 'user'. (sama seperti v17)
  const tentukanPeran = useCallback(
    async (email: string): Promise<"admin" | "user"> => {
      const db = dbRef.current;
      const e = String(email || "").toLowerCase();
      if (ADMIN_EMAILS.map((x) => x.toLowerCase()).indexOf(e) >= 0)
        return "admin";
      try {
        const q = await db.collection("users").limit(1).get();
        return q.empty ? "admin" : "user";
      } catch {
        return "user";
      }
    },
    [],
  );

  // Finalisasi login: cek status aktif, ambil peran dari custom claims token
  // (tidak bisa dipalsukan pengguna), terapkan preferensi, tampilkan app.
  const selesaiMasuk = useCallback((data: Profil) => {
    if (data.aktif === false) {
      setErrorMsg("Akun Anda dinonaktifkan oleh admin.");
      setProfil(null);
      uidRef.current = null;
      setStatus("signedOut");
      if (authRef.current) authRef.current.signOut();
      return;
    }
    const auth = authRef.current;
    const u = auth && auth.currentUser ? auth.currentUser : null;
    const lanjut = (role: "admin" | "user") => {
      const finalProfil: Profil = { ...data, role };
      terapkanPref(finalProfil);
      setProfil(finalProfil);
      setErrorMsg("");
      setInfoMsg("");
      setStatus("signedIn");
    };
    if (u && typeof u.getIdTokenResult === "function") {
      u.getIdTokenResult(true)
        .then((t: Any) => {
          const role =
            t && t.claims && t.claims.role === "admin" ? "admin" : "user";
          lanjut(role);
        })
        .catch(() => lanjut("user"));
    } else {
      lanjut(data.role || "user");
    }
  }, []);

  const handleMasuk = useCallback(
    async (user: Any) => {
      if (sedangDaftar.current) return;
      const db = dbRef.current;
      uidRef.current = user.uid;
      setStatus("loading");
      /*
       * Tukarkan ID Token menjadi cookie sesi httpOnly SEBELUM profil dimuat.
       * Tanpa langkah ini server tidak pernah tahu siapa yang masuk, dan semua
       * pemeriksaan langganan di sisi server akan menjawab "belum masuk".
       *
       * Kegagalan penukaran sengaja tidak menggagalkan login: aplikasi klinis
       * tetap dapat dipakai, hanya fitur berbayar yang belum terbuka.
       */
      const sesiSiap = await pastikanSesiServer(user);
      /*
       * WHY router.refresh() di sini:
       * Gerbang /preview adalah Server Component yang membaca cookie sesi.
       * Saat halaman pertama kali dirender, cookie itu BELUM ada, karena
       * baru dipasang oleh pastikanSesiServer beberapa saat kemudian.
       * Tanpa penyegaran, layar terus menampilkan hasil render lama, yaitu
       * gerbang 'Masuk terlebih dahulu', padahal pengguna sudah masuk.
       * Itulah sebabnya gembok hilang begitu halaman disegarkan manual.
       *
       * Disegarkan HANYA bila penukaran cookie berhasil, dan hanya sekali
       * per UID. Menyegarkan tanpa cookie cuma memantulkan pengguna ke
       * gerbang yang sama, dan menyegarkan berulang membuat halaman
       * berkedip di setiap kunjungan.
       */
      if (sesiSiap && sesiDisegarkan.current !== user.uid) {
        sesiDisegarkan.current = user.uid;
        router.refresh();
      }
      try {
        const ref = db.collection("users").doc(user.uid);
        const snap = await ref.get();
        if (snap.exists) {
          const data = snap.data() as Profil;
          ref.update({ terakhirMasuk: Date.now() }).catch(() => {});
          selesaiMasuk(data);
        } else {
          const peran = await tentukanPeran(user.email);
          const data: Profil = {
            uid: user.uid,
            email: user.email || "",
            nama:
              user.displayName || (user.email || "pengguna").split("@")[0],
            institusi: "",
            role: peran,
            avatar: "",
            preferensi: { sembunyikanDekorasi: false },
            dibuat: Date.now(),
            terakhirMasuk: Date.now(),
            aktif: true,
          };
          await ref.set(data);
          setAkunBaru(true);
          selesaiMasuk(data);
        }
      } catch (e) {
        setErrorMsg("Gagal memuat profil: " + petaError(e));
        setStatus("error");
      }
    },
    [selesaiMasuk, tentukanPeran, router],
  );

  // Inisialisasi Firebase + pantau status login.
  useEffect(() => {
    let unsub: (() => void) | null = null;
    let cancelled = false;
    initFirebase()
      .then(({ auth, db }) => {
        if (cancelled) return;
        authRef.current = auth;
        dbRef.current = db;
        /*
         * Tangkap hasil signInWithRedirect. Kalau redirect gagal (mis. domain
         * belum authorized), errornya baru muncul di sini setelah halaman
         * reload — bukan di titik pemanggilan masukGoogle(). onAuthStateChanged
         * di bawah tetap yang menangani kasus SUKSES.
         */
        auth
          .getRedirectResult()
          .catch((e: Any) => {
            if (cancelled) return;
            setErrorMsg("Login Google gagal: " + petaError(e));
          });
        unsub = auth.onAuthStateChanged((user: Any) => {
          if (user) {
            // Data pasien memakai SDK Firebase terpisah, jadi lingkup akunnya
            // harus diberitahu SEBELUM komponen mulai membaca. Bila terlambat,
            // pembacaan pertama jatuh ke jalur tanpa akun.
            setAkunPasien(user.uid);
            handleMasuk(user);
          } else {
            const tadinyaMasuk = uidRef.current !== null;
            uidRef.current = null;
            sesiDisegarkan.current = null;
            setProfil(null);
            terapkanPref(null);
            setAkunPasien(null);
            bersihkanPasienLokal();
            void keluarAuthData();
            setStatus("signedOut");
            /* Cermin dari kasus masuk: setelah cookie dihapus, hasil render
               server yang masih memuat halaman berbayar harus dibuang juga.
               Dijaga tadinyaMasuk agar pengunjung yang memang belum pernah
               masuk tidak ikut menyegarkan halaman tanpa guna. */
            if (tadinyaMasuk) router.refresh();
          }
        });
      })
      .catch((e) => {
        setErrorMsg(
          "Tidak dapat memuat Firebase. Periksa koneksi internet Anda. (" +
            petaError(e) +
            ")",
        );
        setStatus("error");
      });
    return () => {
      cancelled = true;
      if (unsub) unsub();
    };
  }, [handleMasuk]);

  const masuk = useCallback(async (email: string, pass: string) => {
    const auth = authRef.current;
    if (!auth) throw new Error("Firebase belum siap.");
    try {
      await auth.signInWithEmailAndPassword(email, pass);
    } catch (e) {
      throw new Error(petaError(e));
    }
  }, []);

  /*
   * Kirim email penyetelan ulang kata sandi. Isi & pengirim emailnya diatur di
   * Firebase Console (Authentication > Templates), jadi aplikasi ini tidak
   * perlu mengirim email sendiri.
   */
  const kirimResetSandi = useCallback(async (email: string) => {
    const auth = authRef.current;
    if (!auth) throw new Error("Firebase belum siap.");
    try {
      await auth.sendPasswordResetEmail(email);
    } catch (e) {
      /*
       * Email tak dikenal sengaja diperlakukan sebagai berhasil. Membedakan
       * "terdaftar" dari "tidak terdaftar" memberi penyerang cara murah
       * memetakan siapa saja yang punya akun di sini. Pemanggil menampilkan
       * pesan netral untuk kedua kasus.
       */
      const kode = (e as Any) && (e as Any).code;
      if (kode === "auth/user-not-found") return;
      throw new Error(petaError(e));
    }
  }, []);

  const masukGoogle = useCallback(async () => {
    const auth = authRef.current;
    const fb = (window as unknown as { firebase?: Any }).firebase;
    if (!auth || !fb) throw new Error("Firebase belum siap.");
    try {
      const provider = new fb.auth.GoogleAuthProvider();
      // Redirect, bukan popup: menghindari masalah third-party cookie yang
      // memblokir komunikasi popup lintas-origin di browser modern.
      // Halaman akan navigasi keluar; hasil login ditangani setelah kembali
      // lewat getRedirectResult() di useEffect inisialisasi di bawah.
      await auth.signInWithPopup(provider);
    } catch (e) {
      throw new Error(petaError(e));
    }
  }, []);

  const daftar = useCallback(
    async (nama: string, institusi: string, email: string, pass: string) => {
      const auth = authRef.current;
      const db = dbRef.current;
      if (!auth || !db) throw new Error("Firebase belum siap.");
      sedangDaftar.current = true;
      try {
        const cred = await auth.createUserWithEmailAndPassword(email, pass);
        const user = cred.user;
        await user.updateProfile({ displayName: nama }).catch(() => {});
        const peran = await tentukanPeran(email);
        const data: Profil = {
          uid: user.uid,
          email,
          nama,
          institusi,
          role: peran,
          avatar: "",
          preferensi: { sembunyikanDekorasi: false },
          dibuat: Date.now(),
          terakhirMasuk: Date.now(),
          aktif: true,
        };
        await db.collection("users").doc(user.uid).set(data);
        uidRef.current = user.uid;
        /*
         * Tukarkan token & segarkan gerbang server, sama seperti di
         * handleMasuk() -- jalur INI (pendaftaran) sengaja melompati
         * handleMasuk lewat sedangDaftar, jadi pertukaran cookie sesi harus
         * diulang manual di sini. Tanpa ini akun baru tetap terkunci di
         * gerbang '/preview' sampai halaman disegarkan manual, karena
         * status "signedIn" di klien tidak pernah diberitahukan ke server.
         */
        const sesiSiap = await pastikanSesiServer(user);
        if (sesiSiap && sesiDisegarkan.current !== user.uid) {
          sesiDisegarkan.current = user.uid;
          router.refresh();
        }
        sedangDaftar.current = false;
        setAkunBaru(true);
        selesaiMasuk(data);
      } catch (e) {
        sedangDaftar.current = false;
        throw new Error(petaError(e));
      }
    },
    [selesaiMasuk, tentukanPeran, router],
  );

  const keluar = useCallback(() => {
    /*
     * Hapus cookie server DULU, baru keluar di klien. Urutan sebaliknya membuat
     * permintaan DELETE kehilangan cookie yang hendak dicabutnya, sehingga sesi
     * server tetap hidup meski layar sudah menampilkan halaman login.
     */
    void akhiriSesi().finally(() => {
      if (authRef.current) authRef.current.signOut();
    });
  }, []);

  const simpanProfil = useCallback(
    async (data: { nama: string; institusi: string; avatar?: string }) => {
      const db = dbRef.current;
      const uid = uidRef.current;
      if (!db || !uid) throw new Error("Belum masuk.");
      const patch: Any = {
        nama: data.nama.trim() || (profil ? profil.nama : ""),
        institusi: data.institusi.trim(),
      };
      if (data.avatar) patch.avatar = data.avatar;
      try {
        await db.collection("users").doc(uid).update(patch);
        setProfil((prev) => (prev ? { ...prev, ...patch } : prev));
      } catch (e) {
        throw new Error(petaError(e));
      }
    },
    [profil],
  );

  const simpanPref = useCallback(
    async (
      pref: Partial<{ sembunyikanDekorasi: boolean; tourSelesai: boolean }>,
    ) => {
      const db = dbRef.current;
      const uid = uidRef.current;
      if (!db || !uid) throw new Error("Belum masuk.");
      try {
        /*
         * Ditulis lewat path bertitik ("preferensi.tourSelesai", dst), BUKAN
         * `{ preferensi: pref }`. Firestore `update` dengan field biasa
         * MENGGANTI seluruh map preferensi -- menyimpan tourSelesai akan
         * diam-diam menghapus sembunyikanDekorasi yang sudah tersimpan
         * sebelumnya, begitu pula sebaliknya. Path bertitik hanya menyentuh
         * kunci yang benar-benar dikirim, sisanya tetap utuh.
         */
        const patch: Any = {};
        for (const kunci of Object.keys(pref)) {
          patch[`preferensi.${kunci}`] = (pref as Any)[kunci];
        }
        await db.collection("users").doc(uid).update(patch);
        setProfil((prev) => {
          if (!prev) return prev;
          const next = { ...prev, preferensi: { ...prev.preferensi, ...pref } };
          terapkanPref(next);
          return next;
        });
      } catch (e) {
        throw new Error(petaError(e));
      }
    },
    [],
  );

  const muatRiwayat = useCallback(async (): Promise<RiwayatItem[]> => {
    const db = dbRef.current;
    const uid = uidRef.current;
    if (!db || !uid) return [];
    const q = await db
      .collection("users")
      .doc(uid)
      .collection("riwayat")
      .orderBy("waktuLokal", "desc")
      .limit(60)
      .get();
    const out: RiwayatItem[] = [];
    q.forEach((doc: Any) => {
      const d = doc.data();
      out.push({
        tipe: d.tipe || "",
        judul: d.judul || "",
        detail: d.detail || "",
        waktuLokal: d.waktuLokal || 0,
      });
    });
    return out;
  }, []);

  const catatRiwayat = useCallback(
    (tipe: string, judul: string, detail: string) => {
      const db = dbRef.current;
      const uid = uidRef.current;
      if (!db || !uid) return;
      db.collection("users")
        .doc(uid)
        .collection("riwayat")
        .add({
          tipe: tipe || "",
          judul: judul || "",
          detail: detail || "",
          waktuLokal: Date.now(),
        })
        .catch(() => {});
    },
    [],
  );

  const muatPengguna = useCallback(async (): Promise<PenggunaRow[]> => {
    const db = dbRef.current;
    const uid = uidRef.current;
    if (!db) return [];
    const q = await db.collection("users").get();
    const out: PenggunaRow[] = [];
    q.forEach((doc: Any) => {
      const d = doc.data();
      out.push({
        id: doc.id,
        nama: d.nama || "-",
        email: d.email || "",
        role: d.role === "admin" ? "admin" : "user",
        aktif: d.aktif !== false,
        saya: doc.id === uid,
      });
    });
    return out;
  }, []);

  const ubahPeran = useCallback(async (id: string, peran: string) => {
    const db = dbRef.current;
    if (!db) return;
    try {
      await db.collection("users").doc(id).update({ role: peran });
    } catch (e) {
      throw new Error(petaError(e));
    }
  }, []);

  const toggleAktif = useCallback(async (id: string, aktif: boolean) => {
    const db = dbRef.current;
    if (!db) return;
    try {
      await db.collection("users").doc(id).update({ aktif });
    } catch (e) {
      throw new Error(petaError(e));
    }
  }, []);

  const value: AuthContextValue = {
    status,
    profil,
    errorMsg,
    infoMsg,
    akunBaru,
    masuk,
    masukGoogle,
    kirimResetSandi,
    daftar,
    keluar,
    simpanProfil,
    simpanPref,
    muatRiwayat,
    catatRiwayat,
    muatPengguna,
    ubahPeran,
    toggleAktif,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
