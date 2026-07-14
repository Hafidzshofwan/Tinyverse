import { burnAreaLabel, type BurnArea } from "@tinyverse/clinical-core";

export interface RegionOption {
  area: BurnArea;
  label: string;
}

export interface RegionGroup {
  title: string;
  options: ReadonlyArray<RegionOption>;
}

// Region granular yang bisa dipilih user, meniru peta tubuh v17 (panel depan +
// belakang). Sengaja TANPA region kombinasi (head, armRightFull, dst.) agar tidak
// terjadi hitung ganda; nilai persen tiap region diambil dari clinical-core.
const FRONT_AREAS: ReadonlyArray<BurnArea> = [
  "headFront",
  "neckFront",
  "chest",
  "abdomen",
  "armRightUpperFront",
  "armRightLowerFront",
  "handRightFront",
  "armLeftUpperFront",
  "armLeftLowerFront",
  "handLeftFront",
  "legRightThighFront",
  "legRightLowerFront",
  "footRightFront",
  "legLeftThighFront",
  "legLeftLowerFront",
  "footLeftFront",
  "perineum",
];

const BACK_AREAS: ReadonlyArray<BurnArea> = [
  "headBack",
  "neckBack",
  "upperBack",
  "lowerBack",
  "buttockRight",
  "buttockLeft",
  "armRightUpperBack",
  "armRightLowerBack",
  "handRightBack",
  "armLeftUpperBack",
  "armLeftLowerBack",
  "handLeftBack",
  "legRightThighBack",
  "legRightLowerBack",
  "footRightBack",
  "legLeftThighBack",
  "legLeftLowerBack",
  "footLeftBack",
];

function toOptions(
  areas: ReadonlyArray<BurnArea>,
): ReadonlyArray<RegionOption> {
  return areas.map((area) => ({ area, label: burnAreaLabel(area) }));
}

export const BURN_REGION_GROUPS: ReadonlyArray<RegionGroup> = [
  { title: "Bagian Depan (Anterior)", options: toOptions(FRONT_AREAS) },
  { title: "Bagian Belakang (Posterior)", options: toOptions(BACK_AREAS) },
];
