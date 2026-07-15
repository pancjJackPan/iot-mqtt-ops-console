# IoT MQTT Ops Console

Production-style portfolio project for embedded Linux, MQTT, and IoT dashboard work.

The app models a small operations console for connected devices: gateways, ESP32/STM32-class nodes, cellular sensors, and industrial controllers. It gives a client a concrete way to evaluate MQTT topic design, device health monitoring, command workflows, alert handling, and deployment readiness.

## What It Demonstrates

- MQTT-oriented device state modeling
- Real-time operations dashboard patterns
- command and acknowledgement workflow design
- alert severity and stale-device detection
- Next.js and TypeScript internal-tool implementation
- Docker-ready deployment structure
- clear fit for IoT, embedded Linux, and device integration projects

## Core Screens

- Fleet overview with online/offline/stale counts
- Device cards with telemetry, firmware, RSSI, battery, and location
- Alert queue for high-temperature, stale telemetry, and low-signal devices
- Command center for reboot, diagnostics, firmware update, and configuration sync
- API endpoints for fleet state and command submission

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## API

```http
GET /api/devices
POST /api/commands
```

Example command payload:

```json
{
  "deviceId": "gw-seattle-01",
  "command": "run_diagnostics",
  "requestedBy": "operator"
}
```

## Deployment

For a basic container deployment:

```bash
docker build -t iot-mqtt-ops-console .
docker run -p 3000:3000 iot-mqtt-ops-console
```

The included `docker-compose.yml` shows how this dashboard can sit beside an MQTT broker. In a production implementation the mock fleet service would be replaced with a subscriber/consumer service that reads from topics such as:

```text
devices/+/telemetry
devices/+/status
devices/+/alerts
devices/{deviceId}/commands
devices/{deviceId}/commands/{commandId}/ack
```

## Why This Is Relevant for Clients

Many IoT jobs are blocked by the same practical problems: unclear topic design, unreliable device status, no command audit trail, missing deployment plan, and dashboards that do not match field operations. This project shows an implementation direction that can be adapted to real hardware, MQTT brokers, embedded Linux gateways, or cloud IoT services.
