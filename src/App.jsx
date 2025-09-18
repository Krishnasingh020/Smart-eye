import React, { useEffect, useState, useRef } from "react";
import VideoCard from "./components/VideoCard";
import TrafficLight from "./components/TrafficLight";
import ChartPanel from "./components/ChartPanel";
import StatsPanel from "./components/StatsPanel";
import { fetchVehicles } from "./services/api";

export default function App() {
  const [stats, setStats] = useState({ count: 0, boxes: [], ts: Date.now() / 1000, signal: "RED" });
  const [history, setHistory] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    // attempt websocket first for smooth realtime updates
    let opened = false;
    try { 
      const ws = new WebSocket("ws://127.0.0.1:8000/ws");
      ws.onopen = () => { opened = true; console.log("WS connected"); };
      ws.onmessage = (ev) => {
        try {
          const d = JSON.parse(ev.data);
          // normalize keys (backend uses count, boxes, signal)
          setStats(d);
          setHistory(h => {
            const label = new Date(d.ts * 1000).toLocaleTimeString();
            const next = [...h.slice(-19), { label, count: d.count }];
            return next;
          });
        } catch (err) { console.warn("ws parse", err); }
      };
      ws.onclose = () => console.log("WS closed");
      ws.onerror = (e) => console.warn("WS err", e);
      wsRef.current = ws;
    } catch (e) {
      console.warn("WebSocket failed", e);
    }

    // fallback polling (if websocket not available)
    const poll = setInterval(async () => {
      // if ws already populating, skip polling
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;
      const v = await fetchVehicles();
      if (v) {
        setStats(v);
        setHistory(h => {
          const label = new Date((v.ts || Date.now()/1000) * 1000).toLocaleTimeString();
          return [...h.slice(-19), { label, count: v.count || 0 }];
        });
      }
    }, 1500);

    return () => {
      clearInterval(poll);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  // traffic light state: use backend 'signal' if present, else simple threshold-based
  const trafficState = stats.signal || (stats.count > 10 ? "RED" : stats.count > 5 ? "YELLOW" : "GREEN");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🚦 Smart Traffic Dashboard</h1>

      <div className="grid grid-cols-2 gap-6">
        {/* Left column */}
        <div>
          <VideoCard />
          <TrafficLight />   {/* 👈 Traffic Light added under Video */}
        </div>

        {/* Right column */}
        <div>
          <ChartPanel />
        </div>
      </div>
    </div>
  );
}





