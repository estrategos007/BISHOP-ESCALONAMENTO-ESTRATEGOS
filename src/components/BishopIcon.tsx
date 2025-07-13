import React from "react";

interface BishopIconProps {
  className?: string;
}

export const BishopIcon: React.FC<BishopIconProps> = ({ className = "h-8 w-8" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Base do bispo */}
      <path d="M6 20h12l-1-2H7l-1 2z" />
      
      {/* Corpo principal */}
      <path d="M8 18l1-4h6l1 4" />
      
      {/* Meio do bispo */}
      <path d="M9 14c0-1.5 1-3 3-3s3 1.5 3 3" />
      
      {/* Parte superior */}
      <path d="M11 11V9c0-1 1-2 1-2s1 1 1 2v2" />
      
      {/* Topo com cruz */}
      <circle cx="12" cy="7" r="1" />
      <path d="M12 6V4" />
      <path d="M11 5h2" />
      
      {/* Diagonal característica do bispo */}
      <path d="M10 12l4-4" />
      <path d="M14 12l-4-4" />
    </svg>
  );
}; 