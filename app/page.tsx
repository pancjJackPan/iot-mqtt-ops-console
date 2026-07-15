import { Activity, Cpu, Radio, TerminalSquare } from "lucide-react";
import { getFleetSnapshot } from "@/lib/fleet";

function countByStatus(status: string) {
  const snapshot = getFleetSnapshot();
  return snapshot.devices.filter((device) => device.status === status).length;
}

export default function Home() {
  const snapshot = getFleetSnapshot();
  const online = countByStatus("online");
  const offline = countByStatus("offline");
  const stale = countByStatus("stale");
  const highAlerts = snapshot.alerts.filter((alert) => alert.severity === "high").length;

  return (
    <main className="shell">
      <div className="page">
        <header className="topbar">
          <div>
            <p className="eyebrow">MQTT fleet operations</p>
            <h1>IoT MQTT Ops Console</h1>
            <p className="muted">
              Monitor embedded Linux gateways, ESP32/STM32 nodes, cellular sensors, and command workflows from one focused operations surface.
            </p>
          </div>
          <div className="topic">broker: mqtt://localhost:1883</div>
        </header>

        <section className="grid stats">
          <div className="stat">
            <Radio size={20} />
            <strong>{online}</strong>
            <span className="muted">online devices</span>
          </div>
          <div className="stat">
            <Activity size={20} />
            <strong>{stale}</strong>
            <span className="muted">stale heartbeats</span>
          </div>
          <div className="stat">
            <Cpu size={20} />
            <strong>{offline}</strong>
            <span className="muted">offline devices</span>
          </div>
          <div className="stat">
            <TerminalSquare size={20} />
            <strong>{highAlerts}</strong>
            <span className="muted">high priority alerts</span>
          </div>
        </section>

        <section className="grid main-grid">
          <div className="panel">
            <p className="eyebrow">Fleet</p>
            <h2>Device Health</h2>
            <div className="grid device-grid">
              {snapshot.devices.map((device) => (
                <article className="device-card" key={device.id}>
                  <div className="device-head">
                    <div>
                      <h3>{device.name}</h3>
                      <p className="muted">{device.model} · {device.location}</p>
                    </div>
                    <span className={`badge ${device.status}`}>{device.status}</span>
                  </div>
                  <div className="metrics">
                    <div className="metric">
                      <span>RSSI</span>
                      <strong>{device.rssi} dBm</strong>
                    </div>
                    <div className="metric">
                      <span>Temp</span>
                      <strong>{device.temperatureC.toFixed(1)} C</strong>
                    </div>
                    <div className="metric">
                      <span>Battery</span>
                      <strong>{device.batteryPercent === null ? "wired" : `${device.batteryPercent}%`}</strong>
                    </div>
                  </div>
                  <div className="topic">{device.topicRoot}/telemetry</div>
                </article>
              ))}
            </div>
          </div>

          <aside className="grid">
            <section className="panel">
              <p className="eyebrow">Alerts</p>
              <h2>Action Queue</h2>
              {snapshot.alerts.map((alert) => (
                <div className="alert-row" key={alert.id}>
                  <span className={`badge ${alert.severity}`}>{alert.severity}</span>
                  <h3>{alert.title}</h3>
                  <p className="muted">{alert.detail}</p>
                </div>
              ))}
            </section>

            <section className="panel">
              <p className="eyebrow">Command center</p>
              <h2>Operator Commands</h2>
              <div className="command-list">
                <button className="command">Run diagnostics</button>
                <button className="command">Sync config</button>
                <button className="command">Reboot device</button>
                <button className="command">Firmware update</button>
              </div>
              <div className="topic">POST /api/commands</div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
