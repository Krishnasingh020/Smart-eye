import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function ChartPanel({ history }) {
  // history = [{ts: 169..., count: 3}, ...]
  return (
    <div className="bg-gray-800 rounded-2xl p-4 shadow-lg">
      <h3 className="text-lg font-semibold mb-3">📈 Count (last samples)</h3>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <LineChart data={history}>
            <CartesianGrid stroke="#2d3748" />
            <XAxis dataKey="label" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#34d399" strokeWidth={2} dot={{ r: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
