import React from "react";
import { LoadingAnimation } from "@/shared/ui";

export default function GlobalLoading() {
  return (
    <LoadingAnimation
      fullScreen
      message="Memuat modul klinis Tinyverse..."
    />
  );
}
