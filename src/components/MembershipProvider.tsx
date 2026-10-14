"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PlanId } from "@/lib/membership";

// Demo only: membership lives in this browser. In production it comes from the
// signed-in account and a Stripe subscription.
type MembershipState = {
  plan: PlanId | null;
  member: boolean;
  join: (plan: PlanId) => void;
  leave: () => void;
};

const MembershipContext = createContext<MembershipState | null>(null);
const KEY = "declareandcarry-member-v1";

export function MembershipProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlan] = useState<PlanId | null>(null);

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (v === "monthly" || v === "yearly" || v === "founding") setPlan(v);
    } catch {}
  }, []);

  const value = useMemo<MembershipState>(() => {
    const save = (v: PlanId | null) => {
      setPlan(v);
      try {
        if (v) localStorage.setItem(KEY, v);
        else localStorage.removeItem(KEY);
      } catch {}
    };
    return { plan, member: plan !== null, join: save, leave: () => save(null) };
  }, [plan]);

  return <MembershipContext.Provider value={value}>{children}</MembershipContext.Provider>;
}

export function useMembership() {
  const ctx = useContext(MembershipContext);
  if (!ctx) throw new Error("useMembership must be used inside MembershipProvider");
  return ctx;
}
