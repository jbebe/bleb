import { Server } from 'http';
import WebSocket from "ws";
import { Synchronizer } from './synchronizer';

export function initWebsocket(server: Server, synchronizer: Synchronizer){
  const wss = new WebSocket.Server({ 
    server,
    path: "/ws",
  });

  synchronizer.wss = wss;

  wss.on('connection', (ws, req) => {
    const url = new URL(`http://localhost${req.url}`);
    const userId = url.searchParams.get('userId');
    console.log(`user connected (id:${userId})`);
    synchronizer.onConnection(userId, ws);
    
    ws.on('message', (message: Buffer) => {
      console.log('received: %s', message);
      const obj = JSON.parse(message.toString('utf8'));
      synchronizer.onMessage(userId, obj);
    });

    ws.on('close', () => {
      console.log('client closed');
      synchronizer.onClose(userId);
    });
  });
}
