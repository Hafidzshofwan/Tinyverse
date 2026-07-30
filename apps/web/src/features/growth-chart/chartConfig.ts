/**
 * Konfigurasi chart pertumbuhan + ANGKA KALIBRASI.
 *
 * PERINGATAN: angka pada `calibration` (imgWidth, imgHeight, plot.x0/x1/y0/y1,
 * xRange, yRange, usiaLineY) memetakan nilai klinis ke piksel gambar chart.
 * Mengubah satu angka saja akan menggeser titik plot pasien.
 *
 * Angka WHO diperoleh dengan MENGUKUR gridline gambar chart secara terprogram,
 * bukan dengan mengklik lewat "Mode Kalibrasi Chart". Sumbu X dicocokkan pada
 * 61 tick bulan dan sumbu Y pada seluruh gridline (BB/U tiap 1 kg, TB/U tiap
 * 1 cm, IMT/U tiap 0,2 kg/m²); sisa galat pencocokan < 1 piksel. `plot` selalu
 * menunjuk TEPI BINGKAI area kurva, dan `yRange` adalah nilai pada tepi itu —
 * bukan pada garis berlabel terdekat. Mode Kalibrasi Chart tetap berguna untuk
 * gambar chart baru, tetapi ketelitiannya dibatasi oleh ukuran tampilan layar,
 * jadi hasilnya sebaiknya diperiksa ulang dengan pengukuran gambar aslinya.
 *
 * Satu-satunya perbedaan dari v17: path gambar diberi garis miring di depan
 * ("assets/..." → "/assets/...") karena komponen React dapat dirender dari rute
 * mana pun, sedangkan island selalu berada di root. Berkas gambarnya identik.
 */

/** Pemetaan nilai klinis → piksel pada gambar chart. */
export interface Kalibrasi {
  imgWidth: number;
  imgHeight: number;
  plot: { x0: number; x1: number; y0: number; y1: number };
  xRange: [number, number];
  yRange: [number, number];
  /** Baris tick bulan pada chart CDC, tempat garis bantu vertikal berhenti. */
  usiaLineY?: number;
}

export interface SeriChart {
  key: string;
  yField: string;
  yLabel: string;
  yUnit: string;
  emoji: string;
  zKey: string;
  warna: string;
  /** IMT tidak diinput manual, melainkan dihitung dari BB & TB. */
  computed?: boolean;
}

export interface Chart {
  id: string;
  title: string;
  ageLabel: string;
  zAge: string;
  image: string;
  series: SeriChart[];
  calibration: Record<string, Kalibrasi | undefined>;
}

export interface Indikator {
  label: string;
  emoji: string;
  combined: boolean;
  xField: string;
  xLabel: string;
  xUnit: string;
  charts: Chart[];
}

export interface KonfigKelamin {
  label: string;
  emoji: string;
  indicators: Record<string, Indikator>;
}

export interface KonfigStandar {
  label: string;
  sub: string;
  genders: Record<string, KonfigKelamin>;
}

export type Standar = "who" | "cdc";
export type Kelamin = "male" | "female";

const TKIMG = {
  who_m_bbu: "/assets/images/who-male-bbu.jpg",
  who_m_tbu: "/assets/images/who-male-tbu.jpg",
  who_f_bbu: "/assets/images/who-female-bbu.jpg",
  who_f_tbu: "/assets/images/who-female-tbu.jpg",
  who_m_imtu: "/assets/images/who-male-imtu.jpg",
  who_f_imtu: "/assets/images/who-female-imtu.jpg",
  cdc_m: "/assets/images/cdc-male.jpg",
  cdc_f: "/assets/images/cdc-female.jpg"
};

