/**
 * ToughTongue AI - Client-Side Module
 *
 * Client-side utilities for ToughTongue AI integrations.
 * For server-side API calls, use app/api/ttai/client.ts
 * For state management, use lib/store.ts
 *
 * @example
 * import { buildPersonalityTestUrl, createIframeEventListener, SCENARIOS } from '@/lib/ttai';
 *
 * // With SAT support (for private scenarios)
 * import { fetchSAT, buildSATEmbedUrl, getEmbedUrlWithSAT, isSATEnabled } from '@/lib/ttai';
 */

// Re-export constants
export { TOUGHTONGUE_ORIGIN, TOUGHTONGUE_EMBED_BASE, SCENARIOS, SCENARIO_URLS } from "./constants";

// Re-export client-side types
export type {
  // Iframe types
  IframeEvent,
  IframeEventType,
  IframeStartEvent,
  IframeStopEvent,
  IframeTerminatedEvent,
  IframeSubmitEvent,
  IframeErrorEvent,
  IframeReadyEvent,
  // Embed types
  EmbedStyle,
  EmbedUrlOptions,
  // SAT types
  CreateSATRequest,
  SATResponse,
  SATEmbedOptions,
  // Session notes
  SessionNote,
  // Response types (for consuming API responses)
  SessionAnalysis,
  SessionListItem,
  SessionDetail,
  SessionV2,
  ReportCardItem,
  Balance,
} from "./types";

// Re-export client utilities
export {
  // URL builders
  buildEmbedUrl,
  buildPersonalityTestUrl,
  buildCoachUrl,
  // SAT utilities
  fetchSAT,
  isSATEnabled,
  buildSATEmbedUrl,
  getEmbedUrlWithSAT,
  // Event handling
  createIframeEventListener,
  // Evaluator → iframe
  sendSessionNotes,
} from "./client";
