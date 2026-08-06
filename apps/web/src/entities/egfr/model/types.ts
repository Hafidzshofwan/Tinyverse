export type Sex = "male" | "female";

export type EgfrFormulaSource = "ckid-u25-scr" | "ckid-u25-cysc" | "bedside-schwartz";

export interface EgfrFormulaResult {
  source: EgfrFormulaSource;
  label: string;
  citationLabel: string;
  eGFR: number;
  kUsed: number | null;
  validForAge: boolean;
}
