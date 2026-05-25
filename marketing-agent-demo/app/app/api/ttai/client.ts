/**
 * Server-side ToughTongue AI API client.
 * All calls use the TOUGHTONGUE_API_TOKEN env var — never exposed to the browser.
 */

import { AppConfig } from "@/lib/config";
import { NextResponse } from "next/server";

function authHeaders(): Record<string, string> {
  if (!AppConfig.toughTongue.apiToken) {
    throw new Error("TOUGHTONGUE_API_TOKEN is not configured on this server.");
  }
  return { Authorization: `Bearer ${AppConfig.toughTongue.apiToken}` };
}

export async function ttaiGet(
  path: string,
  params?: Record<string, string>,
): Promise<unknown> {
  const url = new URL(`${AppConfig.toughTongue.apiBase}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString(), { headers: authHeaders() });
  if (!res.ok) throw new Error(`TTAI ${path} → ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function ttaiPost(
  path: string,
  body: unknown,
): Promise<unknown> {
  const res = await fetch(`${AppConfig.toughTongue.apiBase}${path}`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`TTAI ${path} → ${res.status}: ${await res.text()}`);
  return res.json();
}

export function ttaiError(err: unknown): NextResponse {
  const message = err instanceof Error ? err.message : "Unknown error";
  const status = message.includes("not configured") ? 503 : 502;
  return NextResponse.json({ error: message }, { status });
}
