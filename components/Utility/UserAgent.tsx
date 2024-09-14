"use client";

import { useUserAgent } from "@/hooks/useUserAgent";

export const UserAgent = (): null => {
  useUserAgent();
  return null;
};
