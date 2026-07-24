"use client";

import { type CSSProperties } from "react";
import { GrowthTool } from "@/features/growth-chart";

const wrap: CSSProperties = { maxWidth: 1080, margin: "0 auto", width: "100%" };

export function GrowthPanel() {
  return (
    <div style={wrap}>
      <GrowthTool />
    </div>
  );
}