export const GROWTH_CHART_CONFIG: Record<string, KonfigStandar> = {
  who: {
    label: "WHO",
    sub: "World Health Organization",
    genders: {
      male: {
        label: "Laki-laki", emoji: "\u{1F466}",
        indicators: {
          bbtbu: {
            label: "BB/U, TB/U, & IMT/U", emoji: "\u{1F4CA}", combined: true,
            xField: "usia", xLabel: "Usia (bulan)", xUnit: "bln",
            charts: [
              { id: "bbu", title: "BB/U \u2014 Berat Badan menurut Umur", ageLabel: "0\u201360 bulan", zAge: "0-60",
                image: TKIMG.who_m_bbu,
                series: [ { key: "berat", yField: "berat", yLabel: "Berat Badan (kg)", yUnit: "kg", emoji: "\u2696\ufe0f", zKey: "bbu", warna: "#E63946" } ],
                calibration: { berat: {imgWidth:1754,imgHeight:1241,plot:{x0:230.59,x1:1489.87,y0:249.63,y1:1055.74},xRange:[0,60],yRange:[1,29]} } },
              { id: "tbu", title: "TB/U \u2014 Tinggi/Panjang Badan menurut Umur", ageLabel: "0\u201360 bulan", zAge: "0-60",
                image: TKIMG.who_m_tbu,
                series: [ { key: "tinggi", yField: "tinggi", yLabel: "Tinggi/Panjang Badan (cm)", yUnit: "cm", emoji: "\u{1F4CF}", zKey: "tbu", warna: "#1565C0" } ],
                calibration: { tinggi: {imgWidth:1754,imgHeight:1241,plot:{x0:230.59,x1:1489.87,y0:249.03,y1:1055.79},xRange:[0,60],yRange:[40,125]} } },
              { id: "imtu", title: "IMT/U \u2014 Indeks Massa Tubuh menurut Umur", ageLabel: "0\u201360 bulan", zAge: "0-60",
                image: TKIMG.who_m_imtu,
                series: [ { key: "imt", yField: "imt", yLabel: "IMT (kg/m\u00b2)", yUnit: "kg/m\u00b2", emoji: "\u{1F9EE}", zKey: "imtu", warna: "#7B1FA2", computed: true } ],
                calibration: { imt: {imgWidth:3508,imgHeight:2481,plot:{x0:461.43,x1:2980.29,y0:499.31,y1:2110.68},xRange:[0,60],yRange:[9.2,22.8]} } }
            ]
          }
        }
      },
      female: {
        label: "Perempuan", emoji: "\u{1F467}",
        indicators: {
          bbtbu: {
            label: "BB/U, TB/U, & IMT/U", emoji: "\u{1F4CA}", combined: true,
            xField: "usia", xLabel: "Usia (bulan)", xUnit: "bln",
            charts: [
              { id: "bbu", title: "BB/U \u2014 Berat Badan menurut Umur", ageLabel: "0\u201360 bulan", zAge: "0-60",
                image: TKIMG.who_f_bbu,
                series: [ { key: "berat", yField: "berat", yLabel: "Berat Badan (kg)", yUnit: "kg", emoji: "\u2696\ufe0f", zKey: "bbu", warna: "#E63946" } ],
                calibration: { berat: {imgWidth:1754,imgHeight:1241,plot:{x0:230.57,x1:1489.88,y0:249.69,y1:1055.72},xRange:[0,60],yRange:[1,31]} } },
              { id: "tbu", title: "TB/U \u2014 Tinggi/Panjang Badan menurut Umur", ageLabel: "0\u201360 bulan", zAge: "0-60",
                image: TKIMG.who_f_tbu,
                series: [ { key: "tinggi", yField: "tinggi", yLabel: "Tinggi/Panjang Badan (cm)", yUnit: "cm", emoji: "\u{1F4CF}", zKey: "tbu", warna: "#1565C0" } ],
                calibration: { tinggi: {imgWidth:1754,imgHeight:1241,plot:{x0:230.53,x1:1489.87,y0:249.05,y1:1055.79},xRange:[0,60],yRange:[40,125]} } },
              { id: "imtu", title: "IMT/U \u2014 Indeks Massa Tubuh menurut Umur", ageLabel: "0\u201360 bulan", zAge: "0-60",
                image: TKIMG.who_f_imtu,
                series: [ { key: "imt", yField: "imt", yLabel: "IMT (kg/m\u00b2)", yUnit: "kg/m\u00b2", emoji: "\u{1F9EE}", zKey: "imtu", warna: "#7B1FA2", computed: true } ],
                calibration: { imt: {imgWidth:3508,imgHeight:2481,plot:{x0:461.43,x1:2980.29,y0:499.31,y1:2110.68},xRange:[0,60],yRange:[9.2,22.8]} } }
            ]
          }
        }
      }
    }
  },

  cdc: {
    label: "CDC",
    sub: "Centers for Disease Control and Prevention",
    genders: {
      male: {
        label: "Laki-laki", emoji: "\u{1F466}",
        indicators: {
          bbtbu: {
            label: "BB/U, TB/U, & BB/TB", emoji: "\u{1F4CA}", combined: true,
            xField: "usia", xLabel: "Usia (bulan)", xUnit: "bln",
            charts: [
              { id: "cdc", title: "BB/U, TB/U, & BB/TB", ageLabel: "2\u201320 tahun", zAge: "24-240",
                image: TKIMG.cdc_m,
                series: [
                  { key: "berat",  yField: "berat",  yLabel: "Berat Badan (kg)",  yUnit: "kg", emoji: "\u2696\ufe0f", zKey: "bbu", warna: "#E63946" },
                  { key: "tinggi", yField: "tinggi", yLabel: "Tinggi Badan (cm)", yUnit: "cm", emoji: "\u{1F4CF}", zKey: "tbu", warna: "#1565C0" }
                ],
                calibration: {
                  tinggi: {imgWidth:1275,imgHeight:1650,plot:{x0:226.98,x1:1032,y0:205.5,y1:1214.79},xRange:[24,240],yRange:[75,195],usiaLineY:1467.11},
                  berat:  {imgWidth:1275,imgHeight:1650,plot:{x0:226.98,x1:1032,y0:626.04,y1:1467.11},xRange:[24,240],yRange:[10,110],usiaLineY:1467.11}
                } }
            ]
          }
        }
      },
      female: {
        label: "Perempuan", emoji: "\u{1F467}",
        indicators: {
          bbtbu: {
            label: "BB/U, TB/U, & BB/TB", emoji: "\u{1F4CA}", combined: true,
            xField: "usia", xLabel: "Usia (bulan)", xUnit: "bln",
            charts: [
              { id: "cdc", title: "BB/U, TB/U, & BB/TB", ageLabel: "2\u201320 tahun", zAge: "24-240",
                image: TKIMG.cdc_f,
                series: [
                  { key: "berat",  yField: "berat",  yLabel: "Berat Badan (kg)",  yUnit: "kg", emoji: "\u2696\ufe0f", zKey: "bbu", warna: "#E63946" },
                  { key: "tinggi", yField: "tinggi", yLabel: "Tinggi Badan (cm)", yUnit: "cm", emoji: "\u{1F4CF}", zKey: "tbu", warna: "#1565C0" }
                ],
                calibration: {
                  tinggi: {imgWidth:1275,imgHeight:1650,plot:{x0:227.03,x1:1032.01,y0:205.53,y1:1214.8},xRange:[24,240],yRange:[75,195],usiaLineY:1467.11},
                  berat:  {imgWidth:1275,imgHeight:1650,plot:{x0:227.03,x1:1032.01,y0:626.06,y1:1467.11},xRange:[24,240],yRange:[10,110],usiaLineY:1467.11}
                } }
            ]
          }
        }
      }
    }
  }
};

/** Persentil ke-50 CDC 2–20 tahun — disalin persis dari v17. */
export const TK_CDC_P50: Record<string, { age: number[]; weight: number[]; height: number[] }> = {
  male: {
    age:    [24,36,48,60,72,84,96,108,120,132,144,156,168,180,192,204,216,228,240],
    weight: [12.7,14.3,16.3,18.3,20.5,23.0,25.6,28.6,32.0,36.0,40.5,45.5,51.0,56.0,61.0,65.0,68.0,70.0,72.0],
    height: [86.5,95.2,102.9,109.2,115.5,121.7,128.0,133.5,138.5,143.5,149.1,156.2,164.1,170.1,173.4,175.2,176.1,176.7,177.0]
  },
  female: {
    age:    [24,36,48,60,72,84,96,108,120,132,144,156,168,180,192,204,216,228,240],
    weight: [12.1,13.9,16.0,18.2,20.6,23.3,26.5,30.5,35.5,41.0,47.0,52.0,55.5,57.5,58.5,59.5,60.2,60.8,61.2],
    height: [85.7,94.1,101.8,108.4,114.7,120.8,127.5,133.8,138.6,144.0,151.3,157.1,160.4,162.0,162.7,163.0,163.2,163.3,163.3]
  }
};
