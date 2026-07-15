import type { Alert, Device, DeviceCommand, FleetSnapshot } from "./types";

const devices: Device[] = [
  {
    id: "gw-seattle-01",
    name: "Seattle Gateway 01",
    status: "online",
    model: "Embedded Linux Gateway",
    firmware: "gw-2.8.4",
    location: "Seattle, WA",
    lastSeen: "42 seconds ago",
    batteryPercent: null,
    rssi: -57,
    temperatureC: 46.8,
    humidityPercent: 44,
    topicRoot: "devices/gw-seattle-01",
  },
  {
    id: "esp32-coldroom-07",
    name: "Cold Room Sensor 07",
    status: "stale",
    model: "ESP32 Telemetry Node",
    firmware: "sensor-1.9.2",
    location: "Portland, OR",
    lastSeen: "18 minutes ago",
    batteryPercent: 31,
    rssi: -83,
    temperatureC: 9.3,
    humidityPercent: 68,
    topicRoot: "devices/esp32-coldroom-07",
  },
  {
    id: "stm32-pump-12",
    name: "Pump Controller 12",
    status: "maintenance",
    model: "STM32 Industrial Controller",
    firmware: "pump-4.1.0",
    location: "Reno, NV",
    lastSeen: "3 minutes ago",
    batteryPercent: 87,
    rssi: -69,
    temperatureC: 62.4,
    humidityPercent: 32,
    topicRoot: "devices/stm32-pump-12",
  },
  {
    id: "cellular-meter-04",
    name: "Cellular Meter 04",
    status: "offline",
    model: "LTE-M Meter Node",
    firmware: "meter-3.3.7",
    location: "Boise, ID",
    lastSeen: "2 hours ago",
    batteryPercent: 54,
    rssi: -96,
    temperatureC: 28.1,
    humidityPercent: 39,
    topicRoot: "devices/cellular-meter-04",
  },
];

function buildAlerts(fleet: Device[]): Alert[] {
  return fleet.flatMap((device) => {
    const alerts: Alert[] = [];

    if (device.status === "stale" || device.status === "offline") {
      alerts.push({
        id: `${device.id}-stale`,
        deviceId: device.id,
        severity: device.status === "offline" ? "high" : "medium",
        title: "Telemetry heartbeat missed",
        detail: `${device.name} last reported ${device.lastSeen}. Check broker connectivity, signal quality, and device power.`,
        createdAt: "now",
      });
    }

    if (device.rssi < -80) {
      alerts.push({
        id: `${device.id}-signal`,
        deviceId: device.id,
        severity: "medium",
        title: "Weak signal",
        detail: `RSSI is ${device.rssi} dBm. Consider antenna placement or gateway coverage.`,
        createdAt: "now",
      });
    }

    if (device.temperatureC >= 60) {
      alerts.push({
        id: `${device.id}-temperature`,
        deviceId: device.id,
        severity: "high",
        title: "High controller temperature",
        detail: `${device.temperatureC.toFixed(1)} C detected. Route device for maintenance review.`,
        createdAt: "now",
      });
    }

    return alerts;
  });
}

export function getFleetSnapshot(): FleetSnapshot {
  return {
    devices,
    alerts: buildAlerts(devices),
    generatedAt: new Date().toISOString(),
  };
}

export function createCommandAck(command: DeviceCommand) {
  const target = devices.find((device) => device.id === command.deviceId);

  if (!target) {
    return {
      ok: false,
      message: "Device not found.",
    };
  }

  return {
    ok: true,
    commandId: `cmd_${Date.now().toString(36)}`,
    topic: `${target.topicRoot}/commands`,
    payload: {
      command: command.command,
      requestedBy: command.requestedBy,
      requestedAt: new Date().toISOString(),
    },
  };
}
