"use client";
import { useState, useEffect } from "react";

interface EyeProps {
  x: number;
  y: number;
}

const Eye: React.FC<EyeProps> = ({ x, y }) => {
  const [pupilPos, setPupilPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const eyeRect = { x, y, width: 40, height: 40 };
      const dx = event.clientX - (eyeRect.x + eyeRect.width / 2);
      const dy = event.clientY - (eyeRect.y + eyeRect.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 10;
      
      setPupilPos({
        x: (dx / distance) * Math.min(distance, maxDistance),
        y: (dy / distance) * Math.min(distance, maxDistance),
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  return (
    <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-black" style={{ position: "absolute", left: x, top: y }}>
      <div className="w-6 h-6 bg-black rounded-full" style={{ transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)` }}></div>
    </div>
  );
};

export default function EyesLogo() {
  return (
    <div className="relative w-48 h-24 flex justify-between items-center">
      <Eye x={20} y={20} />
      <Eye x={100} y={20} />
    </div>
  );
}
