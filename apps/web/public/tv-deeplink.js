/* Tinyverse - Jembatan deep-link island.
   Membaca ?tk=<target> dari URL island, menemukan elemen tujuan, membuka
   tab/kategori/detail yang menaunginya, menyorotnya, lalu meminta halaman
   induk untuk menggulir ke posisi elemen tersebut.
   Bentuk target: "id:<elementId>" atau "text:<substring teks>". */
(function () {
  "use strict";

  function ambilParam() {
    try {
      var s = new URLSearchParams(location.search);
      return s.get("tk") || "";
    } catch (e) {
      return "";
    }
  }

  var TK = ambilParam();
  if (!TK) return;

  // Kunci pencocokan: buang semua selain huruf/angka agar tahan beda spasi &
  // tanda baca (mis. "(IV/IO) 0,01" vs "(IV/IO)0,01").
  function key(s) {
    return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
  }

  function cari() {
    if (TK.indexOf("id:") === 0) {
      return document.getElementById(TK.slice(3));
    }
    if (TK.indexOf("text:") === 0) {
      var needle = key(TK.slice(5));
      if (needle.length < 3) return null;
      var sel =
        "h1,h2,h3,h4,h5,button,a,summary,label,li,td,th,strong," +
        ".pals-label,.tv-skor-card-nama,.obat-nama,.dx-judul,span,div";
      var nodes = document.querySelectorAll(sel);
      var best = null;
      var bestLen = 1000000;
      for (var i = 0; i < nodes.length; i++) {
        var raw = nodes[i].textContent || "";
        var t = key(raw);
        if (t && t.indexOf(needle) !== -1 && raw.length < bestLen) {
          best = nodes[i];
          bestLen = raw.length;
        }
      }
      return best;
    }
    return document.getElementById(TK);
  }

  function bukaLeluhur(el) {
    var node = el;
    while (node && node !== document.body && node !== null) {
      var cl = node.classList;
      if (cl) {
        // Kategori PALS yang tertutup.
        if (cl.contains("pals-cat") && cl.contains("tutup")) {
          cl.remove("tutup");
        }
        // Panel/pane tersembunyi umum di beberapa island.
        if (cl.contains("tutup") && !cl.contains("pals-cat")) {
          cl.remove("tutup");
        }
        // Tab Mode Darurat: aktifkan pane .drt-tabpane yang belum aktif.
        if (cl.contains("drt-tabpane") && !cl.contains("aktif")) {
          var id = node.id || "";
          var key = id.indexOf("drtTab-") === 0 ? id.slice(7) : "";
          if (key) {
            var btn = document.querySelector(
              '.drt-tab[data-drttab="' + key + '"]'
            );
            if (btn) {
              btn.click();
            }
          }
        }
        // Panel nutrisi yang disembunyikan lewat display:none.
        if (cl.contains("dx-panel")) {
          node.style.display = "";
        }
      }
      if (node.tagName === "DETAILS" && !node.open) {
        node.open = true;
      }
      if (node.hasAttribute && node.hasAttribute("hidden")) {
        node.removeAttribute("hidden");
      }
      node = node.parentElement;
    }
  }

  function sorot(el) {
    var old = el.style.boxShadow;
    var oldT = el.style.transition;
    var oldR = el.style.borderRadius;
    el.style.transition = "box-shadow .25s ease";
    el.style.borderRadius = el.style.borderRadius || "12px";
    el.style.boxShadow =
      "0 0 0 3px #E5006D, 0 0 0 8px rgba(229,0,109,.22)";
    setTimeout(function () {
      el.style.boxShadow = old;
      setTimeout(function () {
        el.style.transition = oldT;
        el.style.borderRadius = oldR;
      }, 400);
    }, 2000);
  }

  function mintaScroll(el) {
    try {
      var rect = el.getBoundingClientRect();
      var top =
        rect.top +
        (window.pageYOffset || document.documentElement.scrollTop || 0);
      if (window.parent) {
        window.parent.postMessage({ __tkScrollTo: top }, "*");
      }
    } catch (e) {}
  }

  var tries = 0;
  function tick() {
    tries += 1;
    var el = cari();
    if (el) {
      bukaLeluhur(el);
      setTimeout(function () {
        bukaLeluhur(el);
        sorot(el);
        mintaScroll(el);
      }, 260);
      return;
    }
    if (tries < 25) {
      setTimeout(tick, 160);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(tick, 120);
    });
  } else {
    setTimeout(tick, 120);
  }
})();
