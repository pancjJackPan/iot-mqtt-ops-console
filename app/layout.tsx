import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IoT MQTT Ops Console",
  description: "Portfolio-grade IoT fleet dashboard for MQTT device monitoring and command workflows.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
