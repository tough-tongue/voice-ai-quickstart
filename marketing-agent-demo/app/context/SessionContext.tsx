"use client";

import { createContext, useContext } from "react";
import { useNavigationSession } from "@/hooks/useNavigationSession";

type SessionContextValue = ReturnType<typeof useNavigationSession>;

const SessionCtx = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const session = useNavigationSession();
  return <SessionCtx.Provider value={session}>{children}</SessionCtx.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionCtx);
  if (!ctx) throw new Error("useSession must be used inside <SessionProvider>");
  return ctx;
}
