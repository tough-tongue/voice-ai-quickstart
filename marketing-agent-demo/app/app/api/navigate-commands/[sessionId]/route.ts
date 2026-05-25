import { NextRequest, NextResponse } from "next/server";
import { commandStore, type NavigateCommand } from "@/lib/command-store";

interface Params {
  sessionId: string;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<Params> },
): Promise<NextResponse> {
  const { sessionId } = await params;
  const body = (await req.json()) as NavigateCommand;

  const cmd: NavigateCommand = {};
  if (typeof body.url === "string") cmd.url = body.url;
  if (typeof body.section === "string") cmd.section = body.section;

  if (!cmd.url && !cmd.section) {
    return NextResponse.json(
      { ok: false, error: "Provide at least one of: url, section" },
      { status: 400 },
    );
  }

  commandStore.deliver(sessionId.toUpperCase(), cmd);
  return NextResponse.json({ ok: true });
}
