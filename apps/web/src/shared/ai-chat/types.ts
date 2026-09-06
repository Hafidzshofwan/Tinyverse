/**
 * Tipe data sesi chat AI.
 *
 * Dipisah dari useAiChatStore agar dapat dipakai oleh lapisan penyimpanan
 * (localStorage & Firestore) tanpa menarik dependensi React.
 */

export interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

export const DEFAULT_AI_WELCOME_MESSAGE: Message = {
  id: "welcome",
  sender: "ai",
  text: `Selamat datang di **Asisten AI Klinis Terpusat Tinyverse**! 🤖\n\nSaya telah diprogram untuk memahami seluruh modul, kalkulator, pedoman IDAI, dan konten medis di web Tinyverse ini.\n\nAda yang bisa saya bantu terkait dosis obat, terapi cairan, resusitasi PALS, alur tatalaksana, atau panduan alat klinis?`,
  timestamp: new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }),
};

/** Jumlah maksimum sesi yang disimpan (lokal & cloud). Sesi terlama dihapus otomatis. */
export const MAKS_SESI = 20;
