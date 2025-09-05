
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StarryBackground } from './components/StarryBackground';
import { SignalingMessage, Route } from './types';
import { AppBar } from './components/AppBar';
import { Transfer } from './components/Transfer';
import { History } from './components/History';

const App: React.FC = () => {
  const [route, setRoute] = useState<Route>('transfer');
  const [initialSessionId, setInitialSessionId] = useState<string | null>(null);
  // WebSocket signaling client
  const wsRef = useRef<WebSocket | null>(null);
  const [wsReady, setWsReady] = useState(false);
  const [wsError, setWsError] = useState<string | null>(null);
  const signalingBuffer = useRef<Record<string, SignalingMessage[]>>({});

  useEffect(() => {
    // Connect to signaling server
    if (!wsRef.current) {
      console.log('Connecting to signaling server at ws://localhost:8080...');
      const ws = new window.WebSocket('ws://localhost:8080');
      wsRef.current = ws;
      
      ws.onopen = () => {
        console.log('✅ WebSocket connected to signaling server');
        setWsReady(true);
        setWsError(null);
      };
      
      ws.onclose = (event) => {
        console.log('❌ WebSocket disconnected:', event.code, event.reason);
        setWsReady(false);
        if (event.code !== 1000) {
          setWsError(`Connection closed unexpectedly (${event.code})`);
        }
      };
      
      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setWsReady(false);
        setWsError('Failed to connect to signaling server. Make sure it\'s running on port 8080.');
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 Received signaling message:', data);
          
          if (data.type === 'error') {
            console.error('Server error:', data.error);
            setWsError(`Server error: ${data.error}`);
          } else if (data.type === 'signal' && data.message && data.sessionId) {
            if (!signalingBuffer.current[data.sessionId]) {
              signalingBuffer.current[data.sessionId] = [];
            }
            signalingBuffer.current[data.sessionId].push(data.message);
          }
        } catch (err) {
          console.error('Failed to parse signaling message:', err);
        }
      };
    }
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash === 'history') {
        setRoute('history');
      } else {
        setRoute('transfer');
      }
    };

    window.addEventListener('hashchange', handleHashChange, false);
    
    // Initial load check
    handleHashChange();

    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get('session');
    if (session) {
      setInitialSessionId(session);
      // Ensure user is on transfer page when joining via link
      window.location.hash = '#/transfer';
      setRoute('transfer');
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // WebSocket signaling logic
  const sendSignalingMessage = useCallback((sessionId: string, message: SignalingMessage) => {
    if (wsRef.current && wsReady) {
      console.log('📤 Sending signaling message for session:', sessionId, message);
      wsRef.current.send(JSON.stringify({ type: 'signal', sessionId, message }));
    } else {
      console.warn('⚠️ Cannot send signaling message - WebSocket not ready');
      setWsError('Connection to signaling server not ready');
    }
  }, [wsReady]);

  // Join session function for receivers
  const joinSession = useCallback((sessionId: string) => {
    if (wsRef.current && wsReady) {
      console.log('🔗 Joining session:', sessionId);
      wsRef.current.send(JSON.stringify({ type: 'join', sessionId }));
    }
  }, [wsReady]);

  const getSignalingMessages = useCallback((sessionId: string, fromIndex: number): SignalingMessage[] => {
    return (signalingBuffer.current[sessionId] || []).slice(fromIndex);
  }, []);
  
  const handleNavigate = (newRoute: Route) => {
      window.location.hash = `#/${newRoute}`;
  };

  const renderContent = () => {
    switch (route) {
      case 'history':
        return <History />;
      case 'transfer':
      default:
        return <Transfer 
          sendSignalingMessage={sendSignalingMessage}
          getSignalingMessages={getSignalingMessages}
          joinSession={joinSession}
          initialSessionId={initialSessionId}
          key={initialSessionId || 'home'} // Force re-mount if session id changes
        />;
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center p-4 overflow-hidden">
      <StarryBackground />
      <div className="relative z-10 w-full max-w-4xl text-center">
        <AppBar onNavigate={handleNavigate} currentRoute={route} />
        <main className="w-full bg-space-light/50 backdrop-blur-md rounded-xl shadow-2xl shadow-nebula/20 p-6 md:p-10 border border-space-mid">
          {wsError && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
              <p className="font-semibold">Connection Error:</p>
              <p>{wsError}</p>
              <p className="text-sm mt-2">Make sure the signaling server is running: <code>cd server && npm start</code></p>
            </div>
          )}
          {!wsReady && !wsError && (
            <div className="mb-4 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-200">
              <p>Connecting to signaling server...</p>
            </div>
          )}
          {wsReady && (
            <div className="mb-4 p-2 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm">
              ✅ Connected to signaling server
            </div>
          )}
          {renderContent()}
        </main>
        <footer className="mt-8 text-moonbeam/70 text-sm animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <p>&copy; {new Date().getFullYear()} AstroBeam. Files are transferred directly and are never stored on a server.</p>
        </footer>
      </div>
    </div>
  );
};


export default App;