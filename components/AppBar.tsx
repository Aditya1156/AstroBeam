
import React from 'react';
import { Route } from '../types';

interface AppBarProps {
  onNavigate: (route: Route) => void;
  currentRoute: Route;
}

export const AppBar: React.FC<AppBarProps> = ({ onNavigate, currentRoute }) => {
  const linkStyle = "px-3 py-2 rounded-lg text-moonbeam hover:text-starlight hover:bg-space-mid/50 transition-colors duration-300 cursor-pointer text-base font-semibold";
  const activeLinkStyle = "text-starlight bg-nebula/60";

  return (
    <header className="w-full mx-auto p-4 mb-6 z-20 flex justify-between items-center bg-space-light/30 backdrop-blur-sm rounded-xl border border-space-mid/50 animate-fadeIn">
      <a href="#/transfer" onClick={() => onNavigate('transfer')} className="flex items-center gap-3 cursor-pointer group">
        <svg className="w-8 h-8 text-comet group-hover:animate-starPulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/>
        </svg>
        <h1 className="text-2xl font-serif text-starlight">AstroBeam</h1>
      </a>
      <nav className="flex items-center gap-2 sm:gap-4 bg-space-dark/50 p-1 rounded-lg">
        <a href="#/transfer" onClick={() => onNavigate('transfer')} className={`${linkStyle} ${currentRoute === 'transfer' ? activeLinkStyle : ''}`}>
          Transfer
        </a>
        <a href="#/history" onClick={() => onNavigate('history')} className={`${linkStyle} ${currentRoute === 'history' ? activeLinkStyle : ''}`}>
          History
        </a>
      </nav>
    </header>
  );
};
