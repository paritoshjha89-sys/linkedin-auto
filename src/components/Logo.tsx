import React from 'react';

export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Background Shape */}
      <div className="absolute inset-0 bg-gradient-vibrant rounded-xl rotate-6 opacity-20" />
      <div className="absolute inset-0 bg-gradient-vibrant rounded-xl shadow-lg shadow-primary/20" />
      
      {/* Abstract "O" and "Flow" Icon */}
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-1/2 h-1/2 text-white relative z-10"
      >
        <path 
          d="M12 3V21M12 3C10 3 6 5 6 9C6 13 18 11 18 15C18 19 14 21 12 21M12 3C14 3 18 5 18 9C18 13 6 11 6 15C6 19 10 21 12 21" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
