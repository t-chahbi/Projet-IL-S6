// components/Toast.tsx
import React from 'react';

export default function Toast({ message, show }: { message: string; show: boolean }) {
  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded bg-green-600 text-white transition-opacity duration-300 ${
        show ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {message}
    </div>
  );
}
