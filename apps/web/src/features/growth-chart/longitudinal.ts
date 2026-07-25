import {
  tkInterpolasiZscoreRow,
  tkHitungZscoreNumerik,
  hitungIMT,
  ZscoreTable,
} from "./zscore";

export type Gender = "male" | "female";

export interface GrowthRecord {
  id: string;
  patientId: string;
  tanggal: string; // ISO format YYYY-MM-DD
  usiaBulan: number; // e.g. 2.5 months
  bb: number; // kg
  tb: number; // cm
  bbuZ?: number;
  tbuZ?: number;
  bbtbZ?: number;
  imtuZ?: number;
  catatan?: string;
  createdAt: number;
}

export type FalteringSeverity = "high" | "medium" | "info";

export interface FalteringRuleAlert {
  ruleId: "RULE_1_PERCENTILE" | "RULE_2_ZSCORE" | "RULE_3_FLAT_WEIGHT";
  severity: FalteringSeverity;
  title: string;
  description: string;
  details?: string;
}

export interface GrowthFalteringResult {
  isFaltering: boolean;
  alerts: FalteringRuleAlert[];
  summaryText: string;
  recommendations: string[];
}

// ==========================================
// WHO DATASETS (0-60 BULAN)
// ==========================================

export const WHO_BBU_MALE_0_60: ZscoreTable = {
  0:  [2.1, 2.5, 3.0, 3.3, 3.9, 4.4, 5.0],
  1:  [2.9, 3.4, 3.9, 4.5, 5.1, 5.8, 6.6],
  2:  [3.8, 4.3, 5.0, 5.6, 6.3, 7.1, 8.0],
  3:  [4.4, 5.0, 5.7, 6.4, 7.2, 8.0, 9.0],
  4:  [4.8, 5.5, 6.2, 7.0, 7.8, 8.7, 9.7],
  5:  [5.3, 6.0, 6.7, 7.5, 8.4, 9.3, 10.4],
  6:  [5.7, 6.4, 7.1, 7.9, 8.8, 9.8, 10.9],
  7:  [5.9, 6.7, 7.4, 8.3, 9.2, 10.3, 11.4],
  8:  [6.2, 6.9, 7.7, 8.6, 9.6, 10.7, 11.9],
  9:  [6.4, 7.1, 8.0, 8.9, 9.9, 11.0, 12.3],
  10: [6.6, 7.4, 8.2, 9.2, 10.2, 11.4, 12.7],
  11: [6.8, 7.6, 8.4, 9.4, 10.5, 11.7, 13.0],
  12: [6.9, 7.7, 8.6, 9.6, 10.8, 12.0, 13.3],
  13: [7.1, 7.9, 8.8, 9.9, 11.0, 12.3, 13.7],
  14: [7.2, 8.1, 9.0, 10.1, 11.3, 12.6, 14.0],
  15: [7.4, 8.3, 9.2, 10.3, 11.5, 12.8, 14.3],
  16: [7.5, 8.4, 9.4, 10.5, 11.7, 13.1, 14.6],
  17: [7.7, 8.6, 9.6, 10.7, 12.0, 13.4, 14.9],
  18: [7.8, 8.8, 9.8, 10.9, 12.2, 13.7, 15.3],
  19: [8.0, 8.9, 10.0, 11.1, 12.5, 13.9, 15.6],
  20: [8.1, 9.1, 10.1, 11.3, 12.7, 14.2, 15.9],
  21: [8.2, 9.2, 10.3, 11.5, 12.9, 14.5, 16.2],
  22: [8.4, 9.4, 10.5, 11.8, 13.2, 14.7, 16.5],
  23: [8.5, 9.5, 10.7, 12.0, 13.4, 15.0, 16.8],
  24: [8.6, 9.7, 10.8, 12.2, 13.6, 15.3, 17.1],
  25: [8.8, 9.8, 11.0, 12.4, 13.9, 15.5, 17.5],
  26: [8.9, 10.0, 11.1, 12.5, 14.1, 15.8, 17.8],
  27: [9.0, 10.1, 11.3, 12.7, 14.3, 16.1, 18.1],
  28: [9.1, 10.2, 11.5, 12.9, 14.5, 16.3, 18.4],
  29: [9.2, 10.4, 11.7, 13.1, 14.8, 16.6, 18.7],
  30: [9.4, 10.5, 11.8, 13.3, 15.0, 16.9, 19.0],
  31: [9.5, 10.7, 12.0, 13.5, 15.2, 17.1, 19.3],
  32: [9.6, 10.8, 12.1, 13.7, 15.4, 17.4, 19.6],
  33: [9.7, 10.9, 12.3, 13.8, 15.6, 17.6, 19.9],
  34: [9.8, 11.0, 12.4, 14.0, 15.8, 17.8, 20.2],
  35: [9.9, 11.2, 12.6, 14.2, 16.0, 18.1, 20.4],
  36: [10.0, 11.3, 12.7, 14.3, 16.2, 18.3, 20.7],
  37: [10.1, 11.4, 12.9, 14.5, 16.4, 18.6, 21.0],
  38: [10.2, 11.5, 13.0, 14.7, 16.6, 18.8, 21.3],
  39: [10.3, 11.6, 13.1, 14.8, 16.8, 19.0, 21.6],
  40: [10.4, 11.8, 13.3, 15.0, 17.0, 19.3, 21.9],
  41: [10.5, 11.9, 13.4, 15.2, 17.2, 19.5, 22.1],
  42: [10.6, 12.0, 13.6, 15.3, 17.4, 19.7, 22.4],
  43: [10.7, 12.1, 13.7, 15.5, 17.6, 20.0, 22.7],
  44: [10.8, 12.2, 13.8, 15.7, 17.8, 20.2, 23.0],
  45: [10.9, 12.4, 14.0, 15.8, 18.0, 20.5, 23.3],
  46: [11.0, 12.5, 14.1, 16.0, 18.2, 20.7, 23.6],
  47: [11.1, 12.6, 14.3, 16.2, 18.4, 20.9, 23.9],
  48: [11.2, 12.7, 14.4, 16.3, 18.6, 21.2, 24.2],
  49: [11.3, 12.8, 14.5, 16.5, 18.8, 21.4, 24.5],
  50: [11.4, 12.9, 14.7, 16.7, 19.0, 21.7, 24.8],
  51: [11.5, 13.1, 14.8, 16.8, 19.2, 21.9, 25.1],
  52: [11.6, 13.2, 15.0, 17.0, 19.4, 22.2, 25.4],
  53: [11.7, 13.3, 15.1, 17.2, 19.6, 22.4, 25.7],
  54: [11.8, 13.4, 15.2, 17.3, 19.8, 22.7, 26.0],
  55: [11.9, 13.5, 15.4, 17.5, 20.0, 22.9, 26.3],
  56: [12.0, 13.6, 15.5, 17.7, 20.2, 23.2, 26.6],
  57: [12.1, 13.7, 15.6, 17.8, 20.4, 23.4, 26.9],
  58: [12.2, 13.8, 15.8, 18.0, 20.6, 23.7, 27.2],
  59: [12.3, 14.0, 15.9, 18.2, 20.8, 23.9, 27.6],
  60: [12.4, 14.1, 16.0, 18.3, 21.0, 24.2, 27.9],
};

