import { Server } from 'http';
import WebSocket from "ws";

export function initWebsocket(server: Server, port: string){
  const wss = new WebSocket.Server({ 
    server,
    path: "/ws",
  });

  wss.on('connection', (ws, req) => {
    console.log('client connected');
    ws.on('message', (message: Buffer) => {
      console.log('received: %s', message);
    });

    ws.on('close', () => {
      console.log('client closed');
    });
  });
}
