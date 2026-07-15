export type DeviceStatus = "online" | "offline" | "stale" | "maintenance";

export type Device = {
  id: string;
  name: string;
  status: DeviceStatus;
  model: string;
  firmware: string;
  location: string;
  lastSeen: string;
  batteryPercent: number | null;
  rssi: number;
  temperatureC: number;
  humidityPercent: number;
  topicRoot: string;
};

export type Alert = {
  id: string;
  deviceId: string;
  severity: "low" | "medium" | "high";
  title: string;
  detail: string;
  createdAt: string;
};

export type FleetSnapshot = {
  devices: Device[];
  alerts: Alert[];
  generatedAt: string;
};

export type DeviceCommand = {
  deviceId: string;
  command: "reboot" | "run_diagnostics" | "sync_config" | "firmware_update";
  requestedBy: string;
};