export const WHO_BBU_FEMALE_0_60: ZscoreTable = {
  0:  [2.0, 2.4, 2.8, 3.2, 3.7, 4.2, 4.8],
  1:  [2.7, 3.2, 3.6, 4.2, 4.8, 5.5, 6.2],
  2:  [3.4, 3.9, 4.5, 5.1, 5.8, 6.6, 7.5],
  3:  [4.0, 4.5, 5.2, 5.8, 6.6, 7.5, 8.5],
  4:  [4.4, 5.0, 5.7, 6.4, 7.3, 8.2, 9.3],
  5:  [4.8, 5.4, 6.1, 6.9, 7.8, 8.8, 10.0],
  6:  [5.1, 5.7, 6.5, 7.3, 8.2, 9.3, 10.6],
  7:  [5.3, 6.0, 6.8, 7.6, 8.6, 9.8, 11.1],
  8:  [5.6, 6.3, 7.0, 7.9, 9.0, 10.2, 11.6],
  9:  [5.8, 6.5, 7.3, 8.2, 9.3, 10.5, 12.0],
  10: [5.9, 6.7, 7.5, 8.5, 9.6, 10.9, 12.4],
  11: [6.1, 6.9, 7.7, 8.7, 9.9, 11.2, 12.8],
  12: [6.3, 7.0, 7.9, 8.9, 10.1, 11.5, 13.1],
  13: [6.4, 7.2, 8.1, 9.2, 10.4, 11.8, 13.5],
  14: [6.6, 7.4, 8.3, 9.4, 10.6, 12.1, 13.8],
  15: [6.7, 7.6, 8.5, 9.6, 10.9, 12.4, 14.1],
  16: [6.9, 7.7, 8.7, 9.8, 11.1, 12.6, 14.5],
  17: [7.0, 7.9, 8.9, 10.0, 11.4, 12.9, 14.8],
  18: [7.2, 8.1, 9.1, 10.2, 11.6, 13.2, 15.1],
  19: [7.3, 8.2, 9.2, 10.4, 11.8, 13.5, 15.4],
  20: [7.5, 8.4, 9.4, 10.6, 12.1, 13.7, 15.7],
  21: [7.6, 8.6, 9.6, 10.9, 12.3, 14.0, 16.0],
  22: [7.8, 8.7, 9.8, 11.1, 12.5, 14.3, 16.4],
  23: [7.9, 8.9, 10.0, 11.3, 12.8, 14.6, 16.7],
  24: [8.1, 9.0, 10.2, 11.5, 13.0, 14.8, 17.0],
  25: [8.2, 9.2, 10.3, 11.7, 13.3, 15.1, 17.3],
  26: [8.4, 9.4, 10.5, 11.9, 13.5, 15.4, 17.7],
  27: [8.5, 9.5, 10.7, 12.1, 13.7, 15.7, 18.0],
  28: [8.6, 9.7, 10.9, 12.3, 14.0, 16.0, 18.3],
  29: [8.8, 9.8, 11.1, 12.5, 14.2, 16.2, 18.7],
  30: [8.9, 10.0, 11.2, 12.7, 14.4, 16.5, 19.0],
  31: [9.0, 10.1, 11.4, 12.9, 14.7, 16.8, 19.3],
  32: [9.1, 10.3, 11.6, 13.1, 14.9, 17.1, 19.6],
  33: [9.3, 10.4, 11.7, 13.3, 15.1, 17.3, 20.0],
  34: [9.4, 10.5, 11.9, 13.5, 15.4, 17.6, 20.3],
  35: [9.5, 10.7, 12.0, 13.7, 15.6, 17.9, 20.6],
  36: [9.6, 10.8, 12.2, 13.9, 15.8, 18.1, 20.9],
  37: [9.7, 10.9, 12.4, 14.0, 16.0, 18.4, 21.3],
  38: [9.8, 11.1, 12.5, 14.2, 16.3, 18.7, 21.6],
  39: [9.9, 11.2, 12.7, 14.4, 16.5, 19.0, 22.0],
  40: [10.1, 11.3, 12.8, 14.6, 16.7, 19.2, 22.3],
  41: [10.2, 11.5, 13.0, 14.8, 16.9, 19.5, 22.7],
  42: [10.3, 11.6, 13.1, 15.0, 17.2, 19.8, 23.0],
  43: [10.4, 11.7, 13.3, 15.2, 17.4, 20.1, 23.4],
  44: [10.5, 11.8, 13.4, 15.3, 17.6, 20.4, 23.7],
  45: [10.6, 12.0, 13.6, 15.5, 17.8, 20.7, 24.1],
  46: [10.7, 12.1, 13.7, 15.7, 18.1, 20.9, 24.5],
  47: [10.8, 12.2, 13.9, 15.9, 18.3, 21.2, 24.8],
  48: [10.9, 12.3, 14.0, 16.1, 18.5, 21.5, 25.2],
  49: [11.0, 12.4, 14.2, 16.3, 18.8, 21.8, 25.5],
  50: [11.1, 12.6, 14.3, 16.4, 19.0, 22.1, 25.9],
  51: [11.2, 12.7, 14.5, 16.6, 19.2, 22.4, 26.3],
  52: [11.3, 12.8, 14.6, 16.8, 19.4, 22.6, 26.6],
  53: [11.4, 12.9, 14.8, 17.0, 19.7, 22.9, 27.0],
  54: [11.5, 13.0, 14.9, 17.2, 19.9, 23.2, 27.4],
  55: [11.6, 13.2, 15.1, 17.3, 20.1, 23.5, 27.7],
  56: [11.7, 13.3, 15.2, 17.5, 20.3, 23.8, 28.1],
  57: [11.8, 13.4, 15.3, 17.7, 20.6, 24.1, 28.5],
  58: [11.9, 13.5, 15.5, 17.9, 20.8, 24.4, 28.8],
  59: [12.0, 13.6, 15.6, 18.0, 21.0, 24.6, 29.2],
  60: [12.1, 13.7, 15.8, 18.2, 21.2, 24.9, 29.5],
};

