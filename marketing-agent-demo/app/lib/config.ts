/**
 * Central environment variable loader.
 * All process.env reads live here — never read env vars elsewhere.
 *
 * Sections:
 * - AppConfig — runtime config object
 * - Guard helpers — isConfigured checks
 */

// ------------------------------------------------------------------------------
// AppConfig
// ------------------------------------------------------------------------------
const DEFAULT_PASSWORD = "changeme-in-prod";

export const AppConfig = {
  app: {
    name: "The Camellias",
    description:
      "Super-luxury residences on Golf Course Road, Gurugram — powered by an AI concierge that navigates the page with you.",
    url: process.env.NEXT_PUBLIC_APP_URL || "",
    isDev: process.env.NEXT_PUBLIC_IS_DEV === "true",
  },

  admin: {
    password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || DEFAULT_PASSWORD,
    isDefaultPassword:
      (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || DEFAULT_PASSWORD) ===
      DEFAULT_PASSWORD,
  },

  // Server-side only — never expose in client code
  toughTongue: {
    apiToken: process.env.TOUGHTONGUE_API_TOKEN || "",
    apiBase:
      process.env.TOUGHTONGUE_API_BASE ||
      "https://app.toughtongueai.com/api/public",
  },
} as const;

// ------------------------------------------------------------------------------
// Guard helpers
// ------------------------------------------------------------------------------
export const isToughTongueConfigured = (): boolean =>
  AppConfig.toughTongue.apiToken !== "";
