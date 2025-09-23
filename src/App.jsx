// src/App.jsx
import React, { useEffect, useState, useRef } from "react";
import VideoCard from "./components/VideoCard";
import TrafficLight from "./components/TrafficLight";
import ChartPanel from "./components/ChartPanel";
import StatsPanel from "./components/StatsPanel";
import { fetchVehicles } from "./services/api";

export default function App() {
  const [stats, setStats] = useState({ count: 0, boxes: [], ts: Date.now() / 1000, signal: null });
  const [history, setHistory] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    // Try WebSocket first
    try {
      const ws = new WebSocket("ws://127.0.0.1:8000/ws");
      ws.onopen = () => console.log("WS connected");
      ws.onmessage = (ev) => {
        try {
          const d = JSON.parse(ev.data);
          // ensure fields exist
          const safeData = {
            count: d.count ?? 0,
            boxes: d.boxes ?? [],
            ts: d.ts ?? Date.now() / 1000,
            signal: d.signal ?? null,
          };
          setStats(safeData);
          setHistory((h) => {
            const label = new Date(safeData.ts * 1000).toLocaleTimeString();
            const next = [...h.slice(-19), { label, count: safeData.count }];
            return next;
          });
        } catch (err) {
          console.warn("WS parse error", err);
        }
      };
      ws.onclose = () => console.log("WS closed");
      ws.onerror = (e) => {
        console.warn("WS error", e);
      };
      wsRef.current = ws;
    } catch (e) {
      console.warn("WebSocket init failed", e);
    }

    // Polling fallback (if WS not open)
    const poll = setInterval(async () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;
      const v = await fetchVehicles();
      if (v) {
        // Normalize API response: expect {count, boxes, ts, signal}
        const safeData = {
          count: v.count ?? v.vehicle_count ?? 0,
          boxes: v.boxes ?? v.vehicles ?? [],
          ts: v.ts ?? Date.now() / 1000,
          signal: v.signal ?? null,
        };
        setStats(safeData);
        setHistory((h) => {
          const label = new Date(safeData.ts * 1000).toLocaleTimeString();
          return [...h.slice(-19), { label, count: safeData.count }];
        });
      }
    }, 1500);

    return () => {
      clearInterval(poll);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  // traffic light state: prefer backend 'signal' (if provided), otherwise derive
  const trafficState = (stats.signal && String(stats.signal).toUpperCase()) || (stats.count > 10 ? "RED" : stats.count > 5 ? "YELLOW" : "GREEN");

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-gray-100">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">🚦 Smart Traffic Dashboard</h1>
        <div className="text-sm text-gray-400">Backend: http://127.0.0.1:8000</div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left big column: Video + Chart */}
        <div className="lg:col-span-2 space-y-6">
          <VideoCard />
          <ChartPanel history={history} />
        </div>

        {/* Right column: Traffic Light + Stats */}
        <div className="space-y-6">
          {/* Pass trafficState so TrafficLight responds to backend/predicted state */}
          <TrafficLight state={trafficState} />
          <StatsPanel stats={stats} />
        </div>
      </div>
    </div>
  );
}
