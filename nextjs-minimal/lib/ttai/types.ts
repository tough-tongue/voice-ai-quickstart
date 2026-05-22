/**
 * ToughTongue AI - Type Definitions
 *
 * Types for ToughTongue AI API responses and iframe events.
 */

// =============================================================================
// Session Types (API Responses)
// =============================================================================

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

/** Per-topic rubric score from evaluation */
export interface ReportCardItem {
  topic: string;
  score: number;
  score_str: string;
  note: string;
  weight: number;
}

/** Full session detail — returned by GET /sessions/{id} */
export interface SessionDetail extends SessionListItem {
  /** S3 URL to the full conversation transcript */
  transcript_url?: string;
  evaluation_results?: {
    overall_score: string;
    final_score: number;
    strengths: string;
    weaknesses: string;
    detailed_feedback: string;
    report_card: ReportCardItem[];
  };
  /** Extracted variables keyed by the name defined in scenario config */
  extraction_results?: Record<string, unknown>;
  improvement_results?: {
    improvement_areas: string;
    action_items: string;
    resources: string;
  };
}

/**
 * Enriched session from GET /v2/sessions.
 * Includes evaluation scores, report card topics, and extraction results
 * without needing a separate GET /sessions/{id} call.
 */
export interface SessionV2 extends SessionListItem {
  evaluation_score?: number;
  evaluation_note?: string;
  report_card?: ReportCardItem[];
  report_card_topics?: string[];
  extraction_results?: Record<string, unknown>;
  analytics_url?: string;
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
  transcript?: Array<{
    role: "user" | "ai";
    content: string;
    timestamp: string;
  }>;
  metadata?: Record<string, unknown>;
}

// =============================================================================
// Balance Types
// =============================================================================

export interface Balance {
  available_minutes: number;
  last_updated: string;
}

// =============================================================================
// Iframe Event Types
// =============================================================================

export type IframeEventType =
  | "onStart"
  | "onStop"
  | "onTerminated"
  | "onSubmit"
  | "onError"
  | "onReady";

/** Normalized iframe event data after parsing */
export interface IframeEventData {
  session_id: string;
  scenario_id?: string;
  duration_seconds?: number;
  timestamp: number;
}

export interface IframeStartEvent {
  type: "onStart";
  data: IframeEventData;
}

export interface IframeStopEvent {
  type: "onStop";
  data: IframeEventData;
}

export interface IframeTerminatedEvent {
  type: "onTerminated";
  data: IframeEventData;
}

export interface IframeSubmitEvent {
  type: "onSubmit";
  data: IframeEventData;
}

export interface IframeErrorEvent {
  type: "onError";
  data: {
    code: string;
    message: string;
  };
}

export interface IframeReadyEvent {
  type: "onReady";
  data: {
    scenario_id: string;
  };
}

export type IframeEvent =
  | IframeStartEvent
  | IframeStopEvent
  | IframeTerminatedEvent
  | IframeSubmitEvent
  | IframeErrorEvent
  | IframeReadyEvent;

// =============================================================================
// Session Notes (Evaluator → Iframe)
// =============================================================================

export interface SessionNote {
  text: string;
  timestamp: number;
  /** Who added the note — shown in transcript */
  source?: string;
}

// =============================================================================
// Embed URL Builder Types
// =============================================================================

/**
 * Which iframe embed style to use.
 * - full (default): 800px, transcription + analysis enabled
 * - basic (recommended): 600px, standard interactive avatar
 * - minimal: 300px, compact preview — no transcription by default
 */
export type EmbedStyle = "full" | "basic" | "minimal";

export interface EmbedUrlOptions {
  scenarioId: string;
  /** Embed style. Defaults to "basic" (recommended). */
  embedStyle?: EmbedStyle;
  /** Background colour of the iframe */
  background?: "black" | "white" | "transparent";
  /** Pre-fills the user's name; skips the name dialog */
  userName?: string;
  /** Pre-fills the user's email; skips the email dialog */
  userEmail?: string;
  /** Show name/email form before starting when no userName is provided */
  promptUserInfo?: boolean;
  /** Dynamic variables injected as t_* query params */
  dynamicVariables?: Record<string, string>;
  /** SAT token for private scenarios */
  accessToken?: string;
  // ------------------------------------------------------------------------------
  // Appearance overrides
  // ------------------------------------------------------------------------------
  /** Override the AI voice (Aoede | Charon | Fenrir | Kore | Puck) */
  voice?: string;
  /** Custom avatar image URL */
  avatarUrl?: string;
  /** Default stock avatar (1–5) */
  avatarId?: number;
  /** Custom conversation title */
  name?: string;
  /** Accent colour (Tailwind colour string, e.g. "violet-500") */
  color?: string;
  /** Show pulse animation (default: true) */
  showPulse?: boolean;
  /** Hide "Powered by ToughTongue AI" branding */
  hidePoweredBy?: boolean;
  /** Auto-end session after N seconds */
  maxDuration?: number;
  /** Resume an interrupted session */
  restoreSession?: string;
  /** BCP-47 language code for voice accent (e.g. "en-US", "fr-FR") */
  languageCode?: string;
}

// =============================================================================
// SAT (Scenario Access Token) Types
// =============================================================================

/** Request to create a Scenario Access Token */
export interface CreateSATRequest {
  scenario_id: string;
  /** Token validity in hours (1–24, default: 4) */
  duration_hours?: number;
  /** Optional user email for org context */
  email?: string;
}

/** Response from creating a Scenario Access Token */
export interface SATResponse {
  access_token: string;
  expires_at: string;
  /** Pre-built iframe src URL with the access token included */
  iframe_src: string;
}

/** Options for building an embed URL with SAT support */
export interface SATEmbedOptions extends Omit<EmbedUrlOptions, "accessToken"> {
  /** Pre-fetched SAT token. If not provided and useSAT is enabled, caller must fetch it */
  sat?: SATResponse;
}
