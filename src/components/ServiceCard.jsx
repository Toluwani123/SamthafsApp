// components/ServiceCard.jsx
import React from 'react';

export default function ServiceCard({ Icon, title, children }) {
  return (
    <div className="flex flex-col items-center text-center p-8 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition-shadow h-full">
      <div
        className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 text-blue-600 rounded-full mb-6"
        aria-hidden="true"
      >
        <Icon className="text-3xl" />
      </div>
      <h3 className="text-2xl font-bold mb-4 break-words">{title}</h3>
      <p className="text-gray-600">{children}</p>
    </div>
  );
}
