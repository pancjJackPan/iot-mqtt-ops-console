import { NextResponse } from "next/server";
import { getFleetSnapshot } from "@/lib/fleet";

export function GET() {
  return NextResponse.json(getFleetSnapshot());
}
