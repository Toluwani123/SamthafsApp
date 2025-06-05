import React from 'react';

export default function StatCard({ Icon, value, label }) {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div
        className="inline-flex items-center justify-center w-16 h-16 bg-blue-800 rounded-full mb-4"
        aria-hidden="true"
      >
        <Icon className="text-3xl text-white" />
      </div>
      <div className="text-4xl font-bold mb-2">{value}</div>
      <p className="text-blue-200">{label}</p>
    </div>
  );
}
