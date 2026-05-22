/**
 * ToughTongue AI - Server-Side API Client
 *
 * Internal module for API routes to call ToughTongue AI.
 * This code runs only on the server — never import in client components.
 */

import { AppConfig } from "@/lib/config";

// =============================================================================
// Constants
// =============================================================================

const API_BASE_URL = "https://api.toughtongueai.com/api/public";

// =============================================================================
// Error Class
// =============================================================================

export class ToughTongueError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = "ToughTongueError";
  }

  toApiError(): ApiError {
    return { error: this.message, details: this.details, status: this.status || 500 };
  }
}

// =============================================================================
// Shared Types
// =============================================================================

export interface ApiError {
  error: string;
  details?: unknown;
  status: number;
}

export type SessionStatus = "in_progress" | "completed" | "terminated";

export interface SessionListItem {
  id: string;
  scenario_id: string;
  scenario_name?: string;
  user_name?: string;
  user_email?: string;
  /** Duration in minutes */
  duration_minutes?: number;
  status: SessionStatus;
  created_at: string;
  completed_at?: string;
}

export interface ReportCardItem {
  topic: string;
  score: number;
  score_str: string;
  note: string;
  weight: number;
}

/** Full session detail — returned by GET /sessions/{id} */
export interface SessionDetail extends SessionListItem {
  transcript_url?: string;
  evaluation_results?: {
    overall_score: string;
    final_score: number;
    strengths: string;
    weaknesses: string;
    detailed_feedback: string;
    report_card: ReportCardItem[];
  };
  /** Variables extracted per scenario config's extraction_vars */
  extraction_results?: Record<string, unknown>;
  improvement_results?: {
    improvement_areas: string;
    action_items: string;
    resources: string;
  };
}

/**
 * Enriched session from GET /v2/sessions.
 * Includes scores + extraction without a separate detail fetch.
 */
export interface SessionV2 extends SessionListItem {
  evaluation_score?: number;
  evaluation_note?: string;
  report_card?: ReportCardItem[];
  report_card_topics?: string[];
  extraction_results?: Record<string, unknown>;
  analytics_url?: string;
}

export interface ListSessionsRequest {
  scenario_id?: string;
  user_email?: string;
  from_date?: string;
  to_date?: string;
  limit?: number;
  page?: number;
}

export interface ListSessionsResponse {
  sessions: SessionListItem[];
}

export interface ListSessionsV2Response {
  sessions: SessionV2[];
  page_meta?: { total: number; page: number; limit: number };
}

/** Legacy analysis response from POST /sessions/analyze */
export interface SessionAnalysis {
  session_id: string;
  summary: string;
  evaluation: {
    score?: number;
    feedback?: string;
    strengths?: string[];
    improvements?: string[];
  };
  transcript?: Array<{ role: "user" | "ai"; content: string; timestamp: string }>;
  metadata?: Record<string, unknown>;
}

export interface AnalyzeSessionRequest {
  session_id: string;
}

export interface PostProcessRequest {
  run_analysis?: boolean;
  run_extraction?: boolean;
}

export interface Balance {
  available_minutes: number;
  last_updated: string;
}

export interface CreateSATRequest {
  scenario_id: string;
  duration_hours?: number;
  email?: string;
}

export interface SATResponse {
  access_token: string;
  expires_at: string;
  /** Pre-built iframe src URL with the access token included */
  iframe_src: string;
}

// =============================================================================
// HTTP Client
// =============================================================================

interface RequestOptions {
  method: "GET" | "POST" | "DELETE";
  body?: unknown;
}

/** Asserts the constructed URL stays within the expected API origin, preventing SSRF. */
function buildSafeUrl(endpoint: string): URL {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  const expected = new URL(API_BASE_URL);
  if (url.origin !== expected.origin) {
    throw new ToughTongueError(
      `Blocked request to unexpected origin: ${url.origin}`,
      "SSRF_GUARD"
    );
  }
  return url;
}

