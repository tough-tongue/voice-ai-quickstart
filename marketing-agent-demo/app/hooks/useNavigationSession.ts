"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// ------------------------------------------------------------------------------
// Types
// ------------------------------------------------------------------------------
interface NavigateCommand {
  url?: string;
  section?: string;
  timeout?: boolean;
}

type WidgetMode = "nav-agent" | "google-meet-agent";

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const WIDGET_MODE_KEY = "widget-mode";

function randomSessionId(): string {
  return Array.from(
    { length: 4 },
    () => CHARS[Math.floor(Math.random() * CHARS.length)],
  ).join("");
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ------------------------------------------------------------------------------
// useNavigationSession
// ------------------------------------------------------------------------------
/**
 * Manages the ToughTongue AI co-navigation session.
 *
 * - Generates a 4-char session ID and writes it to the URL (?session=XXXX).
 * - Runs a long-poll loop against /api/navigate-commands/[id]/poll.
 * - On each command: navigates the router (url) or scrolls to an anchor (section).
 * - Persists widgetMode in localStorage so it survives page reloads.
 */
export function useNavigationSession() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [widgetMode, setWidgetModeState] = useState<WidgetMode>(() => {
    if (typeof window === "undefined") return "nav-agent";
    return (localStorage.getItem(WIDGET_MODE_KEY) as WidgetMode) ?? "nav-agent";
  });

  const routerRef = useRef(router);
  const activeRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => { routerRef.current = router; }, [router]);

  // poll-loop -------------------------------------------------------------------
  const runPoll = useCallback(async (id: string) => {
    while (activeRef.current === id) {
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      try {
        const res = await fetch(`/api/navigate-commands/${id}/poll`, {
          signal: ctrl.signal,
        });
        if (!res.ok) { await sleep(3000); continue; }

        const cmd = (await res.json()) as NavigateCommand;
        if (cmd.timeout) continue;

        if (cmd.url) {
          const target = new URL(cmd.url, window.location.origin);
          target.searchParams.set("session", id);
          routerRef.current.push(target.pathname + target.search);
        }
        if (cmd.section) {
          document.querySelector(cmd.section)?.scrollIntoView({ behavior: "smooth" });
        }
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") break;
        await sleep(3000);
      }
    }
  }, []);

  // connect / disconnect -------------------------------------------------------
  const connect = useCallback(
    (existingId?: string) => {
      const id = existingId ?? randomSessionId();
      activeRef.current = id;

      const url = new URL(window.location.href);
      url.searchParams.set("session", id);
      window.history.replaceState({}, "", url.toString());

      setSessionId(id);
      runPoll(id);
    },
    [runPoll],
  );

  const disconnect = useCallback(() => {
    activeRef.current = null;
    abortRef.current?.abort();

    const url = new URL(window.location.href);
    url.searchParams.delete("session");
    window.history.replaceState({}, "", url.toString());

    setSessionId(null);
  }, []);

  // auto-reconnect from URL on mount -------------------------------------------
  const connectRef = useRef(connect);
  useEffect(() => { connectRef.current = connect; }, [connect]);

  useEffect(() => {
    const existing = new URLSearchParams(window.location.search).get("session");
    if (existing) connectRef.current(existing);
    return () => {
      activeRef.current = null;
      abortRef.current?.abort();
    };
  }, []);

  // widgetMode -----------------------------------------------------------------
  const setWidgetMode = useCallback((mode: WidgetMode) => {
    setWidgetModeState(mode);
    localStorage.setItem(WIDGET_MODE_KEY, mode);
  }, []);

  return { sessionId, connect, disconnect, widgetMode, setWidgetMode };
}
