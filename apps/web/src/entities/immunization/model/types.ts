export type BadgeKind = "hidup" | "inaktif";

export interface VaccineBadge {
  label: string;
  kind: BadgeKind;
}

export interface Vaccine {
  id: string;
  nama: string;
  mencegah: string;
  badges: VaccineBadge[];
  jenis: string;
  caraPemberian: string;
  jadwalDosis: string;
  kipi: string;
  kontraindikasi: string;
  catatan: string;
}

export type ChartKey = "jadwal" | "keterangan";

export interface ChartConfig {
  title: string;
  src: string;
  alt: string;
}
