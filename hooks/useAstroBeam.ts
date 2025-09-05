
import { useState, useEffect, useRef, useCallback } from 'react';
import { ZODIAC_SIGNS, CHUNK_SIZE } from '../constants';
import { SignalingMessage, FileMetadata, ZodiacSign, ConnectionStatus, TransferHistoryEntry } from '../types';

interface UseAstroBeamProps {
  role: 'sender' | 'receiver';
  sessionId?: string;
  sendSignalingMessage: (sessionId: string, message: SignalingMessage) => void;
  getSignalingMessages: (sessionId: string, fromIndex: number) => SignalingMessage[];
  joinSession: (sessionId: string) => void;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export const useAstroBeam = ({ role, sessionId: propSessionId, sendSignalingMessage, getSignalingMessages, joinSession }: UseAstroBeamProps) => {
  const [sessionId, setSessionId] = useState<string | null>(propSessionId || null);
  const [zodiac, setZodiac] = useState<ZodiacSign | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.IDLE);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fileMetadata, setFileMetadata] = useState<FileMetadata | null>(null);
  const [receivedFile, setReceivedFile] = useState<Blob | null>(null);
  const [file, setFile] = useState<File | null>(null); // For sender history

  const pc = useRef<RTCPeerConnection | null>(null);
  const dc = useRef<RTCDataChannel | null>(null);
  const receivedBuffers = useRef<ArrayBuffer[]>([]);
  const signalingPollIndex = useRef(0);
  const candidateQueue = useRef<RTCIceCandidateInit[]>([]);

  const generateSessionId = useCallback(() => {
    const randomZodiac = ZODIAC_SIGNS[Math.floor(Math.random() * ZODIAC_SIGNS.length)];
    const randomId = Math.random().toString(36).substring(2, 6);
    return {
      id: `${randomZodiac.name.toLowerCase()}-${randomId}`,
      zodiac: randomZodiac,
    };
  }, []);

  const closeConnection = useCallback(() => {
    dc.current?.close();
    pc.current?.close();
    pc.current = null;
    dc.current = null;
    receivedBuffers.current = [];
    candidateQueue.current = [];
    setStatus(ConnectionStatus.CLOSED);
    setError(null);
    setProgress(0);
  }, []);

  // Save to history on completion or failure
  useEffect(() => {
    if ((status === ConnectionStatus.COMPLETED || status === ConnectionStatus.FAILED) && sessionId && zodiac) {
      const isReadyToSave = (role === 'sender' && file) || (role === 'receiver' && fileMetadata);
      if (isReadyToSave) {
        try {
          const history = JSON.parse(localStorage.getItem('astrobeam-history') || '[]') as TransferHistoryEntry[];
          const entry: TransferHistoryEntry = {
            id: sessionId,
            role,
            fileName: (role === 'sender' ? file!.name : fileMetadata!.name),
            fileSize: (role === 'sender' ? file!.size : fileMetadata!.size),
            status: status === ConnectionStatus.COMPLETED ? 'completed' : 'failed',
            timestamp: Date.now(),
            zodiacName: zodiac.name,
          };
          
          const existingIndex = history.findIndex(h => h.id === entry.id);
          if (existingIndex > -1) {
            history[existingIndex] = entry;
          } else {
            history.unshift(entry); // Add new entries to the top
          }
          localStorage.setItem('astrobeam-history', JSON.stringify(history));
        } catch (e) {
          console.error("Could not save to history:", e);
        }
      }
    }
  }, [status, sessionId, zodiac, role, file, fileMetadata]);

  const setupDataChannelListeners = useCallback((dataChannel: RTCDataChannel) => {
    dataChannel.onopen = () => {
      setStatus(ConnectionStatus.CONNECTED);
      setError(null);
    };
    dataChannel.onclose = () => closeConnection();
    dataChannel.onerror = (e) => {
      setError(`Data channel error: ${e.type}`);
      setStatus(ConnectionStatus.FAILED);
      closeConnection();
    };
    dataChannel.onmessage = (event) => {
      try {
        if (typeof event.data === 'string') {
          const metadata: FileMetadata = JSON.parse(event.data);
          setFileMetadata(metadata);
          receivedBuffers.current = [];
          setProgress(0);
          setStatus(ConnectionStatus.TRANSFERRING);
        } else {
          receivedBuffers.current.push(event.data);
          if (fileMetadata) {
            const receivedSize = receivedBuffers.current.reduce((acc, chunk) => acc + chunk.byteLength, 0);
            const currentProgress = (receivedSize / fileMetadata.size) * 100;
            setProgress(currentProgress);

            if (receivedSize === fileMetadata.size) {
              const fileBlob = new Blob(receivedBuffers.current, { type: fileMetadata.type });
              setReceivedFile(fileBlob);
              setStatus(ConnectionStatus.COMPLETED);
              dc.current?.send('transfer_complete');
              // Don't close connection here, wait for onclose event
            }
          }
        }
      } catch(err) {
        setError("Failed to process incoming data.");
        setStatus(ConnectionStatus.FAILED);
        closeConnection();
      }
    };
  }, [fileMetadata, closeConnection]);

  const startSending = useCallback((fileToSend: File) => {
    if (dc.current?.readyState !== 'open') {
        setError("Connection not open. Cannot send file.");
        return;
    }
    setFile(fileToSend); // Save file for history
    setStatus(ConnectionStatus.TRANSFERRING);
    
    const metadata: FileMetadata = { name: fileToSend.name, size: fileToSend.size, type: fileToSend.type };
    dc.current.send(JSON.stringify(metadata));

    let offset = 0;
    const reader = new FileReader();

    reader.onload = (e) => {
        if (e.target?.result && dc.current?.readyState === 'open') {
            try {
                dc.current.send(e.target.result as ArrayBuffer);
                offset += (e.target.result as ArrayBuffer).byteLength;
                const currentProgress = (offset / fileToSend.size) * 100;
                setProgress(currentProgress);

                if (offset < fileToSend.size) {
                    readSlice(offset);
                }
            } catch (error) {
                setError(`Failed to send file chunk. Please try again. ${error}`);
                setStatus(ConnectionStatus.FAILED);
                closeConnection();
            }
        }
    };
    
    reader.onerror = () => {
        setError('Error reading file.');
        setStatus(ConnectionStatus.FAILED);
        closeConnection();
    };

    const readSlice = (o: number) => {
      const slice = fileToSend.slice(o, o + CHUNK_SIZE);
      reader.readAsArrayBuffer(slice);
    };

    readSlice(0);
    
    dc.current.onmessage = (event) => {
        if (event.data === 'transfer_complete') {
            setStatus(ConnectionStatus.COMPLETED);
            closeConnection();
        }
    };

  }, [closeConnection]);


  const initializePeerConnection = useCallback(() => {
    if (pc.current) return pc.current;

    const peerConnection = new RTCPeerConnection(ICE_SERVERS);
    pc.current = peerConnection;
    setStatus(ConnectionStatus.CONNECTING);
    
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && sessionId) {
        sendSignalingMessage(sessionId, { type: 'ice-candidate', candidate: event.candidate.toJSON() });
      }
    };
    
    peerConnection.onconnectionstatechange = () => {
      switch (peerConnection.connectionState) {
        case 'connected':
          // Don't set status to connected here; wait for datachannel.onopen for reliability
          break;
        case 'disconnected':
        case 'closed':
          closeConnection();
          break;
        case 'failed':
          setError('Connection failed. Please check your network or session code.');
          setStatus(ConnectionStatus.FAILED);
          closeConnection();
          break;
      }
    };

    if (role === 'receiver') {
      peerConnection.ondatachannel = (event) => {
        dc.current = event.channel;
        setupDataChannelListeners(event.channel);
      };
    }
    
    return peerConnection;
  }, [role, sessionId, sendSignalingMessage, closeConnection, setupDataChannelListeners]);
  

  const createConnection = useCallback(async () => {
    const peerConnection = initializePeerConnection();
    if (role === 'sender') {
      const dataChannel = peerConnection.createDataChannel('file-transfer', { ordered: true });
      dc.current = dataChannel;
      setupDataChannelListeners(dataChannel);
      
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      if (sessionId) {
        sendSignalingMessage(sessionId, { type: 'offer', sdp: offer.sdp });
      }
    }
  }, [role, sessionId, sendSignalingMessage, initializePeerConnection, setupDataChannelListeners]);

  const startReceiving = useCallback(() => {
     initializePeerConnection();
  }, [initializePeerConnection]);

  // RECEIVER: Join session when sessionId is available
  useEffect(() => {
    if (role === 'receiver' && sessionId) {
      console.log('🔗 Receiver joining session:', sessionId);
      joinSession(sessionId);
    }
  }, [role, sessionId, joinSession]);

  // SENDER: Initialize session
  useEffect(() => {
    if (role === 'sender' && !sessionId) {
      const { id, zodiac } = generateSessionId();
      setSessionId(id);
      setZodiac(zodiac);
    }
  }, [role, sessionId, generateSessionId]);
  
  // SENDER: Create connection once session is ready
  useEffect(() => {
      if (role === 'sender' && sessionId && !pc.current) {
          joinSession(sessionId);
          createConnection();
      }
  }, [role, sessionId, createConnection, joinSession]);


  // POLL for signaling messages
  useEffect(() => {
    if (!sessionId || status === ConnectionStatus.COMPLETED || status === ConnectionStatus.CLOSED) {
      return;
    }

    const interval = setInterval(async () => {
      if (!pc.current) return; // Don't poll if PC isn't even initialized.
      const messages = getSignalingMessages(sessionId, signalingPollIndex.current);
      if (messages.length > 0) {
        signalingPollIndex.current += messages.length;
        
        for (const msg of messages) {
          const peerConnection = pc.current!;
          
          try {
             if (msg.type === 'offer' && role === 'receiver') {
                await peerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: msg.sdp }));
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                sendSignalingMessage(sessionId, { type: 'answer', sdp: answer.sdp });
                const zodiacName = sessionId.split('-')[0];
                const foundZodiac = ZODIAC_SIGNS.find(z => z.name.toLowerCase() === zodiacName);
                if (foundZodiac) setZodiac(foundZodiac);

                // Process any queued candidates
                while(candidateQueue.current.length > 0) {
                    const candidate = candidateQueue.current.shift();
                    if(candidate) await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                }

            } else if (msg.type === 'answer' && role === 'sender') {
                if (peerConnection.signalingState !== "have-local-offer") return;
                await peerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: msg.sdp }));

                // Process any queued candidates
                while(candidateQueue.current.length > 0) {
                    const candidate = candidateQueue.current.shift();
                    if(candidate) await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                }
            } else if (msg.type === 'ice-candidate' && msg.candidate) {
                if (peerConnection.remoteDescription) {
                    await peerConnection.addIceCandidate(new RTCIceCandidate(msg.candidate));
                } else {
                    candidateQueue.current.push(msg.candidate);
                }
            }
          } catch(e) {
            console.error('Signaling error:', e);
            const errorMessage = e instanceof Error ? e.message : String(e);
            setError(`Failed to process signaling message: ${errorMessage}`);
            setStatus(ConnectionStatus.FAILED);
            closeConnection();
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionId, status, getSignalingMessages, role, sendSignalingMessage, closeConnection]);


  return { sessionId, zodiac, status, progress, error, fileMetadata, receivedFile, startSending, startReceiving, closeConnection };
};
