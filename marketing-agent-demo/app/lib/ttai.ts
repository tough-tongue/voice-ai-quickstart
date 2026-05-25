/**
 * ToughTongue AI — scenario & widget configuration.
 * Manage scenario IDs at: https://app.toughtongueai.com/developer
 *
 * Sections:
 * - Scenario IDs
 * - Widget configs
 * - URL helpers
 */

const TTAI_EMBED_BASE = "https://app.toughtongueai.com/embed/basic";

// ------------------------------------------------------------------------------
// Scenario IDs
// ------------------------------------------------------------------------------
export const NAV_AGENT_SCENARIO_ID = "6a104b56bd9dee6f4d1ab30d";

// ------------------------------------------------------------------------------
// Widget configs
// ------------------------------------------------------------------------------
export const MEETING_BOT_CONFIG = {
  scenarioId: "76b649570971b323096dc488",
  scriptSrc: "https://app.toughtongueai.com/widget/meeting-bot.js",
  mode: "strip",
  theme: "dark",
  title: "Talk to Expert",
  subtitle: "Priya",
  buttonText: "Start Meeting",
  avatarVideo:
    "https://d27v9s74nsl66w.cloudfront.net/ttai/system/thinking/2a11e7a6-251c-4189-8156-603ca6defa04.mp4",
} as const;

// ------------------------------------------------------------------------------
// URL helpers
// ------------------------------------------------------------------------------
export function getNavAgentEmbedUrl(
  params: Record<string, string> = {},
): string {
  const url = new URL(`${TTAI_EMBED_BASE}/${NAV_AGENT_SCENARIO_ID}`);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  return url.toString();
}
