import { NextRequest, NextResponse } from "next/server";
import { ttaiGet, ttaiError } from "../client";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = req.nextUrl;
  const params: Record<string, string> = {
    limit: searchParams.get("limit") || "25",
  };
  const scenarioId = searchParams.get("scenario_id");
  if (scenarioId) params.scenario_id = scenarioId;

  try {
    const data = await ttaiGet("/sessions", params);
    return NextResponse.json(data);
  } catch (err) {
    return ttaiError(err);
  }
}
