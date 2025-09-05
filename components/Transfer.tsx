
import React, { useState } from 'react';
import { Sender } from './Sender';
import { Receiver } from './Receiver';
import { SignalingMessage } from '../types';
import { ZODIAC_SIGNS, HOROSCOPES } from '../constants';
import { ZodiacIcon } from './icons/ZodiacIcons';

type TransferMode = 'home' | 'sender' | 'receiver';

interface TransferProps {
  sendSignalingMessage: (sessionId: string, message: SignalingMessage) => void;
  getSignalingMessages: (sessionId: string, fromIndex: number) => SignalingMessage[];
  joinSession: (sessionId: string) => void;
  initialSessionId: string | null;
}

export const Transfer: React.FC<TransferProps> = ({ sendSignalingMessage, getSignalingMessages, joinSession, initialSessionId }) => {
  const [mode, setMode] = useState<TransferMode>(initialSessionId ? 'receiver' : 'home');

  const resetToHome = () => {
    setMode('home');
  };

  if (mode === 'sender') {
    return <Sender sendSignalingMessage={sendSignalingMessage} getSignalingMessages={getSignalingMessages} joinSession={joinSession} onComplete={resetToHome} />;
  }

  if (mode === 'receiver') {
    return <Receiver sendSignalingMessage={sendSignalingMessage} getSignalingMessages={getSignalingMessages} joinSession={joinSession} onComplete={resetToHome} initialSessionId={initialSessionId} />;
  }

  // Home view
  const randomZodiac = ZODIAC_SIGNS[Math.floor(Math.random() * ZODIAC_SIGNS.length)];
  const randomHoroscope = HOROSCOPES[randomZodiac.name][Math.floor(Math.random() * HOROSCOPES[randomZodiac.name].length)];

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-center items-center mb-6 text-comet">
        <ZodiacIcon sign={randomZodiac.name} className="w-16 h-16" />
      </div>
      <p className="text-moonbeam italic mb-8">"{randomHoroscope}"</p>
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <button
          onClick={() => setMode('sender')}
          className="w-full md:w-auto text-lg bg-nebula hover:bg-opacity-80 transition-all duration-300 text-starlight font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105"
        >
          Send File
        </button>
        <button
          onClick={() => setMode('receiver')}
          className="w-full md:w-auto text-lg bg-comet hover:bg-opacity-80 transition-all duration-300 text-space-dark font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105"
        >
          Receive File
        </button>
      </div>
    </div>
  );
};
