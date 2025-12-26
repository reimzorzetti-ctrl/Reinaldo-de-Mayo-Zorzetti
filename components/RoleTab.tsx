
import React from 'react';
import { Role } from '../types';

interface RoleTabProps {
  role: Role;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  config: {
    color: string;
    lightColor: string;
    textColor: string;
    borderColor: string;
  };
}

const RoleTab: React.FC<RoleTabProps> = ({ role, isActive, onClick, icon, config }) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center py-3 px-1 rounded-2xl transition-all duration-300 border-2 ${
        isActive 
          ? `${config.color} text-white border-transparent shadow-lg scale-105` 
          : `${config.lightColor} ${config.textColor} ${config.borderColor}`
      }`}
    >
      {icon}
      <span className="text-xs font-bold mt-1 uppercase tracking-wider">{role}</span>
    </button>
  );
};

export default RoleTab;
