import { Vector3 } from "three";
import { wsUrl } from "../config";
import { Message, MessageType, MovePlayerMessage, NewPlayerMessage } from "../types";
import { SceneManager } from "./scene-manager";
import { throttle } from 'throttle-debounce';

export type User = {
  name: string,
  id: number,
};

export class Synchronizer {
  private ws: WebSocket;
  private user: User;
  private sceneManager?: SceneManager;
  
  public readonly movePlayer: throttle<(position: Vector3) => void>;

  private constructor(user: User){
    this.user = user;
    this.ws = new WebSocket(`${wsUrl}?userId=${this.user.id}`);
    this.movePlayer = throttle(100, false, (position: Vector3) => {
      console.log(`move player to ${position}`);
      const movePlayer: MovePlayerMessage = { 
        type: MessageType.MovePlayer,
        playerId: this.user.id,
        position: {
          x: position.x,
          y: position.y,
          z: position.z,
        }
      }
      this.ws.send(JSON.stringify(movePlayer));
    });
  }

  static async createAsync(user: User): Promise<Synchronizer> {
    return await new Promise((resolve) => {
      const s = new Synchronizer(user);
      s.ws.addEventListener('open', () => {
        s.ws.addEventListener('message', event => {
          console.log('received: %s', event.data);
          const message = JSON.parse(event.data) as Message;
          s.onMessage(message);
        });
      });
      s.ws.addEventListener('open', (evt) => {
        resolve(s);
      });
    });
  }

  onMessage(message: Message) {
    switch (message.type){
      case MessageType.NewPlayer:
        this.sceneManager?.addNpc((message as NewPlayerMessage).playerId);
        break;
      case MessageType.MovePlayer:
        const movePlayer = message as MovePlayerMessage;
        this.sceneManager?.moveNpc(movePlayer.playerId, movePlayer.position);
        break;
      default: throw new Error(`Invalid type ${message.type}`);
    }
  }

  async startAsync(sceneManager: SceneManager){
    this.sceneManager = sceneManager;
  }

  addPlayer(){
    const newPlayer: NewPlayerMessage = { 
      type: MessageType.NewPlayer,
      playerId: this.user.id,
    }
    this.ws.send(JSON.stringify(newPlayer));
  }
}