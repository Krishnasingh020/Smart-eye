import React, { useState, useEffect } from "react";

const TrafficLight = () => {
  const [activeLight, setActiveLight] = useState("red");

  useEffect(() => {
    const cycle = ["red", "green", "yellow"];
    let i = 0;

    const interval = setInterval(() => {
      setActiveLight(cycle[i]);
      i = (i + 1) % cycle.length;
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">🚦 Traffic Light Simulation</h2>

      <div className="bg-gray-900 p-6 rounded-2xl shadow-lg w-28 flex flex-col items-center gap-4">
        {/* Red Light */}
        <div
          className={`w-16 h-16 rounded-full ${
            activeLight === "red" ? "bg-red-500 shadow-xl shadow-red-500/70" : "bg-red-800"
          }`}
        ></div>

        {/* Yellow Light */}
        <div
          className={`w-16 h-16 rounded-full ${
            activeLight === "yellow" ? "bg-yellow-400 shadow-xl shadow-yellow-400/70" : "bg-yellow-800"
          }`}
        ></div>

        {/* Green Light */}
        <div
          className={`w-16 h-16 rounded-full ${
            activeLight === "green" ? "bg-green-500 shadow-xl shadow-green-500/70" : "bg-green-800"
          }`}
        ></div>
      </div>
    </div>
  );
};

export default TrafficLight;
