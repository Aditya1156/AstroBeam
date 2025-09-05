import React, { useState, useEffect } from 'react';
import { useAstroBeam } from '../hooks/useAstroBeam';
import { SignalingMessage, FileMetadata, ConnectionStatus } from '../types';
import { ZodiacDisplay } from './ZodiacDisplay';
import { TransferProgress } from './TransferProgress';

interface ReceiverProps {
  sendSignalingMessage: (sessionId: string, message: SignalingMessage) => void;
  getSignalingMessages: (sessionId: string, fromIndex: number) => SignalingMessage[];
  joinSession: (sessionId: string) => void;
  onComplete: () => void;
  initialSessionId?: string | null;
}

export const Receiver: React.FC<ReceiverProps> = ({ sendSignalingMessage, getSignalingMessages, joinSession, onComplete, initialSessionId }) => {
  const [code, setCode] = useState(initialSessionId || '');
  const [submittedCode, setSubmittedCode] = useState<string | null>(initialSessionId || null);

  const {
    zodiac,
    status,
    progress,
    error,
    fileMetadata,
    receivedFile,
    startReceiving,
  } = useAstroBeam({
    role: 'receiver',
    sessionId: submittedCode || undefined,
    sendSignalingMessage,
    getSignalingMessages,
    joinSession,
  });
  
  useEffect(() => {
    if (submittedCode) {
      startReceiving();
    }
  }, [submittedCode, startReceiving]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      setSubmittedCode(code.trim().toLowerCase());
    }
  };

  const handleDownload = () => {
    if (receivedFile && fileMetadata) {
        const url = URL.createObjectURL(receivedFile);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileMetadata.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
  };
  
  if (status === ConnectionStatus.COMPLETED && receivedFile && fileMetadata) {
     return (
      <div className="text-center animate-fadeIn flex flex-col items-center">
        <ZodiacDisplay zodiac={zodiac} />
        <h2 className="text-2xl font-semibold text-starlight mt-4">File Received!</h2>
        <p className="text-moonbeam mt-1 truncate w-full max-w-sm">{fileMetadata.name}</p>
        <div className="w-full mt-4"><TransferProgress progress={100} /></div>
        <button onClick={handleDownload} className="mt-6 bg-comet hover:bg-opacity-80 transition-colors text-space-dark font-bold py-3 px-8 rounded-lg text-lg">
          Download File
        </button>
        <button onClick={onComplete} className="mt-4 text-moonbeam hover:text-starlight transition-colors">
          Receive another
        </button>
      </div>
    );
  }

  if (status >= ConnectionStatus.CONNECTING && fileMetadata) {
      return (
        <div className="text-center animate-fadeIn flex flex-col items-center">
             <ZodiacDisplay zodiac={zodiac} />
             <h2 className="text-2xl font-semibold text-starlight mt-4">Receiving File...</h2>
             <p className="text-moonbeam mt-1 truncate w-full max-w-sm">{fileMetadata.name} ({Math.round(fileMetadata.size / 1024 / 1024 * 100) / 100} MB)</p>
             <div className="w-full mt-4">
                <TransferProgress progress={progress} />
             </div>
             <p className="mt-4 text-moonbeam">{status === ConnectionStatus.CONNECTING ? 'Connecting to sender...' : 'Receiving data...'}</p>
             {error && <p className="text-red-400 mt-2">{error}</p>}
        </div>
      );
  }
  
  if (submittedCode) {
       return (
        <div className="text-center animate-fadeIn flex flex-col items-center">
             <h2 className="text-2xl font-semibold text-starlight mt-4">Connecting to Constellation...</h2>
             <p className="mt-4 text-moonbeam animate-pulse">Attempting to establish a beam with code: <span className="font-bold text-comet">{submittedCode}</span></p>
             {error && <p className="text-red-400 mt-2">{error}</p>}
        </div>
      );
  }

  return (
    <div className="animate-fadeIn">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label htmlFor="code" className="text-moonbeam">Enter Session Code:</label>
        <input
          id="code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g., leo-a4b8"
          className="bg-space-dark text-center text-xl text-comet p-3 rounded-lg border-2 border-space-mid focus:border-comet focus:outline-none focus:ring-2 focus:ring-comet/50 transition-colors"
          required
        />
        <button type="submit" className="w-full text-lg bg-nebula hover:bg-opacity-80 transition-all duration-300 text-starlight font-bold py-3 px-8 rounded-lg shadow-lg">
          Connect
        </button>
         {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
      </form>
    </div>
  );
};