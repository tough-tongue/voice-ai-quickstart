"use client";

import { useSession } from "@/context/SessionContext";
import NavAgentWidget from "./NavAgentWidget";
import MeetingBotWidget from "./MeetingBotWidget";

/**
 * PersistentWidgets
 *
 * Mounted above <Routes> in the root layout so the ToughTongue iframe DOM
 * (and the live voice/AI session it holds) survives all Next.js route changes.
 *
 * NavAgentWidget is ALWAYS mounted — hidden via display:none when switching
 * to meeting-bot mode so the iframe session stays alive in the background.
 */
export function PersistentWidgets() {
  const { widgetMode } = useSession();

  return (
    <>
      <div
        data-testid="widget-slot-nav-agent"
        style={{ display: widgetMode === "nav-agent" ? "block" : "none" }}
      >
        <NavAgentWidget />
      </div>
      {widgetMode === "google-meet-agent" && <MeetingBotWidget />}
    </>
  );
}
