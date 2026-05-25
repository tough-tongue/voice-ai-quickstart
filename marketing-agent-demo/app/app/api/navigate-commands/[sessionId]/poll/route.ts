import { NextRequest, NextResponse } from "next/server";
import { commandStore } from "@/lib/command-store";

// Vercel Pro: up to 300 s. Hobby: 10 s (long-poll won't work on Hobby plan).
// Set maxDuration in vercel.json for this route.
export const maxDuration = 30;

interface Params {
  sessionId: string;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<Params> },
): Promise<NextResponse> {
  const { sessionId } = await params;
  const cmd = await commandStore.poll(sessionId.toUpperCase());

  if (!cmd) {
    return NextResponse.json({ timeout: true });
  }
  return NextResponse.json(cmd);
}
