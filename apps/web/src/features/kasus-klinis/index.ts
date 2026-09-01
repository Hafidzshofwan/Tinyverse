import { kasusDehidrasi } from "./dehidrasi";
import { kasusIkterus } from "./ikterus";
import { kasusAsmatikus } from "./asmatikus";
import { kasusFttGizi } from "./ftt-gizi";
import { kasusKejangDemam } from "./kejang-demam";
import type { Kasus } from "../types";

export const SEMUA_KASUS: ReadonlyArray<Kasus> = [
  kasusDehidrasi,
  kasusIkterus,
  kasusAsmatikus,
  kasusFttGizi,
  kasusKejangDemam,
];

export function getKasusById(id: string): Kasus | undefined {
  return SEMUA_KASUS.find((k) => k.id === id);
}

export { kasusDehidrasi, kasusIkterus, kasusAsmatikus, kasusFttGizi, kasusKejangDemam };
