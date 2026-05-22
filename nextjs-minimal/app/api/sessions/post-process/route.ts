/**
 * POST /api/sessions/post-process - V2 Session Post-Processing
 *
 * Triggers analysis and/or variable extraction in the background.
 * Returns immediately — poll GET /api/sessions/[sessionId] for results.
 *
 * Preferred over /api/sessions/analyze for new integrations.
 *
 * Request Body:
 *   - session_id (required): The session to process
 *   - run_analysis (optional, default true): Trigger evaluation
 *   - run_extraction (optional, default false): Extract configured variables
 */

import { NextRequest, NextResponse } from "next/server";
import { postProcessSession, ToughTongueError } from "../../ttai/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.session_id) {
      return NextResponse.json({ error: "session_id is required" }, { status: 400 });
    }

    const result = await postProcessSession(body.session_id, {
      run_analysis: body.run_analysis ?? true,
      run_extraction: body.run_extraction ?? false,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ToughTongueError) {
      return NextResponse.json(error.toApiError(), { status: error.status || 500 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