export const WHO_TBU_MALE_0_60: ZscoreTable = {
  0:  [44.2, 46.1, 48.0, 49.9, 51.8, 53.7, 55.6],
  1:  [48.9, 50.8, 52.8, 54.7, 56.7, 58.6, 60.6],
  2:  [52.4, 54.4, 56.4, 58.4, 60.4, 62.4, 64.4],
  3:  [55.3, 57.3, 59.4, 61.4, 63.5, 65.5, 67.6],
  4:  [57.6, 59.7, 61.8, 63.9, 66.0, 68.0, 70.1],
  5:  [59.6, 61.7, 63.8, 65.9, 68.0, 70.1, 72.2],
  6:  [61.2, 63.3, 65.5, 67.6, 69.8, 71.9, 74.0],
  7:  [62.7, 64.8, 67.0, 69.2, 71.3, 73.5, 75.7],
  8:  [64.0, 66.2, 68.4, 70.6, 72.8, 75.0, 77.2],
  9:  [65.2, 67.5, 69.7, 72.0, 74.2, 76.5, 78.7],
  10: [66.4, 68.7, 71.0, 73.3, 75.6, 77.9, 80.1],
  11: [67.6, 69.9, 72.2, 74.5, 76.9, 79.2, 81.5],
  12: [68.6, 71.0, 73.4, 75.7, 78.1, 80.5, 82.9],
  18: [74.2, 76.9, 79.6, 82.3, 85.0, 87.7, 90.4],
  24: [78.0, 81.0, 84.1, 87.1, 90.2, 93.2, 96.3],
  30: [81.7, 85.1, 88.5, 91.9, 95.3, 98.7, 102.1],
  36: [85.0, 88.7, 92.4, 96.1, 99.8, 103.5, 107.2],
  42: [88.2, 92.1, 95.9, 99.8, 103.6, 107.5, 111.4],
  48: [91.2, 95.2, 99.2, 103.3, 107.3, 111.3, 115.3],
  54: [94.0, 98.2, 102.4, 106.6, 110.8, 115.0, 119.2],
  60: [96.7, 101.0, 105.3, 109.6, 113.9, 118.2, 122.5],
};

export const WHO_TBU_FEMALE_0_60: ZscoreTable = {
  0:  [43.6, 45.4, 47.3, 49.1, 51.0, 52.9, 54.7],
  1:  [47.8, 49.8, 51.7, 53.7, 55.7, 57.6, 59.6],
  2:  [51.0, 53.0, 55.0, 57.1, 59.1, 61.1, 63.2],
  3:  [53.5, 55.6, 57.7, 59.8, 61.9, 64.0, 66.1],
  4:  [55.6, 57.8, 59.9, 62.1, 64.3, 66.4, 68.6],
  5:  [57.4, 59.6, 61.8, 64.0, 66.2, 68.5, 70.7],
  6:  [58.9, 61.2, 63.5, 65.7, 68.0, 70.3, 72.5],
  12: [66.3, 68.9, 71.4, 74.0, 76.6, 79.2, 81.7],
  18: [72.0, 74.9, 77.7, 80.5, 83.4, 86.2, 89.1],
  24: [76.0, 79.3, 82.5, 85.7, 88.9, 92.2, 95.4],
  30: [80.0, 83.6, 87.1, 90.7, 94.2, 97.8, 101.4],
  36: [83.6, 87.4, 91.2, 95.1, 98.9, 102.7, 106.6],
  42: [86.9, 90.9, 95.0, 99.0, 103.1, 107.1, 111.2],
  48: [89.9, 94.1, 98.4, 102.7, 107.0, 111.3, 115.5],
  54: [92.7, 97.1, 101.6, 106.1, 110.6, 115.1, 119.6],
  60: [95.2, 99.9, 104.5, 109.2, 113.9, 118.5, 123.2],
};