async function apiRequest<T>(endpoint: string, options: RequestOptions): Promise<T> {
  const apiKey = AppConfig.toughTongue.apiKey;
  if (!apiKey) throw new ToughTongueError("API key not configured", "CONFIG_ERROR");

  const url = buildSafeUrl(endpoint);

  const response = await fetch(url.toString(), {
    method: options.method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ToughTongueError(
      data.detail || data.message || "API request failed",
      "API_ERROR",
      response.status,
      data
    );
  }

  return data as T;
}

// =============================================================================
// API Functions
// =============================================================================

/** Check account wallet balance */
export async function getBalance(): Promise<Balance> {
  return apiRequest<Balance>("/balance", { method: "GET" });
}

/** List sessions (v1 — basic metadata) */
export async function listSessions(request?: ListSessionsRequest): Promise<ListSessionsResponse> {
  const params = new URLSearchParams();
  if (request?.scenario_id) params.set("scenario_id", request.scenario_id);
  if (request?.user_email) params.set("user_email", request.user_email);
  if (request?.from_date) params.set("from_date", request.from_date);
  if (request?.to_date) params.set("to_date", request.to_date);
  if (request?.limit) params.set("limit", request.limit.toString());
  if (request?.page) params.set("page", request.page.toString());

  const query = params.toString();
  return apiRequest<ListSessionsResponse>(
    query ? `/sessions?${query}` : "/sessions",
    { method: "GET" }
  );
}

/**
 * List sessions (v2 — enriched with scores, extraction, analytics URL).
 * Preferred over v1 when you need evaluation data without fetching each session.
 */
export async function listSessionsV2(request?: ListSessionsRequest): Promise<ListSessionsV2Response> {
  const params = new URLSearchParams();
  if (request?.scenario_id) params.set("scenario_id", request.scenario_id);
  if (request?.user_email) params.set("user_email", request.user_email);
  if (request?.from_date) params.set("$gte_created_at", request.from_date);
  if (request?.to_date) params.set("$lt_created_at", request.to_date);
  if (request?.limit) params.set("limit", request.limit.toString());
  if (request?.page) params.set("page", request.page.toString());

  const query = params.toString();
  return apiRequest<ListSessionsV2Response>(
    query ? `/v2/sessions?${query}` : "/v2/sessions",
    { method: "GET" }
  );
}

/** Get full session details including transcript URL, evaluation, extraction */
export async function getSession(sessionId: string): Promise<SessionDetail> {
  return apiRequest<SessionDetail>(`/sessions/${sessionId}`, { method: "GET" });
}

/**
 * Trigger analysis on a completed session (legacy endpoint).
 * Prefer postProcessSession for new code.
 */
export async function analyzeSession(request: AnalyzeSessionRequest): Promise<SessionAnalysis> {
  return apiRequest<SessionAnalysis>("/sessions/analyze", {
    method: "POST",
    body: { session_id: request.session_id },
  });
}

/**
 * Run analysis and/or extraction in the background (v2).
 * Returns immediately — poll getSession for results.
 *
 * @example
 * await postProcessSession("session_id", { run_analysis: true, run_extraction: true });
 */
export async function postProcessSession(
  sessionId: string,
  options: PostProcessRequest = { run_analysis: true }
): Promise<{ ok: boolean }> {
  return apiRequest<{ ok: boolean }>(`/v2/sessions/${sessionId}/post-process`, {
    method: "POST",
    body: options,
  });
}

/** Create a Scenario Access Token (SAT) for embedding private scenarios */
export async function createSAT(request: CreateSATRequest): Promise<SATResponse> {
  const durationHours = Math.min(24, Math.max(1, request.duration_hours ?? 4));
  return apiRequest<SATResponse>("/scenario-access-token", {
    method: "POST",
    body: {
      scenario_id: request.scenario_id,
      duration_hours: durationHours,
      ...(request.email && { email: request.email }),
    },
  });
}

/** Check if the API key is configured */
export function isConfigured(): boolean {
  return !!AppConfig.toughTongue.apiKey;
}
