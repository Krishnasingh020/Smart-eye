// src/components/TrafficLight.jsx
import React, { useState, useEffect } from "react";

/**
 * TrafficLight component:
 * - If `state` prop is provided ("RED"/"YELLOW"/"GREEN"), it will display that state.
 * - If no `state` prop is provided, it will auto-cycle (red -> green -> yellow).
 *
 * Place this file at: src/components/TrafficLight.jsx
 */
export default function TrafficLight({ state = null }) {
  const [active, setActive] = useState("red");
  // If backend provides state, reflect it; otherwise run internal cycle.
  useEffect(() => {
    if (state) {
      const s = String(state).toLowerCase();
      if (s === "red" || s === "yellow" || s === "green") {
        setActive(s);
      }
      return; // do not start internal cycler when backend state is provided
    }

    // internal cycle: red -> green -> yellow -> red ...
    const cycle = ["red", "green", "yellow"];
    let idx = 0;
    setActive(cycle[idx]);
    const t = setInterval(() => {
      idx = (idx + 1) % cycle.length;
      setActive(cycle[idx]);
    }, 3500); // change interval if you want different timings

    return () => clearInterval(t);
  }, [state]);

  // helper classes (Tailwind)
  const lightClass = (color) => {
    const base = "w-20 h-20 rounded-full transition-all duration-400";
    const on = "opacity-100 shadow-2xl";
    const off = "opacity-30";
    if (color === "red")
      return `${base} ${active === "red" ? "bg-red-500 " + on : "bg-red-900 " + off}`;
    if (color === "yellow")
      return `${base} ${active === "yellow" ? "bg-yellow-400 " + on : "bg-yellow-900 " + off}`;
    return `${base} ${active === "green" ? "bg-green-500 " + on : "bg-green-900 " + off}`;
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-5 shadow-lg flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-4">🚦 Traffic Light</h3>

      <div className="bg-black p-4 rounded-xl flex flex-col items-center">
        <div className={lightClass("red")}></div>
        <div className="my-2" />
        <div className={lightClass("yellow")}></div>
        <div className="my-2" />
        <div className={lightClass("green")}></div>
      </div>

      <div className="mt-3 text-sm text-gray-300">Current: <span className="font-semibold ml-1">{active.toUpperCase()}</span></div>
    </div>
  );
}
