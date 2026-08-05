"use client";

import { useMemo, useState } from "react";
import { DAFTAR_GUIDELINE, KATEGORI_GUIDELINE } from "./data";
import type { GuidelineItem, GuidelinePdfFile } from "./data";

export function GuidelineTool() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selectedGuidelineId, setSelectedGuidelineId] = useState<string | null>(null);

  const selectedGuideline = useMemo(() => {
    return DAFTAR_GUIDELINE.find((g) => g.id === selectedGuidelineId) || null;
  }, [selectedGuidelineId]);

  const filteredGuidelines = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return DAFTAR_GUIDELINE.filter((item) => {
      const categoryMatch = activeCategory === "Semua" || item.category === activeCategory;
      if (!categoryMatch) return false;
      if (!q) return true;
      const haystack = [
        item.title,
        item.category,
        item.year,
        item.source,
        item.description,
        ...(item.tags || []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    }).sort((a, b) => {
      if (activeCategory === "Semua") {
        return a.title.localeCompare(b.title, "id", { sensitivity: "base" });
      }
      return 0;
    });
  }, [searchQuery, activeCategory]);

  const getPdfFiles = (item: GuidelineItem): GuidelinePdfFile[] => {
    if (item.pdfFiles && item.pdfFiles.length > 0) {
      return item.pdfFiles;
    }
    if (item.pdfUrl) {
      return [{ label: "PDF", url: item.pdfUrl }];
    }
    return [];
  };

  return (
    <div id="isl" className="guideline-container w-full max-w-[1080px] mx-auto px-2 sm:px-4 pb-12">
      <style>{`
        .guideline-container {
          max-width: 1080px;
          margin: 0 auto;
        }

        .guideline-judul-section {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .guideline-ikon-bulat {
          width: 38px;
          height: 38px;
          min-width: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent !important;
        }

        .guideline-judul-section h2 {
          font-family: 'Fredoka', 'Quicksand', system-ui, sans-serif;
          font-size: 19.48px !important;
          font-weight: 800;
          color: var(--tv-teks, #1E1B4B);
          margin: 0;
          line-height: 1.2;
        }

        [data-theme="dark"] .guideline-judul-section h2 {
          color: #F8FAFC;
        }

        .guideline-judul-section p {
          margin: 0 !important;
          color: var(--tv-soft-teks, #64748B);
          font-size: 10.24px !important;
          font-weight: 600;
        }

        [data-theme="dark"] .guideline-judul-section p {
          color: #94A3B8;
        }

        .guideline-kartu-utama {
          background: var(--tv-card, #FFFFFF);
          border-radius: 26px;
          padding: 24px;
          box-shadow: var(--tv-chunky, 0 10px 0 rgba(0,0,0,0.04), 0 12px 30px rgba(84, 198, 235, 0.15));
          border: 1px solid var(--tv-line, rgba(10, 11, 95, 0.09));
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        [data-theme="dark"] .guideline-kartu-utama {
          background: #1E293B;
          border-color: #334155;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        .sr-only {
          position: absolute !important;
          width: 1px !important;
          height: 1px !important;
          padding: 0 !important;
          margin: -1px !important;
          overflow: hidden !important;
          clip: rect(0, 0, 0, 0) !important;
          white-space: nowrap !important;
          border-width: 0 !important;
        }

        .guideline-search-wrap {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
        }

        .guideline-search-input {
          width: 100%;
          padding: 12px 20px 12px 46px;
          border: 3px solid #EAF6FB;
          border-radius: 50px;
          font-family: 'Quicksand', system-ui, sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--tv-teks, #0A0B4F);
          background: var(--tv-card, #FFFFFF);
          transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
        }

        [data-theme="dark"] .guideline-search-input {
          background: #0F172A;
          border-color: #334155;
          color: #F8FAFC;
        }

        .guideline-search-input:focus {
          outline: none;
          border-color: #38BDF8;
          box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.15);
        }

        .guideline-search-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          z-index: 2;
        }

        .guideline-filter-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .guideline-chip {
          border: 0;
          border-radius: 999px;
          padding: 8px 14px;
          font-family: 'Fredoka', 'Quicksand', system-ui, sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--tv-teks, #0A0B4F);
          background: #F6F3E8;
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease, color 0.15s ease;
          user-select: none;
        }

        [data-theme="dark"] .guideline-chip {
          background: #0F172A;
          color: #CBD5E1;
        }

        .guideline-chip:hover {
          transform: translateY(-1px);
        }

        .guideline-chip.aktif {
          background: linear-gradient(160deg, #38BDF8, #0284C7) !important;
          color: #FFFFFF !important;
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
        }

        .guideline-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
          margin-top: 4px;
        }

        .guideline-card-item {
          background: #F8FAFC;
          border-radius: 20px;
          padding: 18px 16px 20px;
          min-height: 220px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          gap: 10px;
          text-align: center;
          cursor: pointer;
          border: 1.5px solid rgba(56, 189, 248, 0.35);
          box-shadow: 0 4px 14px rgba(14, 165, 233, 0.07), 0 1px 3px rgba(0, 0, 0, 0.02);
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
        }

        [data-theme="dark"] .guideline-card-item {
          background: #0F172A;
          border: 1.5px solid rgba(56, 189, 248, 0.3);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
        }

        .guideline-card-item:hover {
          transform: translateY(-4px);
          background: #FFFFFF;
          border-color: #0284C7;
          box-shadow: 0 10px 24px rgba(2, 132, 199, 0.18);
        }

        [data-theme="dark"] .guideline-card-item:hover {
          background: #1E293B;
          border-color: #38BDF8;
          box-shadow: 0 12px 28px rgba(56, 189, 248, 0.25);
        }

        .guideline-card-head {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-align: center;
        }

        .guideline-card-icon {
          width: 52px;
          height: 52px;
          border-radius: 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          background: #EFEAFF;
          font-size: 1.65rem;
          line-height: 1;
          flex: 0 0 auto;
        }

        [data-theme="dark"] .guideline-card-icon {
          background: rgba(147, 51, 234, 0.25);
        }

        .guideline-card-title {
          margin: 0;
          width: 100%;
          font-family: 'Fredoka', 'Quicksand', system-ui, sans-serif;
          font-size: 1.02rem;
          font-weight: 800;
          color: var(--tv-teks, #0A0B4F);
          line-height: 1.18;
          text-align: center;
        }

        [data-theme="dark"] .guideline-card-title {
          color: #F8FAFC;
        }

        .guideline-card-meta {
          width: 100%;
          font-size: 0.78rem;
          font-weight: 800;
          color: var(--tv-soft-teks, #667085);
          line-height: 1.35;
          text-align: center;
        }

        [data-theme="dark"] .guideline-card-meta {
          color: #94A3B8;
        }

        .guideline-card-desc {
          width: 100%;
          margin: 2px 0 0;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--tv-soft-teks, #667085);
          line-height: 1.45;
          text-align: center;
        }

        [data-theme="dark"] .guideline-card-desc {
          color: #CBD5E1;
        }

        .guideline-btn-kembali {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Fredoka', 'Quicksand', system-ui, sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          color: #2563EB;
          background: var(--tv-card, #FFFFFF);
          border: 1px solid var(--tv-line, rgba(10, 11, 95, 0.1));
          padding: 8px 18px;
          border-radius: 999px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: transform 0.15s ease, background 0.15s ease;
          margin-bottom: 16px;
        }

        [data-theme="dark"] .guideline-btn-kembali {
          background: #1E293B;
          border-color: #334155;
          color: #38BDF8;
        }

        .guideline-btn-kembali:hover {
          transform: translateY(-1px);
        }

        .guideline-referensi-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 800;
          color: #D97706;
          background: #FEF3C7;
          border: 1px solid #FDE68A;
          padding: 4px 12px;
          border-radius: 999px;
          margin-top: 4px;
        }

        [data-theme="dark"] .guideline-referensi-badge {
          color: #FBBF24;
          background: rgba(217, 119, 6, 0.2);
          border-color: rgba(217, 119, 6, 0.4);
        }

        .guideline-detail-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .guideline-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 0;
          border-radius: 14px;
          padding: 10px 18px;
          font-family: 'Fredoka', 'Quicksand', system-ui, sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.15s ease, opacity 0.15s ease;
        }

        .guideline-action-btn:hover {
          transform: translateY(-2px);
        }

        .guideline-action-btn.buka {
          background: #22C7A7;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(34, 199, 167, 0.3);
        }

        .guideline-action-btn.download {
          background: #F9D85C;
          color: #0A0B4F;
          box-shadow: 0 4px 12px rgba(249, 216, 92, 0.3);
        }

        .guideline-pdf-wrap {
          border: 2px solid #EAF6FB;
          border-radius: 20px;
          overflow: hidden;
          background: #F8F8F2;
          min-height: 65vh;
        }

        [data-theme="dark"] .guideline-pdf-wrap {
          border-color: #334155;
          background: #0F172A;
        }

        .guideline-pdf-frame {
          width: 100%;
          height: 72vh;
          border: 0;
          display: block;
          background: #ffffff;
        }

        .guideline-pesan-kosong {
          text-align: center;
          color: var(--tv-soft-teks, #64748B);
          font-weight: 600;
          font-size: 0.85rem;
          padding: 24px 16px;
          margin: 8px 0 0 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        [data-theme="dark"] .guideline-pesan-kosong {
          color: #94A3B8;
        }

        @media (max-width: 768px) {
          .guideline-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 12px;
          }
          .guideline-card-item {
            padding: 14px 12px 16px;
            min-height: 200px;
          }
          .guideline-pdf-frame {
            height: 65vh;
          }
        }
      `}</style>

      {!selectedGuideline ? (
        <section id="protokol-gallery-section">
          {/* Header Section */}
          <div className="guideline-judul-section">
            <div className="guideline-ikon-bulat">
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="6" fill="#F3E8FF" />
                <path
                  d="M4 19.5C4 18.1 5.1 17 6.5 17H20V4H6.5C5.1 4 4 5.1 4 6.5V19.5Z"
                  fill="#E9D5FF"
                  stroke="#9333EA"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path d="M4 19.5C4 20.9 5.1 22 6.5 22H20" stroke="#9333EA" strokeWidth="1.8" />
                <path d="M9 8H15M9 12H13" stroke="#6B21A8" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h2>Guideline Anak</h2>
              <p>Kumpulan guideline pediatri untuk dibaca langsung atau diunduh.</p>
            </div>
          </div>

          {/* Main Card Container */}
          <div className="guideline-kartu-utama">
            {/* Search Input */}
            <div className="guideline-search-wrap">
              <span className="guideline-search-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="#2563EB" strokeWidth="2.2" />
                  <path d="M16 16L21 21" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>
              <label htmlFor="kotakCariProtokol" className="sr-only">
                Cari guideline
              </label>
              <input
                id="kotakCariProtokol"
                type="text"
                placeholder="Cari judul, kategori, sumber... contoh: Pneumonia"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="guideline-search-input"
              />
            </div>

            {/* Category Chips */}
            <div className="guideline-filter-chips" aria-label="Filter kategori guideline">
              {KATEGORI_GUIDELINE.map((kat) => {
                const isAktif = activeCategory === kat;
                return (
                  <button
                    key={kat}
                    type="button"
                    onClick={() => setActiveCategory(kat)}
                    className={`guideline-chip ${isAktif ? "aktif" : ""}`}
                  >
                    {kat}
                  </button>
                );
              })}
            </div>

            {/* Cards Grid */}
            {filteredGuidelines.length > 0 ? (
              <div className="guideline-grid">
                {filteredGuidelines.map((item) => (
                  <article
                    key={item.id}
                    onClick={() => setSelectedGuidelineId(item.id)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedGuidelineId(item.id);
                      }
                    }}
                    className="guideline-card-item"
                  >
                    <div className="guideline-card-head">
                      <div
                        className="guideline-card-icon"
                        dangerouslySetInnerHTML={{ __html: item.iconSvg || "" }}
                      />
                      <div>
                        <h3 className="guideline-card-title">{item.title}</h3>
                        <div className="guideline-card-meta">
                          {item.category} • {item.source} • {item.year}
                        </div>
                      </div>
                    </div>
                    <p className="guideline-card-desc">{item.description}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p id="pesan-kosong-protokol" className="guideline-pesan-kosong">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M8 11H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Guideline tidak ditemukan, coba kata kunci atau kategori lain.
              </p>
            )}
          </div>
        </section>
      ) : (
        /* Detail View Section */
        <section id="protokol-detail-section">
          <button
            type="button"
            onClick={() => setSelectedGuidelineId(null)}
            className="guideline-btn-kembali"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#2563EB" fillOpacity="0.1" />
              <path
                d="M15 12H9M9 12L12 9M9 12L12 15"
                stroke="#2563EB"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Kembali ke daftar guideline
          </button>

          {/* Header Title */}
          <div className="guideline-judul-section">
            <div
              className="guideline-ikon-bulat"
              dangerouslySetInnerHTML={{ __html: selectedGuideline.iconSvg || "" }}
            />
            <div>
              <h2>{selectedGuideline.title}</h2>
              <span className="guideline-referensi-badge">
                {selectedGuideline.category} • {selectedGuideline.source} • {selectedGuideline.year}
              </span>
            </div>
          </div>

          {/* Content Card */}
          <div className="guideline-kartu-utama">
            <p className="guideline-card-desc text-left m-0">{selectedGuideline.description}</p>

            {/* Action Buttons */}
            <div className="guideline-detail-actions">
              {getPdfFiles(selectedGuideline).map((file, idx) => (
                <div key={idx} className="flex flex-wrap gap-2">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="guideline-action-btn buka"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M18 13V19C18 20.1 17.1 21 16 21H5C3.9 21 3 20.1 3 19V8C3 6.9 3.9 6 5 6H11M15 3H21V9M10 14L20.5 3.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Buka PDF {getPdfFiles(selectedGuideline).length > 1 ? `(${file.label})` : ""}
                  </a>

                  <a
                    href={file.url}
                    download
                    className="guideline-action-btn download"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 3V15M12 15L7 10M12 15L17 10M4 19H20"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Download {file.label}
                  </a>
                </div>
              ))}
            </div>

            {/* Embedded PDF Frames */}
            <div className="space-y-4 pt-2">
              {getPdfFiles(selectedGuideline).map((file, idx) => (
                <div key={idx} className="guideline-pdf-wrap">
                  <iframe
                    src={`${file.url}#view=FitH`}
                    title={`PDF ${selectedGuideline.title} - ${file.label}`}
                    className="guideline-pdf-frame"
                  />
                </div>
              ))}
            </div>

            <div className="text-[11px] sm:text-xs text-[var(--tv-soft-teks,#64748B)] dark:text-slate-400 font-semibold italic">
              Jika PDF tidak tampil nyaman di HP, gunakan tombol “Buka PDF”.
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
