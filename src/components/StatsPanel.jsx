import React from "react";

/**
 * vehicles: array of boxes [{class_id, conf, xyxy}, ...]
 * count: number
 */
export default function StatsPanel({ stats }) {
  const classMap = {
    2: "car",
    3: "motorbike",
    5: "bus",
    7: "truck",
  };

  const counts = stats?.boxes?.reduce((acc, b) => {
    const name = classMap[b.class_id] || `id:${b.class_id}`;
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {}) || {};

  return (
    <div className="bg-gray-800 rounded-2xl p-4 shadow-lg">
      <h3 className="text-lg font-semibold mb-3">📋 Stats</h3>
      <div className="flex gap-4 items-center">
        <div>
          <div className="text-sm text-gray-300">Total</div>
          <div className="text-3xl font-bold text-green-300">{stats?.count ?? 0}</div>
        </div>
        <div className="flex-1">
          <div className="text-sm text-gray-300 mb-2">By type</div>
          <div className="flex gap-2 flex-wrap">
            {Object.keys(counts).length === 0 ? (
              <div className="text-gray-400">No vehicles detected</div>
            ) : Object.entries(counts).map(([k, v]) => (
              <span key={k} className="bg-gray-700 text-gray-100 px-3 py-1 rounded-lg text-sm">{k}: {v}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
