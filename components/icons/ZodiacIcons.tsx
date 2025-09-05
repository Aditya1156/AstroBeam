
import React from 'react';
import { ZodiacName } from '../../types';

interface ZodiacIconProps {
  sign: ZodiacName;
  className?: string;
}

// A single component to hold all zodiac SVG icons.
export const ZodiacIcon: React.FC<ZodiacIconProps> = ({ sign, className = 'w-6 h-6' }) => {
  const icons: Record<ZodiacName, React.ReactNode> = {
    Aries: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5V1M17 7l3-3M7 7L4 4M5 12H1M19 12h-4M7.5 16.5L5 21M16.5 16.5L19 21M12 17v5"/></svg>,
    Taurus: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0"/><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0"/><path d="M12 21a9 9 0 0 0 0-18"/><path d="M3 12a9 9 0 0 1 9-9"/></svg>,
    Gemini: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M3 18h18M7 6v12M17 6v12"/></svg>,
    Cancer: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 12a6 6 0 0 1 6-6 6 6 0 0 1 6 6v0a6 6 0 0 1-6 6 6 6 0 0 1-6-6z"/><path d="M18 12a6 6 0 0 1-6 6 6 6 0 0 1-6-6h12z"/></svg>,
    Leo: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0"/><path d="M12 3v9"/><path d="M12 15l3 3"/><path d="M12 15l-3 3"/></svg>,
    Virgo: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6l3 12h12l3-12"/><path d="M12 4v16"/><path d="M8 12h8"/></svg>,
    Libra: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M7 6l5 6-5 6M17 6l-5 6 5 6"/></svg>,
    Scorpio: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6l3 12h12l3-12"/><path d="M12 4v16"/><path d="M8 12h8"/><path d="M17 20l-5-5-5 5"/></svg>,
    Sagittarius: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21V3"/><path d="m5 8 7-7 7 7"/><path d="M3 12h18"/></svg>,
    Capricorn: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6l3 12h12l3-12"/><path d="m8 12 4 4 4-4"/><path d="M12 3v9"/></svg>,
    Aquarius: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10h18"/><path d="M3 14h18"/><path d="M8 10s-1.5-2-4-2"/><path d="M16 10s1.5-2 4-2"/><path d="M8 14s-1.5 2-4 2"/><path d="M16 14s1.5 2 4 2"/></svg>,
    Pisces: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 9s1.5-2 4-2 4 2 4 2"/><path d="M5 15s1.5 2 4 2 4-2 4-2"/><path d="M17 9s-1.5-2-4-2-4 2-4 2"/><path d="M17 15s-1.5 2-4 2-4-2-4-2"/><path d="M2 12h20"/></svg>,
  };

  return icons[sign] || null;
};
