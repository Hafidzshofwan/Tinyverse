import { kuisSkoring } from "./skoring";
import { kuisCairan } from "./cairan";
import { kuisNeonatus } from "./neonatus";
import type { KuisModul } from "../types";

export const SEMUA_KUIS: ReadonlyArray<KuisModul> = [
  kuisSkoring,
  kuisCairan,
  kuisNeonatus,
];

export function getKuisById(modulId: string): KuisModul | undefined {
  return SEMUA_KUIS.find((k) => k.modulId === modulId);
}

export { kuisSkoring, kuisCairan, kuisNeonatus };
