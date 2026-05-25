"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Mic, ChevronDown } from "lucide-react";
import { getNavAgentEmbedUrl } from "@/lib/ttai";
import { useSession } from "@/context/SessionContext";

/**
 * NavAgentWidget
 *
 * Floating bottom-right panel that embeds the ToughTongue AI nav-agent iframe.
 *
 * How co-navigation works:
 *   1. On open → auto-connects a 4-char session (or reuses existing)
 *   2. Fetches /website-nav.md (the agent's navigation guide for this site)
 *   3. Injects both as TTAI dynamic variables:
 *        t_session_code → the 4-char ID used by our long-poll API
 *        t_website_map  → full content of /website-nav.md
 *   4. The agent scenario's ai_instructions use {{ session_code }} and
 *      {{ website_map }} — TTAI substitutes them at session start.
 *   5. Agent calls POST /api/agent-navigate with session_code + url/section
 *      → the long-poll wakes → this visitor's browser navigates in real time.
 *
 * The iframe is kept mounted (display:none when closed) so the voice session
 * survives panel close and Next.js route transitions.
 */
export function NavAgentWidget() {
  const { sessionId, connect } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [websiteMap, setWebsiteMap] = useState("");

  // Fetch the navigation guide once so it's ready before the user opens
  useEffect(() => {
    fetch("/website-nav.md")
      .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
      .then(setWebsiteMap)
      .catch((err) =>
        console.error("NavAgentWidget: could not load website-nav.md", err),
      );
  }, []);

  const open = useCallback(() => {
    if (!sessionId) connect();
    setIsOpen(true);
    setHasOpened(true);
  }, [sessionId, connect]);

  const close = useCallback(() => setIsOpen(false), []);

  const embedUrl = useMemo(() => {
    const params: Record<string, string> = {};
    if (websiteMap) params.t_website_map = websiteMap;
    if (sessionId) params.t_session_code = sessionId;
    return getNavAgentEmbedUrl(params);
  }, [websiteMap, sessionId]);

  const ready = Boolean(sessionId);

  return (
    <>
      {/* Trigger button */}
      <button
        data-testid="toughtongue-trigger-btn"
        onClick={open}
        aria-label="Talk to Agent"
        className={[
          "fixed bottom-5 right-5 z-[9990]",
          "flex items-center gap-2.5",
          "bg-[#1A362D] text-[#FAF9F6] pl-4 pr-5 h-12 rounded-full",
          "border border-[#C5A059]/30",
          "shadow-[0_4px_24px_rgba(26,54,45,0.35)]",
          "transition-[opacity,transform,box-shadow] duration-300",
          "hover:bg-[#142a22] hover:shadow-[0_6px_32px_rgba(26,54,45,0.5)] hover:scale-[1.03]",
          "active:scale-[0.98]",
          isOpen
            ? "opacity-0 pointer-events-none scale-90"
            : "opacity-100 scale-100",
        ].join(" ")}
      >
        <span className="relative flex h-5 w-5 items-center justify-center">
          <span className="absolute animate-ping h-full w-full rounded-full bg-[#C5A059] opacity-30" />
          <Mic size={16} className="relative text-[#C5A059]" />
        </span>
        <span className="font-body text-[11px] uppercase tracking-[0.22em] font-medium whitespace-nowrap">
          Talk to Agent
        </span>
      </button>

      {/* Panel — no backdrop so visitor can interact with the page while open */}
      <div
        data-testid="toughtongue-panel"
        className={[
          "fixed bottom-5 right-5 z-[9992]",
          "w-[360px] sm:w-[400px] rounded-2xl overflow-hidden flex flex-col",
          "border border-[#C5A059]/20",
          "shadow-[0_16px_64px_rgba(26,54,45,0.45)]",
          "transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          "origin-bottom-right",
          isOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-6 scale-95 pointer-events-none",
        ].join(" ")}
        style={{ height: "min(720px, calc(100vh - 40px))" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#1A362D] shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30">
              <Mic size={14} className="text-[#C5A059]" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-emerald-400 border border-[#1A362D]" />
            </div>
            <div>
              <p className="font-serif-display text-[#FAF9F6] text-sm leading-tight">
                The Camellias
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="font-body text-[#C5A059] text-[10px] uppercase tracking-[0.2em] leading-tight">
                  AI Concierge
                </p>
                {sessionId && (
                  <span
                    data-testid="widget-session-badge"
                    className="font-mono text-[9px] text-white/35 tracking-widest"
                    title="Your session code — used by the agent to navigate this browser"
                  >
                    [{sessionId}]
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            data-testid="toughtongue-close-btn"
            onClick={close}
            aria-label="Close agent"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#FAF9F6]/60 hover:text-[#FAF9F6] hover:bg-white/10 transition-colors"
          >
            <ChevronDown size={18} />
          </button>
        </div>

        <div className="shrink-0 h-px bg-[#C5A059]/15" />

        {/* Iframe fills all remaining panel height */}
        <div className="relative flex-1 min-h-0 bg-white">
          {(!loaded || !ready) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#FAF9F6]">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-[#1A362D] animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <p className="font-body text-[11px] text-[#59615D] uppercase tracking-[0.15em]">
                {ready ? "Connecting…" : "Preparing session…"}
              </p>
            </div>
          )}

          {/* Keep iframe mounted after first open — preserves voice session */}
          {hasOpened && ready && (
            <iframe
              data-testid="toughtongue-iframe"
              src={embedUrl}
              width="100%"
              height="100%"
              allow="microphone; camera"
              title="The Camellias — AI Concierge"
              onLoad={() => setLoaded(true)}
              style={{ display: "block", border: "none" }}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default NavAgentWidget;
