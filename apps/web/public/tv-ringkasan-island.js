/*
 * tv-ringkasan-island.js
 * Jembatan Ringkasan Klinis untuk kalkulator inti berbasis iframe (island):
 *   - Dosis Obat  (#hasil-box)
 *   - Terapi Cairan (#hasilCairanBox / #hasilRencanaB / #hasilRencanaC / #hasilFaktorTetes / #hasilLukaBakar)
 *   - Racik Puyer (#puyerHasil, via tombol #puyerRingkasan yang sudah ada)
 *
 * Menulis HANYA poin klinis TERKURASI ke localStorage key bersama
 * "tinyverse_ringkasan_klinis_v1" dengan bentuk item yang sama persis dengan
 * kontrak React (shared/lib/ringkasan.ts): { id, title, body, source?, time }.
 * Karena semua island se-origin dengan app, localStorage otomatis dibagikan.
 */
(function () {
  "use strict";
  var KEY = "tinyverse_ringkasan_klinis_v1";
  var EVT = "tv-ringkasan-change";

  function loadItems() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(raw) ? raw : [];
    } catch (e) {
      return [];
    }
  }
  function saveItems(items) {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch (e) {}
  }
  function emitChange() {
    try {
      window.dispatchEvent(new Event(EVT));
    } catch (e) {}
    try {
      if (window.parent) window.parent.postMessage({ __tvRingkasan: true }, "*");
    } catch (e) {}
  }
  function nowLabel() {
    try {
      return new Date().toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch (e) {
      return new Date().toISOString();
    }
  }
  function genId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  // Kontrak addRingkasanItem() versi vanilla (identik dengan ringkasan.ts).
  function addItem(input) {
    var body = (input.body || "").trim();
    if (!body) return null;
    var item = {
      id: genId(),
      title: (input.title || "Hasil").trim(),
      body: body,
      source: input.source || undefined,
      time: nowLabel(),
    };
    var items = loadItems();
    items.unshift(item);
    saveItems(items);
    emitChange();
    return item;
  }
  // Ekspos untuk pemanggilan manual bila diperlukan.
  window.tvRingkasanAdd = addItem;

  // ---------- util pembacaan DOM ----------
  function tvText(el) {
    return (el && el.textContent ? el.textContent : "").replace(/\s+/g, " ").trim();
  }
  function nilaiSetelahLabel(box, labelText) {
    var rows = Array.prototype.slice.call(box.querySelectorAll(".hasil-row"));
    var lt = labelText.toLowerCase();
    for (var i = 0; i < rows.length; i++) {
      if (tvText(rows[i].querySelector(".label")).toLowerCase().indexOf(lt) !== -1) {
        return tvText(rows[i].querySelector(".value"));
      }
    }
    return "";
  }
  function cleanHtml(html) {
    var tmp = document.createElement("div");
    tmp.innerHTML = html || "";
    Array.prototype.forEach.call(tmp.querySelectorAll("button, .summary-add-btn"), function (el) {
      el.remove();
    });
    return (tmp.textContent || "")
      .replace(/\u00a0/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }
  function val(id) {
    var el = document.getElementById(id);
    return el && el.value ? String(el.value).trim() : "";
  }

  // ---------- toast kecil ----------
  var toastEl = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.setAttribute("role", "status");
      toastEl.style.cssText =
        "position:fixed;left:50%;bottom:18px;transform:translateX(-50%);" +
        "background:#0B0C63;color:#fff;padding:10px 16px;border-radius:12px;" +
        "font:600 13px/1.4 system-ui,Segoe UI,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.25);" +
        "z-index:99999;max-width:88vw;text-align:center;opacity:0;transition:opacity .18s ease;pointer-events:none;";
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.style.opacity = "1";
    clearTimeout(toastEl.__t);
    toastEl.__t = setTimeout(function () {
      if (toastEl) toastEl.style.opacity = "0";
    }, 2200);
  }

  // ---------- kurasi per kotak (Dosis + Cairan) ----------
  function kurasi(title, boxId, box) {
    var lines = [];

    if (boxId === "hasil-box") {
      var nama =
        (document.getElementById("namaTerpilih") &&
          document.getElementById("namaTerpilih").textContent.trim()) ||
        nilaiSetelahLabel(box, "Obat") ||
        "Obat";
      var dosis = tvText(box.querySelector(".hasil-dosis"));
      var volume = tvText(box.querySelector(".hasil-volume"));
      var frekuensi = tvText(box.querySelector(".hasil-frekuensi")).replace(/^\u23f0\s*/, "");
      var sediaan = nilaiSetelahLabel(box, "Sediaan");
      var pasien = nilaiSetelahLabel(box, "Pasien");
      var warning = tvText(box.querySelector(".hasil-warning"));
      if (dosis) lines.push("Dosis: " + dosis);
      if (volume) lines.push("Volume pemberian: " + volume);
      if (frekuensi) lines.push("Frekuensi: " + frekuensi);
      if (sediaan) lines.push("Sediaan: " + sediaan);
      if (pasien) lines.push("Pasien: " + pasien);
      if (warning) lines.push(warning.replace(/^\u26a0\ufe0f?\s*/, "Peringatan: "));
      return { title: nama, source: "Dosis Obat", body: lines.join("\n") };
    }

    if (boxId === "hasilCairanBox") {
      var total = tvText(box.querySelector(".hasil-dosis"));
      var kec =
        box.querySelector(".hasil-dosis") &&
        tvText(box.querySelector(".hasil-dosis").nextElementSibling);
      var bb = val("cairanBerat");
      if (bb) lines.push("BB: " + bb + " kg");
      if (total) lines.push("Rumatan: " + total);
      if (kec) lines.push("Kecepatan: " + kec);
      return { title: "Cairan Rumatan (Holliday\u2013Segar)", source: "Terapi Cairan", body: lines.join("\n") };
    }

    if (boxId === "hasilRencanaB") {
      var totalB = tvText(box.querySelector(".hasil-dosis"));
      var lajuB =
        box.querySelector(".hasil-dosis") &&
        tvText(box.querySelector(".hasil-dosis").nextElementSibling);
      var bbB = val("cairanBeratB");
      if (bbB) lines.push("BB: " + bbB + " kg");
      if (totalB) lines.push("Cairan: " + totalB);
      if (lajuB) lines.push(lajuB);
      return { title: "Rehidrasi WHO \u2014 Rencana B", source: "Terapi Cairan", body: lines.join("\n") };
    }

    if (boxId === "hasilRencanaC") {
      var totalC = tvText(box.querySelector(".hasil-dosis"));
      var subC =
        box.querySelector(".hasil-dosis") &&
        tvText(box.querySelector(".hasil-dosis").nextElementSibling);
      var tahap = Array.prototype.slice.call(box.querySelectorAll(".hasil-tahap")).map(function (t) {
        var judul = tvText(t.querySelector(".hasil-tahap-judul"));
        var vals = Array.prototype.slice.call(t.querySelectorAll(".hasil-tahap-baris")).map(function (r) {
          return tvText(r.querySelector(".hasil-tahap-label")) + ": " + tvText(r.querySelector(".hasil-tahap-nilai"));
        });
        return [judul].concat(vals).filter(Boolean).join(" \u2014 ");
      });
      var bbC = val("cairanBeratC");
      if (bbC) lines.push("BB: " + bbC + " kg");
      if (totalC) lines.push("Total: " + totalC);
      if (subC) lines.push(subC);
      lines = lines.concat(tahap);
      return { title: "Rehidrasi WHO \u2014 Rencana C", source: "Terapi Cairan", body: lines.join("\n") };
    }

    if (boxId === "hasilFaktorTetes") {
      var tetes = tvText(box.querySelector(".hasil-dosis"));
      var mlJam =
        box.querySelector(".hasil-dosis") &&
        tvText(box.querySelector(".hasil-dosis").nextElementSibling);
      var volTetes = val("tetesVolume");
      var lama = val("tetesLamaJam");
      var dripEl = document.querySelector("#tetesDripTab .segmented-btn.aktif");
      var drip = dripEl ? tvText(dripEl) : "";
      if (tetes) lines.push("Tetesan: " + tetes);
      if (mlJam) lines.push("Kecepatan: " + mlJam);
      if (volTetes) lines.push("Volume: " + volTetes + " mL");
      if (lama) lines.push("Lama pemberian: " + lama + " jam");
      if (drip) lines.push("Drip set: " + drip);
      return { title: "Faktor Tetes", source: "Terapi Cairan", body: lines.join("\n") };
    }

    if (boxId === "hasilLukaBakar") {
      var cards = Array.prototype.slice.call(box.querySelectorAll(".burn-result-card"));
      function pick(kw) {
        for (var i = 0; i < cards.length; i++) {
          if (tvText(cards[i].querySelector("h4")).toLowerCase().indexOf(kw) !== -1) return cards[i];
        }
        return null;
      }
      var tbsaCard = pick("luas");
      var parklandCard = pick("parkland");
      var pembagianCard = pick("pembagian");
      var maintenanceCard = pick("maintenance");
      var totalCard = pick("total");
      var urinCard = pick("urin");
      var tbsa = tbsaCard && tvText(tbsaCard.querySelector(".burn-result-value"));
      if (tbsa) lines.push("TBSA: " + tbsa);
      if (parklandCard) lines.push("Parkland: " + tvText(parklandCard.querySelector(".burn-result-value")));
      if (pembagianCard) lines.push(tvText(pembagianCard.querySelector(".hasil-rincian")));
      if (maintenanceCard) lines.push("Maintenance: " + tvText(maintenanceCard.querySelector(".burn-result-value")));
      if (totalCard) lines.push("Total 24 jam pertama: " + tvText(totalCard.querySelector(".burn-result-value")));
      if (urinCard) lines.push("Target urin: " + tvText(urinCard.querySelector(".burn-result-value")));
      return { title: "Rehidrasi Luka Bakar", source: "Terapi Cairan", body: lines.join("\n") };
    }

    return { title: title, source: undefined, body: cleanHtml(box.innerHTML) };
  }

  function tambahDariBox(title, boxId) {
    var box = document.getElementById(boxId);
    if (!box) return;
    var hidden = box.offsetParent === null && getComputedStyle(box).display === "none";
    if (hidden) {
      toast("Hasil belum tampil. Hitung dulu sebelum menambahkan.");
      return;
    }
    var r = kurasi(title, boxId, box);
    var body = r.body && r.body.trim() ? r.body : cleanHtml(box.innerHTML);
    var it = addItem({ title: r.title, body: body, source: r.source });
    if (it) toast("Ditambahkan ke Ringkasan: " + it.title);
  }

  // ---------- pasang tombol untuk Dosis + Cairan ----------
  var TARGETS = [
    { id: "hasil-box", title: "Dosis Obat" },
    { id: "hasilCairanBox", title: "Cairan Rumatan" },
    { id: "hasilRencanaB", title: "Rehidrasi WHO \u2014 Rencana B" },
    { id: "hasilRencanaC", title: "Rehidrasi WHO \u2014 Rencana C" },
    { id: "hasilFaktorTetes", title: "Faktor Tetes" },
    { id: "hasilLukaBakar", title: "Rehidrasi Luka Bakar" },
  ];
  function pasangTombol() {
    TARGETS.forEach(function (t) {
      var box = document.getElementById(t.id);
      if (!box) return;
      var hasContent = (box.textContent || "").trim().length > 0;
      if (!hasContent || box.querySelector(".summary-add-btn")) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "summary-add-btn";
      btn.textContent = "\ud83d\udcc4 Tambahkan ke Ringkasan";
      btn.addEventListener("click", function () {
        tambahDariBox(t.title, t.id);
      });
      box.appendChild(btn);
    });
  }

  // ---------- Racik Puyer (kurasi khusus, dipanggil tombol #puyerRingkasan) ----------
  function metricVal(box, label) {
    var mets = Array.prototype.slice.call(box.querySelectorAll(".puyer-metric"));
    var lt = label.toLowerCase();
    for (var i = 0; i < mets.length; i++) {
      if (tvText(mets[i].querySelector(".label")).toLowerCase().indexOf(lt) !== -1) {
        return tvText(mets[i].querySelector(".value"));
      }
    }
    return "";
  }
  window.tvRingkasanTambahPuyer = function () {
    var box = document.getElementById("puyerHasil");
    var kartu = document.getElementById("puyerHasilKartu");
    if (!box || (kartu && getComputedStyle(kartu).display === "none")) {
      toast("Hasil belum tampil. Hitung puyer dulu.");
      return;
    }
    var lines = [];
    var bb = val("puyerBb");
    var jumlah = metricVal(box, "jumlah puyer");
    var frek = metricVal(box, "frekuensi");
    var durasi = metricVal(box, "durasi");
    var aturan = val("puyerAturan");
    if (bb) lines.push("BB: " + bb + " kg");
    if (jumlah) lines.push("Jumlah puyer: " + jumlah);
    if (frek && frek !== "\u2014") lines.push("Frekuensi: " + frek);
    if (durasi && durasi !== "\u2014") lines.push("Durasi: " + durasi);
    if (aturan) lines.push("Aturan pakai: " + aturan);

    var rows = Array.prototype.slice.call(box.querySelectorAll(".puyer-table tbody tr"));
    var namaObat = [];
    if (rows.length) {
      lines.push("");
      lines.push("Obat per bungkus:");
      rows.forEach(function (tr) {
        var td = tr.querySelectorAll("td");
        if (!td.length) return;
        var nm = tvText(td[0].querySelector("strong")) || tvText(td[0]);
        var target = td[1] ? tvText(td[1]) : "";
        var aktual = td[6] ? tvText(td[6]) : "";
        if (nm) namaObat.push(nm);
        lines.push("- " + nm + ": target " + target + " (aktual " + aktual + ")");
      });
    }

    var warns = Array.prototype.slice.call(box.querySelectorAll(".puyer-note"))
      .map(function (n) { return tvText(n); })
      .filter(function (t) {
        return /TERPISAH|HINDARI|HATI-HATI|interaksi|\u26d4|\u26a0/i.test(t);
      });
    if (warns.length) {
      lines.push("");
      lines.push("Peringatan:");
      warns.forEach(function (w) { lines.push("- " + w); });
    }

    var resepEl = box.querySelector(".puyer-resep-box");
    var resep = resepEl ? (resepEl.textContent || "").trim() : "";
    if (resep) {
      lines.push("");
      lines.push("Draft resep:");
      lines.push(resep);
    }

    var judul = namaObat.length ? "Racik Puyer \u2014 " + namaObat.join(", ") : "Racik Puyer";
    var it = addItem({ title: judul, body: lines.join("\n"), source: "Racik Puyer" });
    if (it) toast("Ditambahkan ke Ringkasan: Racik Puyer");
  };

  // ---------- init ----------
  function init() {
    pasangTombol();
    // Kotak hasil sering muncul setelah user menghitung -> pasang ulang.
    document.addEventListener("click", function () { setTimeout(pasangTombol, 90); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Enter") setTimeout(pasangTombol, 90);
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