export const WHO_IMTU_MALE_0_60: ZscoreTable = {
  0:  [10.2, 11.1, 12.2, 13.4, 14.8, 16.3, 18.1],
  1:  [11.3, 12.4, 13.6, 14.9, 16.3, 17.8, 19.4],
  2:  [12.5, 13.7, 15.0, 16.3, 17.8, 19.4, 21.1],
  3:  [13.1, 14.3, 15.5, 16.9, 18.4, 20.0, 21.8],
  4:  [13.4, 14.5, 15.8, 17.2, 18.7, 20.3, 22.1],
  5:  [13.5, 14.7, 15.9, 17.3, 18.8, 20.5, 22.3],
  6:  [13.6, 14.7, 16.0, 17.3, 18.8, 20.5, 22.3],
  7:  [13.7, 14.8, 16.0, 17.3, 18.8, 20.5, 22.3],
  8:  [13.6, 14.7, 15.9, 17.3, 18.7, 20.4, 22.2],
  9:  [13.6, 14.7, 15.8, 17.2, 18.6, 20.3, 22.1],
  10: [13.5, 14.6, 15.7, 17.0, 18.5, 20.1, 22.0],
  11: [13.4, 14.5, 15.6, 16.9, 18.4, 20.0, 21.8],
  12: [13.4, 14.4, 15.5, 16.8, 18.2, 19.8, 21.6],
  13: [13.3, 14.3, 15.4, 16.7, 18.1, 19.7, 21.5],
  14: [13.2, 14.2, 15.3, 16.6, 18.0, 19.5, 21.3],
  15: [13.1, 14.1, 15.2, 16.4, 17.8, 19.4, 21.2],
  16: [13.1, 14.0, 15.1, 16.3, 17.7, 19.3, 21.0],
  17: [13.0, 13.9, 15.0, 16.2, 17.6, 19.1, 20.9],
  18: [12.9, 13.9, 14.9, 16.1, 17.5, 19.0, 20.8],
  19: [12.9, 13.8, 14.9, 16.1, 17.4, 18.9, 20.7],
  20: [12.8, 13.7, 14.8, 16.0, 17.3, 18.8, 20.6],
  21: [12.8, 13.7, 14.7, 15.9, 17.2, 18.7, 20.5],
  22: [12.7, 13.6, 14.7, 15.8, 17.2, 18.7, 20.4],
  23: [12.7, 13.6, 14.6, 15.8, 17.1, 18.6, 20.3],
  24: [12.9, 13.8, 14.8, 16.0, 17.3, 18.9, 20.6],
  25: [12.8, 13.8, 14.8, 16.0, 17.3, 18.8, 20.5],
  26: [12.8, 13.7, 14.8, 15.9, 17.3, 18.8, 20.5],
  27: [12.7, 13.7, 14.7, 15.9, 17.2, 18.7, 20.4],
  28: [12.7, 13.6, 14.7, 15.9, 17.2, 18.7, 20.4],
  29: [12.7, 13.6, 14.7, 15.8, 17.1, 18.6, 20.3],
  30: [12.6, 13.6, 14.6, 15.8, 17.1, 18.6, 20.2],
  31: [12.6, 13.5, 14.6, 15.8, 17.1, 18.5, 20.2],
  32: [12.5, 13.5, 14.6, 15.7, 17.0, 18.5, 20.1],
  33: [12.5, 13.5, 14.5, 15.7, 17.0, 18.5, 20.1],
  34: [12.5, 13.4, 14.5, 15.7, 17.0, 18.4, 20.0],
  35: [12.4, 13.4, 14.5, 15.6, 16.9, 18.4, 20.0],
  36: [12.4, 13.4, 14.4, 15.6, 16.9, 18.4, 20.0],
  37: [12.4, 13.3, 14.4, 15.6, 16.9, 18.3, 19.9],
  38: [12.3, 13.3, 14.4, 15.5, 16.8, 18.3, 19.9],
  39: [12.3, 13.3, 14.3, 15.5, 16.8, 18.3, 19.9],
  40: [12.3, 13.2, 14.3, 15.5, 16.8, 18.2, 19.9],
  41: [12.2, 13.2, 14.3, 15.5, 16.8, 18.2, 19.9],
  42: [12.2, 13.2, 14.3, 15.4, 16.8, 18.2, 19.8],
  43: [12.2, 13.2, 14.2, 15.4, 16.7, 18.2, 19.8],
  44: [12.2, 13.1, 14.2, 15.4, 16.7, 18.2, 19.8],
  45: [12.2, 13.1, 14.2, 15.4, 16.7, 18.2, 19.8],
  46: [12.1, 13.1, 14.2, 15.4, 16.7, 18.2, 19.8],
  47: [12.1, 13.1, 14.2, 15.3, 16.7, 18.2, 19.9],
  48: [12.1, 13.1, 14.1, 15.3, 16.7, 18.2, 19.9],
  49: [12.1, 13.0, 14.1, 15.3, 16.7, 18.2, 19.9],
  50: [12.1, 13.0, 14.1, 15.3, 16.7, 18.2, 19.9],
  51: [12.1, 13.0, 14.1, 15.3, 16.6, 18.2, 19.9],
  52: [12.0, 13.0, 14.1, 15.3, 16.6, 18.2, 19.9],
  53: [12.0, 13.0, 14.1, 15.3, 16.6, 18.2, 20.0],
  54: [12.0, 13.0, 14.0, 15.3, 16.6, 18.2, 20.0],
  55: [12.0, 13.0, 14.0, 15.2, 16.6, 18.2, 20.0],
  56: [12.0, 12.9, 14.0, 15.2, 16.6, 18.2, 20.1],
  57: [12.0, 12.9, 14.0, 15.2, 16.6, 18.2, 20.1],
  58: [12.0, 12.9, 14.0, 15.2, 16.6, 18.3, 20.2],
  59: [12.0, 12.9, 14.0, 15.2, 16.6, 18.3, 20.2],
  60: [12.0, 12.9, 14.0, 15.2, 16.6, 18.3, 20.3],
};

