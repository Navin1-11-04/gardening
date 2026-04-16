"use client";

import { useState, useEffect } from "react";

export interface StoreConfig {
  freeDeliveryThreshold: number;
  deliveryFee: number;
  whatsappNumber: string;
  maxDeliveryDays: number;
  allowCOD: boolean;
  allowUPI: boolean;
  allowCard: boolean;
  maintenanceMode: boolean;
}

const DEFAULTS: StoreConfig = {
  freeDeliveryThreshold: 999,
  deliveryFee: 79,
  whatsappNumber: "919876543210",
  maxDeliveryDays: 4,
  allowCOD: true,
  allowUPI: true,
  allowCard: true,
  maintenanceMode: false,
};

// Module-level cache so multiple components don't each fetch
let cached: StoreConfig | null = null;
let fetchPromise: Promise<StoreConfig> | null = null;

async function fetchConfig(): Promise<StoreConfig> {
  if (cached) return cached;
  if (!fetchPromise) {
    fetchPromise = fetch("/api/store-config")
      .then((r) => r.ok ? r.json() : DEFAULTS)
      .then((data) => { cached = { ...DEFAULTS, ...data }; return cached!; })
      .catch(() => DEFAULTS);
  }
  return fetchPromise;
}

export function useStoreConfig() {
  const [config, setConfig] = useState<StoreConfig>(cached ?? DEFAULTS);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    if (cached) { setConfig(cached); setLoading(false); return; }
    fetchConfig().then((c) => { setConfig(c); setLoading(false); });
  }, []);

  return { config, loading };
}