"use client";

import { useEffect } from "react";
import { MEETING_BOT_CONFIG } from "@/lib/ttai";

const SCRIPT_ID = "ttai-meeting-bot-script";

/**
 * MeetingBotWidget
 * Injects the ToughTongue AI meeting-bot strip script into the page.
 * The script self-renders a fixed-position strip widget.
 * Cleans up the script and any injected DOM nodes on unmount.
 */
export function MeetingBotWidget() {
  useEffect(() => {
    document.getElementById(SCRIPT_ID)?.remove();

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = MEETING_BOT_CONFIG.scriptSrc;
    script.setAttribute("data-scenario-id", MEETING_BOT_CONFIG.scenarioId);
    script.setAttribute("data-mode", MEETING_BOT_CONFIG.mode);
    script.setAttribute("data-theme", MEETING_BOT_CONFIG.theme);
    script.setAttribute("data-title", MEETING_BOT_CONFIG.title);
    script.setAttribute("data-subtitle", MEETING_BOT_CONFIG.subtitle);
    script.setAttribute("data-button-text", MEETING_BOT_CONFIG.buttonText);
    script.setAttribute("data-avatar-video", MEETING_BOT_CONFIG.avatarVideo);
    document.body.appendChild(script);

    return () => {
      document.getElementById(SCRIPT_ID)?.remove();
      document
        .querySelectorAll(
          '[id^="ttai-widget"], [class*="ttai-widget"], [id="toughtongue-bot"]',
        )
        .forEach((el) => el.remove());
    };
  }, []); // config is static — run once

  return null;
}

export default MeetingBotWidget;
