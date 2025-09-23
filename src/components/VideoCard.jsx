import React from "react";

export default function VideoCard() {
  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-4 flex flex-col">
      <h3 className="text-lg font-semibold mb-3">📹 Live Camera</h3>
      <div className="rounded-lg overflow-hidden border border-gray-700">
        {/* backend stream route */}
        <img
          src="http://127.0.0.1:8000/video"
          alt="Live stream"
          className="w-full h-[360px] object-cover"
          onError={(e) => (e.currentTarget.style.opacity = 0.5)}
        />
      </div>
      <p className="text-sm text-gray-300 mt-3">
        Source: Local webcam (back-end).
      </p>/home/Krishna-Singh/2025-09-19 12-55-45.mkv/home/Krishna-Singh/2025-09-19 12-55-45.mkv  
    </div>
  );
}
