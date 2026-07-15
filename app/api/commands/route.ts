import { NextResponse } from "next/server";
import { createCommandAck } from "@/lib/fleet";
import type { DeviceCommand } from "@/lib/types";

const validCommands = new Set(["reboot", "run_diagnostics", "sync_config", "firmware_update"]);

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<DeviceCommand>;

  if (!body.deviceId || !body.command || !body.requestedBy) {
    return NextResponse.json({ error: "deviceId, command, and requestedBy are required." }, { status: 400 });
  }

  if (!validCommands.has(body.command)) {
    return NextResponse.json({ error: "Unsupported command." }, { status: 400 });
  }

  const ack = createCommandAck(body as DeviceCommand);
  return NextResponse.json(ack, { status: ack.ok ? 202 : 404 });
}
