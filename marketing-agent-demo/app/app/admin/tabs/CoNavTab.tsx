"use client";

import { useState, useCallback } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { SECTIONS, TOP_ROUTES, DECKS } from "../constants";

interface NavEntry {
  ts: number;
  cmd: string;
  ok: boolean;
}

type NavCommand = { url?: string; section?: string };

// co-nav-tab -------------------------------------------------------------------

export function CoNavTab() {
  const [sessionId, setSessionId] = useState("");
  const [custom, setCustom] = useState("");
  const [log, setLog] = useState<NavEntry[]>([]);

  const push = useCallback(
    async (cmd: NavCommand) => {
      if (!sessionId.trim()) return;
      const ok = await fetch(
        `/api/navigate-commands/${sessionId.trim().toUpperCase()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cmd),
        },
      ).then((r) => r.ok);
      setLog((prev) =>
        [{ ts: Date.now(), cmd: JSON.stringify(cmd), ok }, ...prev].slice(0, 10),
      );
    },
    [sessionId],
  );

  const sendCustom = () => {
    try {
      push(JSON.parse(custom));
      setCustom("");
    } catch {}
  };

  return (
    <div className="mt-6 space-y-8">
      <SessionInput value={sessionId} onChange={setSessionId} />
      <NavButtons label="Navigate to page" items={TOP_ROUTES.map((r) => ({ label: r.label, cmd: { url: r.url } }))} push={push} />
      <NavButtons label="Scroll to section" items={SECTIONS.map((s) => ({ label: s.label, cmd: { section: s.section } }))} push={push} />
      <DeckNavButtons push={push} />
      <CustomCommandInput value={custom} onChange={setCustom} onSend={sendCustom} />
      <CommandLog entries={log} />
    </div>
  );
}

// sub-components ---------------------------------------------------------------

function SessionInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="overline block mb-2">Session code</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        placeholder="e.g. ABCD"
        maxLength={4}
        className="border border-[#E5E0D5] px-4 py-3 font-mono text-sm bg-white focus:outline-none focus:border-[#1A362D] w-32"
      />
    </div>
  );
}

function NavButtons({
  label,
  items,
  push,
}: {
  label: string;
  items: { label: string; cmd: NavCommand }[];
  push: (cmd: NavCommand) => void;
}) {
  return (
    <div>
      <span className="overline block mb-4">{label}</span>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => push(item.cmd)}
            className="btn-hairline text-xs py-2 px-4"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function DeckNavButtons({ push }: { push: (cmd: NavCommand) => void }) {
  return (
    <div>
      <span className="overline block mb-4">Navigate to slide</span>
      {DECKS.map((deck) => (
        <div key={deck.id} className="mb-4">
          <p className="font-body text-xs text-[#59615D] mb-2">{deck.label}</p>
          <div className="flex flex-wrap gap-2">
            {deck.slides.map((s) => (
              <button
                key={s.n}
                onClick={() => push({ url: `/slides/${deck.id}/${s.n}` })}
                className="btn-hairline text-xs py-1.5 px-3"
              >
                {s.n}. {s.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function CustomCommandInput({
  value,
  onChange,
  onSend,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
}) {
  return (
    <div>
      <span className="overline block mb-4">Custom command</span>
      <div className="flex gap-3">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder='{"url":"/slides","section":"#intro"}'
          className="flex-1 border border-[#E5E0D5] px-4 py-3 font-mono text-xs bg-white focus:outline-none focus:border-[#1A362D]"
          onKeyDown={(e) => e.key === "Enter" && onSend()}
        />
        <button onClick={onSend} className="btn-hairline">
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}

function CommandLog({ entries }: { entries: NavEntry[] }) {
  if (entries.length === 0) return null;
  return (
    <div>
      <span className="overline block mb-3">Command log</span>
      <div className="space-y-1.5">
        {entries.map((entry) => (
          <div
            key={entry.ts}
            className="flex items-center gap-3 font-mono text-xs text-[#59615D]"
          >
            {entry.ok ? (
              <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle size={12} className="text-red-500 shrink-0" />
            )}
            <span className="text-[#2C302E]">{entry.cmd}</span>
            <span className="text-[#59615D]/60">
              {new Date(entry.ts).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