export const WHO_IMTU_FEMALE_0_60: ZscoreTable = {
  0:  [10.1, 11.1, 12.2, 13.3, 14.6, 16.1, 17.7],
  1:  [10.8, 12.0, 13.2, 14.6, 16.0, 17.5, 19.1],
  2:  [11.8, 13.0, 14.3, 15.8, 17.3, 19.0, 20.7],
  3:  [12.4, 13.6, 14.9, 16.4, 17.9, 19.7, 21.5],
  4:  [12.7, 13.9, 15.2, 16.7, 18.3, 20.0, 22.0],
  5:  [12.9, 14.1, 15.4, 16.8, 18.4, 20.2, 22.2],
  6:  [13.0, 14.1, 15.5, 16.9, 18.5, 20.3, 22.3],
  7:  [13.0, 14.2, 15.5, 16.9, 18.5, 20.3, 22.3],
  8:  [13.0, 14.1, 15.4, 16.8, 18.4, 20.2, 22.2],
  9:  [12.9, 14.1, 15.3, 16.7, 18.3, 20.1, 22.1],
  10: [12.9, 14.0, 15.2, 16.6, 18.2, 19.9, 21.9],
  11: [12.8, 13.9, 15.1, 16.5, 18.0, 19.8, 21.8],
  12: [12.7, 13.8, 15.0, 16.4, 17.9, 19.6, 21.6],
  13: [12.6, 13.7, 14.9, 16.2, 17.7, 19.5, 21.4],
  14: [12.6, 13.6, 14.8, 16.1, 17.6, 19.3, 21.3],
  15: [12.5, 13.5, 14.7, 16.0, 17.5, 19.2, 21.1],
  16: [12.4, 13.5, 14.6, 15.9, 17.4, 19.1, 21.0],
  17: [12.4, 13.4, 14.5, 15.8, 17.3, 18.9, 20.9],
  18: [12.3, 13.3, 14.4, 15.7, 17.2, 18.8, 20.8],
  19: [12.3, 13.3, 14.4, 15.7, 17.1, 18.8, 20.7],
  20: [12.2, 13.2, 14.3, 15.6, 17.0, 18.7, 20.6],
  21: [12.2, 13.2, 14.3, 15.5, 17.0, 18.6, 20.5],
  22: [12.2, 13.1, 14.2, 15.5, 16.9, 18.5, 20.4],
  23: [12.2, 13.1, 14.2, 15.4, 16.9, 18.5, 20.4],
  24: [12.4, 13.3, 14.4, 15.7, 17.1, 18.7, 20.6],
  25: [12.4, 13.3, 14.4, 15.7, 17.1, 18.7, 20.6],
  26: [12.3, 13.3, 14.4, 15.6, 17.0, 18.7, 20.6],
  27: [12.3, 13.3, 14.4, 15.6, 17.0, 18.6, 20.5],
  28: [12.3, 13.3, 14.3, 15.6, 17.0, 18.6, 20.5],
  29: [12.3, 13.2, 14.3, 15.6, 17.0, 18.6, 20.4],
  30: [12.3, 13.2, 14.3, 15.5, 16.9, 18.5, 20.4],
  31: [12.2, 13.2, 14.3, 15.5, 16.9, 18.5, 20.4],
  32: [12.2, 13.2, 14.3, 15.5, 16.9, 18.5, 20.4],
  33: [12.2, 13.1, 14.2, 15.5, 16.9, 18.5, 20.3],
  34: [12.2, 13.1, 14.2, 15.4, 16.8, 18.5, 20.3],
  35: [12.1, 13.1, 14.2, 15.4, 16.8, 18.4, 20.3],
  36: [12.1, 13.1, 14.2, 15.4, 16.8, 18.4, 20.3],
  37: [12.1, 13.1, 14.1, 15.4, 16.8, 18.4, 20.3],
  38: [12.1, 13.0, 14.1, 15.4, 16.8, 18.4, 20.3],
  39: [12.0, 13.0, 14.1, 15.3, 16.8, 18.4, 20.3],
  40: [12.0, 13.0, 14.1, 15.3, 16.8, 18.4, 20.3],
  41: [12.0, 13.0, 14.1, 15.3, 16.8, 18.4, 20.4],
  42: [12.0, 12.9, 14.0, 15.3, 16.8, 18.4, 20.4],
  43: [11.9, 12.9, 14.0, 15.3, 16.8, 18.4, 20.4],
  44: [11.9, 12.9, 14.0, 15.3, 16.8, 18.5, 20.4],
  45: [11.9, 12.9, 14.0, 15.3, 16.8, 18.5, 20.5],
  46: [11.9, 12.9, 14.0, 15.3, 16.8, 18.5, 20.5],
  47: [11.8, 12.8, 14.0, 15.3, 16.8, 18.5, 20.5],
  48: [11.8, 12.8, 14.0, 15.3, 16.8, 18.5, 20.6],
  49: [11.8, 12.8, 13.9, 15.3, 16.8, 18.5, 20.6],
  50: [11.8, 12.8, 13.9, 15.3, 16.8, 18.6, 20.7],
  51: [11.8, 12.8, 13.9, 15.3, 16.8, 18.6, 20.7],
  52: [11.7, 12.8, 13.9, 15.2, 16.8, 18.6, 20.7],
  53: [11.7, 12.7, 13.9, 15.3, 16.8, 18.6, 20.8],
  54: [11.7, 12.7, 13.9, 15.3, 16.8, 18.7, 20.8],
  55: [11.7, 12.7, 13.9, 15.3, 16.8, 18.7, 20.9],
  56: [11.7, 12.7, 13.9, 15.3, 16.8, 18.7, 20.9],
  57: [11.7, 12.7, 13.9, 15.3, 16.9, 18.7, 21.0],
  58: [11.7, 12.7, 13.9, 15.3, 16.9, 18.8, 21.0],
  59: [11.6, 12.7, 13.9, 15.3, 16.9, 18.8, 21.0],
  60: [11.6, 12.7, 13.9, 15.3, 16.9, 18.8, 21.1],
};

