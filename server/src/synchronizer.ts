import { WebSocket, WebSocketServer } from "ws";
import { Message, MessageType, NewPlayerMessage } from '../../src/types';

type User = {
  userId: string
  ws: WebSocket  
}

export class Synchronizer {
  
  wss: WebSocketServer;
  users = new Map<string, User>();

  constructor(){}

  onConnection(userId: string, ws: WebSocket) {
    const userData = { userId, ws };
    this.users.set(userId, userData);
    for (const [uId] of this.users){
      if (uId === userId) continue;
      ws.send(JSON.stringify([{
        type: MessageType.NewPlayer,
        playerId: +uId,
      } as NewPlayerMessage]))
    }
  }

  onMessage(userId: string, messages: Message[]) {
    this.sendOthers(userId, messages);
    /*switch (message.type){
      case MessageType.NewPlayer:
        console.log('New user created');
        this.sendOthers(userId, message);
        break;
      case MessageType.MovePlayer:
        console.log('User moved');
        this.sendOthers(userId, message);
        break;
      default: throw new Error(`Invalid type ${message.type}`);
    }*/
  }

  onClose(userId: string) {
    this.users.delete(userId);
    // TODO: warn users if someone left?
  }

  sendOthers(userId: string, messages: Message[]){
    for (const [otherUserId, userData] of this.users){
      if (otherUserId !== userId){
        console.log(`Send message to ${userId}`);
        userData.ws.send(JSON.stringify(messages));
      }
    }
  }
}