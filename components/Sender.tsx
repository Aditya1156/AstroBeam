import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useAstroBeam } from '../hooks/useAstroBeam';
import { SignalingMessage, ConnectionStatus } from '../types';
import { ZodiacDisplay } from './ZodiacDisplay';
import { TransferProgress } from './TransferProgress';

interface SenderProps {
  sendSignalingMessage: (sessionId: string, message: SignalingMessage) => void;
  getSignalingMessages: (sessionId: string, fromIndex: number) => SignalingMessage[];
  joinSession: (sessionId: string) => void;
  onComplete: () => void;
}

export const Sender: React.FC<SenderProps> = ({ sendSignalingMessage, getSignalingMessages, joinSession, onComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [showQr, setShowQr] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);


  const {
    sessionId,
    zodiac,
    status,
    progress,
    error,
    startSending,
  } = useAstroBeam({
    role: 'sender',
    sendSignalingMessage,
    getSignalingMessages,
    joinSession,
  });

  useEffect(() => {
    if (showQr && qrCanvasRef.current && sessionId) {
      const url = `${window.location.origin}${window.location.pathname}?session=${sessionId}`;
      QRCode.toCanvas(qrCanvasRef.current, url, {
        width: 220,
        margin: 2,
        color: {
          dark: '#f7b733', // comet
          light: '#0000', // transparent
        },
      }, (err) => {
        if (err) console.error(err);
      });
    }
  }, [showQr, sessionId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  
  useEffect(() => {
    if(file && status === ConnectionStatus.CONNECTED) {
        startSending(file);
    }
  }, [file, status, startSending]);

  const handleCopy = () => {
    if (sessionId) {
      navigator.clipboard.writeText(sessionId);
      alert('Session code copied to clipboard!');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  if (status === ConnectionStatus.COMPLETED) {
    return (
      <div className="text-center animate-fadeIn flex flex-col items-center">
        <ZodiacDisplay zodiac={zodiac} />
        <h2 className="text-2xl font-semibold text-starlight mt-4">Transfer Complete!</h2>
        <p className="text-moonbeam mt-2">Your file has been successfully beamed across the cosmos.</p>
         <div className="w-full mt-4"><TransferProgress progress={100} /></div>
        <button onClick={onComplete} className="mt-6 bg-nebula hover:bg-opacity-80 transition-colors text-white font-bold py-2 px-6 rounded-lg">
          Start a New Beam
        </button>
      </div>
    );
  }

  if (status >= ConnectionStatus.CONNECTING && file) {
    return (
        <div className="text-center animate-fadeIn flex flex-col items-center">
             <ZodiacDisplay zodiac={zodiac} />
             <h2 className="text-2xl font-semibold text-starlight mt-4">Transferring File...</h2>
             <p className="text-moonbeam mt-1 truncate w-full max-w-sm">{file.name} ({Math.round(file.size / 1024 / 1024 * 100) / 100} MB)</p>
             <div className="w-full mt-4">
                <TransferProgress progress={progress} />
             </div>
             <p className="mt-4 text-moonbeam">{status === ConnectionStatus.CONNECTING ? 'Waiting for receiver...' : 'Beaming data...'}</p>
             {error && <p className="text-red-400 mt-2">{error}</p>}
        </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div 
        className="w-full p-8 border-2 border-dashed border-moonbeam/50 rounded-lg text-center cursor-pointer hover:border-comet hover:bg-space-mid/30 transition-all duration-300"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        <p className="text-lg">
          {file ? `Selected: ${file.name}` : 'Drag & Drop a File or Click to Select'}
        </p>
        <p className="text-sm text-moonbeam/70">Files up to 4GB supported</p>
      </div>
      
      {sessionId && (
        <div className="mt-6 text-center">
          <p className="text-moonbeam mb-2">Share this code with the receiver:</p>
          <div className="flex justify-center items-center gap-2 bg-space-dark p-3 rounded-lg">
            <ZodiacDisplay zodiac={zodiac} small />
            <code className="text-2xl font-bold tracking-widest text-comet">{sessionId}</code>
            <button onClick={handleCopy} className="ml-2 p-2 rounded-md hover:bg-space-mid transition-colors" aria-label="Copy code">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2H6z" /></svg>
            </button>
            <button onClick={() => setShowQr(s => !s)} className="p-2 rounded-md hover:bg-space-mid transition-colors" aria-label="Show QR code">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 10a1 1 0 011-1h2a1 1 0 110 2H6a1 1 0 01-1-1zM3 14a1 1 0 011-1h2a1 1 0 110 2H4a1 1 0 01-1-1zm5-11a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H9a1 1 0 01-1-1V4zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V4zM9 9a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V9zm5 5a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                    <path d="M12 11a1 1 0 100 2h2a1 1 0 100-2h-2z" />
                </svg>
            </button>
          </div>
          {showQr && (
            <div className="mt-4 p-4 bg-space-light/50 rounded-lg inline-block animate-fadeIn">
              <canvas ref={qrCanvasRef} />
              <p className="text-moonbeam text-sm mt-2">Scan with another device to connect.</p>
            </div>
          )}
          <p className="mt-4 text-moonbeam animate-pulse">Waiting for receiver to connect...</p>
        </div>
      )}
      {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
    </div>
  );
};