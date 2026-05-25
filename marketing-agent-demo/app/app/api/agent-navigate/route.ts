import { NextRequest, NextResponse } from "next/server";
import { commandStore, type NavigateCommand } from "@/lib/command-store";

interface AgentNavigateBody {
  session_code: string;
  url?: string;
  section?: string;
}

/**
 * Called by the ToughTongue AI custom function during a live session.
 * The agent knows `session_code` from {{ session_code }} in ai_instructions,
 * which is injected via the `t_session_code` iframe URL parameter.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = (await req.json()) as AgentNavigateBody;

  const cmd: NavigateCommand = {};
  if (typeof body.url === "string") cmd.url = body.url;
  if (typeof body.section === "string") cmd.section = body.section;

  if (!cmd.url && !cmd.section) {
    return NextResponse.json(
      { ok: false, error: "Provide at least one of: url, section" },
      { status: 400 },
    );
  }

  if (!body.session_code) {
    return NextResponse.json(
      { ok: false, error: "session_code is required" },
      { status: 400 },
    );
  }

  const sessionId = body.session_code.trim().toUpperCase();
  commandStore.deliver(sessionId, cmd);

  return NextResponse.json({ ok: true, session: sessionId, dispatched: cmd });
}
