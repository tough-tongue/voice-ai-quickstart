import { NextResponse } from "next/server";
import { ttaiGet, ttaiError } from "../client";

export async function GET(): Promise<NextResponse> {
  try {
    const data = await ttaiGet("/balance");
    return NextResponse.json(data);
  } catch (err) {
    return ttaiError(err);
  }
}