// ==========================================
// Z-SCORE CALCULATOR HELPERS
// ==========================================

export function hitungAllZscores(
  usiaBulan: number,
  bb: number,
  tb: number,
  jk: Gender = "male"
): { bbuZ: number; tbuZ: number; bbtbZ: number; imtuZ: number } {
  const tableBBU = jk === "female" ? WHO_BBU_FEMALE_0_60 : WHO_BBU_MALE_0_60;
  const tableTBU = jk === "female" ? WHO_TBU_FEMALE_0_60 : WHO_TBU_MALE_0_60;
  const tableIMTU = jk === "female" ? WHO_IMTU_FEMALE_0_60 : WHO_IMTU_MALE_0_60;

  const rowBBU = tkInterpolasiZscoreRow(tableBBU, usiaBulan);
  const rowTBU = tkInterpolasiZscoreRow(tableTBU, usiaBulan);
  const rowIMTU = tkInterpolasiZscoreRow(tableIMTU, usiaBulan);

  const bbuZ = rowBBU ? Math.round(tkHitungZscoreNumerik(rowBBU, bb) * 100) / 100 : 0;
  const tbuZ = rowTBU ? Math.round(tkHitungZscoreNumerik(rowTBU, tb) * 100) / 100 : 0;

  const imtVal = hitungIMT(bb, tb);
  const imtuZ = rowIMTU && imtVal !== null ? Math.round(tkHitungZscoreNumerik(rowIMTU, imtVal) * 100) / 100 : 0;

  // Nilai BB/TB estimasi rasio Z-score rasio BB terhadap median BB untuk TB tersebut
  const bbtbZ = Math.round((bbuZ - tbuZ * 0.5) * 100) / 100;

  return { bbuZ, tbuZ, bbtbZ, imtuZ };
}

/** Konversi Z-score ke pita persentil utama WHO */
export function zscoreToPercentileChannel(z: number): number {
  if (z >= 1.88) return 97;
  if (z >= 1.04) return 85;
  if (z >= -0.13) return 50;
  if (z >= -1.04) return 15;
  if (z >= -1.88) return 3;
  return 1; // <3rd
}

export function zscoreToPercentileLabel(z: number): string {
  const p = zscoreToPercentileChannel(z);
  if (p === 1) return "< Percentile 3rd";
  return `Percentile ~${p}th`;
}

// ==========================================
// LOGIKA AUTOMATED GROWTH FALTERING ALERT
// ==========================================

/**
 * Mendeteksi indikasi Growth Faltering (Gagal Tumbuh) berdasarkan 3 aturan klinis:
 * 1. Rule 1 (Persentil Drop): Penurunan ≥ 2 pita persentil utama antar 2-3 titik pemeriksaan berurutan.
 * 2. Rule 2 (Z-score Drop): Penurunan Z-score BB/U atau BB/TB > 1.0 SD dalam masa pemantauan.
 * 3. Rule 3 (Flat/Weight Faltering): BB mendatar (kenaikan <= 0.05 kg) selama 2 bulan berturut-turut (<6 bulan) atau 3 bulan berturut-turut (>=6 bulan).
 */
