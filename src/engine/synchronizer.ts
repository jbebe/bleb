import { wsUrl } from "../config";
import { SceneManager } from "./scene-manager";

export type User = {
  name: string,
  id: number,
};

export class Synchronizer {
  ws: WebSocket;

  constructor(user: User){
    this.ws = new WebSocket(`${wsUrl}?userId=${user.id}`);
    this.ws.addEventListener('open', () => {
      this.ws.addEventListener('message', event => {
        console.log('received: %s', event.data);
      });
    });
  }

  async startAsync(sceneManager: SceneManager){
    
  }
}