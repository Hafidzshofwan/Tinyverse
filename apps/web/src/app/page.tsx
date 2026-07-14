import { HomeGreeting, HomeQuickAccess, HomeFavorites } from "@/widgets/home-dashboard";

export default function Page() {
  return (
    <div className="tv-container">
      <HomeGreeting />

      <HomeQuickAccess />

      <div className="tv-home-cols">
        <HomeFavorites />

        <section className="tv-card tv-stack">
          <div className="tv-home-section-head">
            <h2>
              <span aria-hidden>{"\uD83E\uDDE0"}</span> Pediatric Insight
            </h2>
            <p>Informasi edukatif singkat hari ini.</p>
          </div>
          <p className="tv-insight-body">
            Tanda dehidrasi pada anak dinilai bersama asupan, keluaran urine, dan
            kondisi umum. Rencana rehidrasi disesuaikan dengan derajat dehidrasi
            serta berat badan.
          </p>
          <p className="tv-insight-note">
            Insight harian untuk edukasi, bukan pengganti penilaian klinis.
          </p>
        </section>
      </div>

      <section className="tv-card tv-stack">
        <div className="tv-home-section-head">
          <h2>
            <span aria-hidden>{"\uD83D\uDE80"}</span> Update Tinyverse
          </h2>
          <p>Versi 2.5, fitur baru dan peningkatan terbaru.</p>
        </div>
        <ul className="tv-update-list">
          <li>
            <span aria-hidden>{"\uD83E\uDE7B"}</span> Skoring Klinis kini berisi 8 skor (dehidrasi, croup, apendisitis, Downes, asma, Kawasaki, Centor, TB anak).
          </li>
          <li>
            <span aria-hidden>{"\uD83C\uDFA8"}</span> Tampilan baru: tema terang,
            sidebar bergrup, dan dashboard beranda.
          </li>
        </ul>
      </section>
    </div>
  );
}