export function detectGrowthFaltering(
  records: GrowthRecord[],
  gender: Gender = "male"
): GrowthFalteringResult {
  if (!records || records.length < 2) {
    return {
      isFaltering: false,
      alerts: [],
      summaryText: `Membutuhkan minimal 2 data pemeriksaan untuk menganalisis tren pertumbuhan longitudinal (${gender === "female" ? "Perempuan" : "Laki-laki"}).`,
      recommendations: ["Lakukan penimbangan dan pengukuran berkala untuk mulai melacak tren pertumbuhan."],
    };
  }

  // Urutkan berdasarkan usia bulan / tanggal
  const sorted = [...records].sort((a, b) => a.usiaBulan - b.usiaBulan);
  const alerts: FalteringRuleAlert[] = [];

  const n = sorted.length;
  const latest = sorted[n - 1]!;

  // ----------------------------------------------------
  // RULE 1: PENURUNAN ≥ 2 PITA PERSENTIL UTAMA
  // Channels: >97 (5), 85-97 (4), 50-85 (3), 15-50 (2), 3-15 (1), <3 (0)
  // ----------------------------------------------------
  const getChannelIndex = (z: number): number => {
    if (z >= 1.88) return 5;
    if (z >= 1.04) return 4;
    if (z >= -0.13) return 3;
    if (z >= -1.04) return 2;
    if (z >= -1.88) return 1;
    return 0;
  };

  // Cek 2-3 titik berurutan
  let rule1Triggered = false;
  let rule1Details = "";

  for (let i = 0; i < n - 1; i++) {
    const prev = sorted[i]!;
    const curr = sorted[i + 1]!;
    const prevZ = prev.bbuZ ?? 0;
    const currZ = curr.bbuZ ?? 0;

    const chPrev = getChannelIndex(prevZ);
    const chCurr = getChannelIndex(currZ);
    const dropChannel = chPrev - chCurr;

    if (dropChannel >= 2) {
      rule1Triggered = true;
      rule1Details = `BB/U mengalami penurunan ${dropChannel} pita persentil utama dari Usia ${prev.usiaBulan} bln (${zscoreToPercentileLabel(prevZ)}) ke Usia ${curr.usiaBulan} bln (${zscoreToPercentileLabel(currZ)}).`;
      break;
    }
  }

  // Cek juga span 3 titik jika ada
  if (!rule1Triggered && n >= 3) {
    const p1 = sorted[n - 3]!;
    const p3 = sorted[n - 1]!;
    const p1Z = p1.bbuZ ?? 0;
    const p3Z = p3.bbuZ ?? 0;
    const dropChannel = getChannelIndex(p1Z) - getChannelIndex(p3Z);

    if (dropChannel >= 2) {
      rule1Triggered = true;
      rule1Details = `BB/U mengalami penurunan ${dropChannel} pita persentil utama secara beruntun dari Usia ${p1.usiaBulan} bln (${zscoreToPercentileLabel(p1Z)}) hingga Usia ${p3.usiaBulan} bln (${zscoreToPercentileLabel(p3Z)}).`;
    }
  }

  if (rule1Triggered) {
    alerts.push({
      ruleId: "RULE_1_PERCENTILE",
      severity: "high",
      title: "Penurunan Pita Persentil ≥ 2 Channel",
      description: "Kurva pertumbuhan memotong 2 atau lebih garis persentil utama (major percentile crossing).",
      details: rule1Details,
    });
  }

  // ----------------------------------------------------
  // RULE 2: PENURUNAN Z-SCORE > 1.0 SD
  // ----------------------------------------------------
  let maxZDrop = 0;
  let rule2Details = "";

  for (let i = 0; i < n - 1; i++) {
    const prevZ = sorted[i]!.bbuZ ?? 0;
    for (let j = i + 1; j < n; j++) {
      const currZ = sorted[j]!.bbuZ ?? 0;
      const drop = prevZ - currZ;
      if (drop > maxZDrop) {
        maxZDrop = drop;
        rule2Details = `Z-Score BB/U turun sebesar ${drop.toFixed(2)} SD (dari ${prevZ > 0 ? "+" : ""}${prevZ} SD pada usia ${sorted[i]!.usiaBulan} bln menjadi ${currZ > 0 ? "+" : ""}${currZ} SD pada usia ${sorted[j]!.usiaBulan} bln).`;
      }
    }
  }

  if (maxZDrop > 1.0) {
    alerts.push({
      ruleId: "RULE_2_ZSCORE",
      severity: "high",
      title: "Penurunan Z-Score > 1.0 SD",
      description: "Terjadi defleksi kurva pertumbuhan yang signifikan (> 1 Standard Deviation).",
      details: rule2Details,
    });
  }

  // ----------------------------------------------------
  // RULE 3: WEIGHT FALTERING / BB FLAT
  // < 6 bulan: 2 bulan berturut-turut kenaikan BB <= 0.05 kg
  // >= 6 bulan: 3 bulan berturut-turut kenaikan BB <= 0.05 kg
  // ----------------------------------------------------
  let rule3Triggered = false;
  let rule3Details = "";

  const isInfantUnder6 = latest.usiaBulan < 6;
  const requiredFlatPoints = isInfantUnder6 ? 2 : 3;

  if (n >= requiredFlatPoints) {
    const recentSlice = sorted.slice(n - requiredFlatPoints);
    let allFlat = true;
    for (let i = 0; i < recentSlice.length - 1; i++) {
      const weightDiff = recentSlice[i + 1]!.bb - recentSlice[i]!.bb;
      if (weightDiff > 0.05) {
        allFlat = false;
        break;
      }
    }

    if (allFlat) {
      const firstPt = recentSlice[0]!;
      const lastPt = recentSlice[recentSlice.length - 1]!;
      const monthsSpan = (lastPt.usiaBulan - firstPt.usiaBulan).toFixed(1);
      rule3Triggered = true;
      rule3Details = `Berat badan cenderung mendatar / tidak naik (${firstPt.bb} kg → ${lastPt.bb} kg) selama ${monthsSpan} bulan berturut-turut (Usia ${firstPt.usiaBulan} bln s/d ${lastPt.usiaBulan} bln).`;
    }
  }

  if (rule3Triggered) {
    alerts.push({
      ruleId: "RULE_3_FLAT_WEIGHT",
      severity: isInfantUnder6 ? "high" : "medium",
      title: `Kurva Berat Badan Mendatar (${isInfantUnder6 ? "≥ 2 bulan" : "≥ 3 bulan"})`,
      description: "Anak tidak mengalami kenaikan berat badan adekuat sesuai usia pertumbuhannya.",
      details: rule3Details,
    });
  }

  const isFaltering = alerts.length > 0;

  // Menyusun narasi ringkasan klinis
  let summaryText = "";
  if (isFaltering) {
    const detailList = alerts.map((a) => a.details).join(" ");
    summaryText = `⚠️ INDIKASI GROWTH FALTERING DETECTED: Pada pemantauan usia ${latest.usiaBulan} bln (BB ${latest.bb} kg, TB ${latest.tb} cm, Z BB/U ${latest.bbuZ} SD). ${detailList} Diperlukan evaluasi asupan nutrisi, pola makan, infeksi penyerta, serta re-evaluasi klinis berkala.`;
  } else {
    summaryText = `✅ TREN PERTUMBUHAN NORMAL: Tren kenaikan BB dan TB berada pada jalur kurva normal WHO (Z-score BB/U ${latest.bbuZ} SD, Usia ${latest.usiaBulan} bln). Tidak terdeteksi indikasi gagal tumbuh.`;
  }

  const recommendations = isFaltering
    ? [
        "Lakukan anamnesis asupan nutrisi (24-hour food recall / evaluasi ASI-MPASI).",
        "Evaluasi kemungkinan penyakit penyerta (Infeksi Saluran Kemih, TB paru, diare kronis, alergi susu sapi).",
        "Pertimbangkan pemberian makanan padat gizi / suplemen nutrisi enteral terarah.",
        "Jadwalkan penimbangan ulang 2 minggu hingga 1 bulan ke depan.",
        "Rujuk ke Spesialis Anak (Sp.A) jika tren tidak membaik dalam 2-4 minggu.",
      ]
    : [
        "Lanjutkan pemantauan rutin penimbangan dan pengukuran TB tiap bulan.",
        "Pertahankan asupan nutrisi seimbang sesuai usia anak.",
      ];

  return {
    isFaltering,
    alerts,
    summaryText,
    recommendations,
  };
}

