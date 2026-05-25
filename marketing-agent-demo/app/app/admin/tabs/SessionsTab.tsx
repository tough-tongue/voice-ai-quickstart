"use client";

import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { OUR_SCENARIOS } from "../constants";

export function SessionsTab() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `/api/ttai/sessions?scenario_id=${OUR_SCENARIOS[0].id}&limit=25`,
      );
      const data = (await res.json()) as {
        sessions?: Record<string, unknown>[];
      };
      setRows(data.sessions ?? []);
      setLoading(false);
    })();
  }, []);

  if (loading)
    return <p className="text-[#59615D] font-body text-sm mt-8">Loading…</p>;

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full text-sm font-body border-collapse">
        <thead>
          <tr className="border-b border-[#E5E0D5] text-left text-[#59615D]">
            <th className="py-3 pr-6 font-medium">Session</th>
            <th className="py-3 pr-6 font-medium">Status</th>
            <th className="py-3 pr-6 font-medium">Duration</th>
            <th className="py-3 font-medium">Analytics</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-[#E5E0D5]/50">
              <td className="py-3 pr-6 font-mono text-xs">
                {String(r.id ?? "").slice(0, 12)}
              </td>
              <td className="py-3 pr-6">{String(r.status ?? "")}</td>
              <td className="py-3 pr-6">
                {r.duration_seconds
                  ? `${Math.round(Number(r.duration_seconds))}s`
                  : "—"}
              </td>
              <td className="py-3">
                {r.analytics_url ? (
                  <a
                    href={String(r.analytics_url)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[#1A362D] hover:underline"
                  >
                    View <ExternalLink size={12} />
                  </a>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <p className="text-[#59615D] text-sm mt-6">No sessions yet.</p>
      )}
    </div>
  );
}
