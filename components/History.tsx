
import React, { useState, useEffect } from 'react';
import { TransferHistoryEntry } from '../types';
import { ZodiacIcon } from './icons/ZodiacIcons';

const getHistory = (): TransferHistoryEntry[] => {
  try {
    const storedHistory = localStorage.getItem('astrobeam-history');
    return storedHistory ? JSON.parse(storedHistory) : [];
  } catch (e) {
    console.error("Failed to parse history from localStorage", e);
    return [];
  }
};

export const History: React.FC = () => {
  const [history, setHistory] = useState<TransferHistoryEntry[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear your entire transfer log? This cannot be undone.")) {
        localStorage.removeItem('astrobeam-history');
        setHistory([]);
    }
  };

  if (history.length === 0) {
    return (
      <div className="text-center animate-fadeIn text-moonbeam min-h-[200px] flex flex-col justify-center items-center">
        <h2 className="text-2xl font-semibold text-starlight mb-4">Transfer Log</h2>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-space-mid mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h4M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M8 7h8m-5 5h2m-5 3h5" /></svg>
        <p>No past transfers recorded in your ship's log.</p>
        <p className="mt-1 text-sm">Completed or failed transfers will appear here.</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-starlight">Transfer Log</h2>
        <button onClick={clearHistory} className="text-sm text-moonbeam hover:text-red-400 transition-colors px-3 py-1 rounded-md hover:bg-space-dark">
          Clear Log
        </button>
      </div>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {history.map(entry => (
          <div key={entry.id} className="bg-space-dark/50 p-4 rounded-lg flex items-center justify-between gap-4 border border-space-mid/50 hover:border-comet/50 transition-colors duration-300">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <ZodiacIcon sign={entry.zodiacName} className="w-10 h-10 text-comet flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-starlight truncate" title={entry.fileName}>{entry.fileName}</p>
                <p className="text-sm text-moonbeam">
                  {new Date(entry.timestamp).toLocaleString()} - {(entry.fileSize / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className={`font-bold capitalize ${entry.status === 'completed' ? 'text-green-400' : 'text-red-400'}`}>
                {entry.status}
              </p>
              <p className="text-sm text-moonbeam capitalize">{entry.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
