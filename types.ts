
export type Route = 'transfer' | 'history';

export type ZodiacName = 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export interface ZodiacSign {
  name: ZodiacName;
  symbol: string;
}

export interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate';
  sdp?: string;
  candidate?: RTCIceCandidateInit | null;
}

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
}

export interface TransferHistoryEntry {
  id: string;
  role: 'sender' | 'receiver';
  fileName: string;
  fileSize: number;
  status: 'completed' | 'failed';
  timestamp: number;
  zodiacName: ZodiacName;
}

export enum ConnectionStatus {
    IDLE,
    CONNECTING,
    CONNECTED,
    TRANSFERRING,
    COMPLETED,
    FAILED,
    CLOSED
}