// ==========================================
// LOCAL STORAGE PERSISTENCE HELPERS
// ==========================================

export function getGrowthRecordsKey(patientId: string): string {
  return `tv_growth_history_${patientId || "default"}`;
}

export function loadGrowthRecords(patientId: string): GrowthRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(getGrowthRecordsKey(patientId));
    if (!raw) {
      // Jika belum ada data, berikan contoh data awal untuk simulasi awal jika diperlukan
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveGrowthRecords(patientId: string, records: GrowthRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(getGrowthRecordsKey(patientId), JSON.stringify(records));
    window.dispatchEvent(new CustomEvent("tv-growth-records-change", { detail: { patientId } }));
  } catch {
    /* abaikan */
  }
}

/** Menyediakan preset sampel riwayat pertumbuhan untuk pengujian / demonstrasi cepat */
export function getSampleGrowthRecords(patientId: string, isFalteringSample = false): GrowthRecord[] {
  const now = new Date();
  const formatIso = (daysAgo: number) => {
    const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return d.toISOString().split("T")[0]!;
  };

  if (isFalteringSample) {
    // Sampel anak yang mengalami Growth Faltering (turun persentil & Z-score drop)
    return [
      {
        id: "sample_1",
        patientId,
        tanggal: formatIso(90),
        usiaBulan: 2,
        bb: 5.6,
        tb: 58.4,
        bbuZ: 0.0,
        tbuZ: 0.0,
        bbtbZ: 0.0,
        catatan: "Pemeriksaan Usia 2 Bulan - Normal",
        createdAt: Date.now() - 90 * 86400000,
      },
      {
        id: "sample_2",
        patientId,
        tanggal: formatIso(60),
        usiaBulan: 3,
        bb: 6.0,
        tb: 61.4,
        bbuZ: -0.63,
        tbuZ: 0.0,
        bbtbZ: -0.63,
        catatan: "Batuk pilek 1 minggu",
        createdAt: Date.now() - 60 * 86400000,
      },
      {
        id: "sample_3",
        patientId,
        tanggal: formatIso(30),
        usiaBulan: 4,
        bb: 6.0,
        tb: 63.5,
        bbuZ: -1.43,
        tbuZ: -0.2,
        bbtbZ: -1.33,
        catatan: "ASI kurang, BB mendatar",
        createdAt: Date.now() - 30 * 86400000,
      },
      {
        id: "sample_4",
        patientId,
        tanggal: formatIso(0),
        usiaBulan: 5,
        bb: 6.05,
        tb: 65.2,
        bbuZ: -2.1,
        tbuZ: -0.3,
        bbtbZ: -1.95,
        catatan: "Evaluasi ulang — Indikasi Gagal Tumbuh",
        createdAt: Date.now(),
      },
    ];
  }

  // Sampel pertumbuhan normal
  return [
    {
      id: "sample_n1",
      patientId,
      tanggal: formatIso(90),
      usiaBulan: 1,
      bb: 4.5,
      tb: 54.7,
      bbuZ: 0.0,
      tbuZ: 0.0,
      bbtbZ: 0.0,
      catatan: "Kontrol Usia 1 Bulan",
      createdAt: Date.now() - 90 * 86400000,
    },
    {
      id: "sample_n2",
      patientId,
      tanggal: formatIso(60),
      usiaBulan: 2,
      bb: 5.6,
      tb: 58.4,
      bbuZ: 0.0,
      tbuZ: 0.0,
      bbtbZ: 0.0,
      catatan: "Kontrol Usia 2 Bulan",
      createdAt: Date.now() - 60 * 86400000,
    },
    {
      id: "sample_n3",
      patientId,
      tanggal: formatIso(30),
      usiaBulan: 3,
      bb: 6.4,
      tb: 61.4,
      bbuZ: 0.0,
      tbuZ: 0.0,
      bbtbZ: 0.0,
      catatan: "Imunisasi DPT 1",
      createdAt: Date.now() - 30 * 86400000,
    },
    {
      id: "sample_n4",
      patientId,
      tanggal: formatIso(0),
      usiaBulan: 4,
      bb: 7.0,
      tb: 63.9,
      bbuZ: 0.0,
      tbuZ: 0.0,
      bbtbZ: 0.0,
      catatan: "Pemeriksaan rutin Usia 4 Bulan",
      createdAt: Date.now(),
    },
  ];
}
