"use client";

import { useEffect } from "react";

/** Registra el service worker (solo en producción) para que el portal se pueda instalar. */
export function SwRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}
