import React, { useState, useRef, useEffect } from 'react';

interface UserTooltipProps {
  name: string;
  email: string;
  children: React.ReactNode;
}

export const UserTooltip: React.FC<UserTooltipProps> = ({ name, email, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX
      });
    }
  }, [isVisible]);

  return (
    <>
      <span 
        ref={triggerRef}
        className="relative inline-block"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </span>
      {isVisible && (
        <div 
          className="fixed z-[9999] w-max max-w-xs pointer-events-none"
          style={{ top: `${position.top}px`, left: `${position.left}px` }}
        >
          <div className="bg-gray-900 text-white text-sm rounded-lg px-3 py-2 shadow-xl">
            <div className="font-semibold mb-1">{name}</div>
            <div className="text-gray-300 text-xs">{email}</div>
          </div>
          {/* Seta do tooltip */}
          <div className="absolute left-4 -top-1 w-2 h-2 bg-gray-900 transform rotate-45"></div>
        </div>
      )}
    </>
  );
};
