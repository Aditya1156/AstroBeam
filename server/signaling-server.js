// Simple WebSocket signaling server for AstroBeam
import { WebSocketServer } from 'ws';
const PORT = process.env.PORT || 8080;

const wss = new WebSocketServer({ port: PORT });

// Map sessionId => [ws, ws, ...]
const sessions = new Map();

wss.on('connection', (ws) => {
  let sessionId = null;
  console.log('🔗 New WebSocket connection established');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('📨 Received message:', data);
      
      if (!data.type) {
        ws.send(JSON.stringify({ type: 'error', error: 'Missing message type.' }));
        return;
      }
      if (data.type === 'join') {
        if (!data.sessionId || typeof data.sessionId !== 'string') {
          ws.send(JSON.stringify({ type: 'error', error: 'Invalid or missing sessionId.' }));
          return;
        }
        sessionId = data.sessionId;
        if (!sessions.has(sessionId)) {
          sessions.set(sessionId, []);
        }
        sessions.get(sessionId).push(ws);
        console.log(`✅ Client joined session: ${sessionId} (${sessions.get(sessionId).length} peers)`);
        ws.send(JSON.stringify({ type: 'joined', sessionId }));
      } else if (sessionId && data.type === 'signal') {
        if (!data.message) {
          ws.send(JSON.stringify({ type: 'error', error: 'Missing signaling message.' }));
          return;
        }
        // Relay signaling message to all other peers in session
        const peers = sessions.get(sessionId) || [];
        let sent = false;
        peers.forEach(peer => {
          if (peer !== ws && peer.readyState === WebSocket.OPEN) {
            peer.send(JSON.stringify({ type: 'signal', message: data.message, sessionId }));
            sent = true;
          }
        });
        console.log(`📤 Relayed signal for session ${sessionId} to ${sent ? 'peer' : 'no peers'}`);
        if (!sent) {
          ws.send(JSON.stringify({ type: 'error', error: 'No other peer connected to this session.' }));
        }
      } else {
        ws.send(JSON.stringify({ type: 'error', error: 'Unknown message type or session not joined.' }));
      }
    } catch (err) {
      console.error('❌ Error processing message:', err);
      ws.send(JSON.stringify({ type: 'error', error: 'Invalid message format. ' + err.message }));
    }
  });

  ws.on('close', () => {
    console.log(`🔌 WebSocket disconnected from session: ${sessionId || 'none'}`);
    if (sessionId && sessions.has(sessionId)) {
      const peers = sessions.get(sessionId).filter(peer => peer !== ws);
      if (peers.length > 0) {
        sessions.set(sessionId, peers);
        console.log(`📊 Session ${sessionId} now has ${peers.length} peers`);
      } else {
        sessions.delete(sessionId);
        console.log(`🗑️ Session ${sessionId} deleted (no peers left)`);
      }
    }
  });

  ws.on('error', (err) => {
    console.error('❌ WebSocket error:', err);
    try {
      ws.send(JSON.stringify({ type: 'error', error: 'WebSocket error: ' + err.message }));
    } catch {}
  });
});

console.log(`AstroBeam signaling server running on port ${PORT}`);
