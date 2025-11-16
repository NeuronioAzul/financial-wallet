import React, { useState } from 'react';

interface UserTooltipProps {
  name: string;
  email: string;
  children: React.ReactNode;
}

export const UserTooltip: React.FC<UserTooltipProps> = ({ name, email, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute left-0 top-full mt-2 z-50 w-max max-w-xs">
          <div className="bg-gray-900 text-white text-sm rounded-lg px-3 py-2 shadow-xl">
            <div className="font-semibold mb-1">{name}</div>
            <div className="text-gray-300 text-xs">{email}</div>
          </div>
          {/* Seta do tooltip */}
          <div className="absolute left-4 -top-1 w-2 h-2 bg-gray-900 transform rotate-45"></div>
        </div>
      )}
    </span>
  );
};
