import { Vector2, Vector3 } from "three";
import { InputManager } from "../engine/input-manager";
import { SceneManager } from "../engine/scene-manager";
import { Synchronizer } from "../engine/synchronizer";
import { Npc } from "./npc";

export class Player extends Npc {
  
  synchronizer: Synchronizer
  prevPos: Vector3 = new Vector3()

  constructor(playerId: number, synchronizer: Synchronizer){
    super(playerId);
    this.synchronizer = synchronizer;
    this.synchronizer.addPlayer();
  }

  update(sceneMgr: SceneManager, input: InputManager): void {
    this.object.rotation.y += 0.02;
    const raw = input.swipeVector.clone();
    const rotated = raw.rotateAround(new Vector2(0, 0), -Math.PI/4);
    const normalizedSwipe = new Vector3(rotated.x, 0, rotated.y).normalize();
    const scaledDownSwipe = normalizedSwipe.multiplyScalar(0.1);
    this.object.position.add(scaledDownSwipe);
    if (!this.prevPos.equals(this.object.position)){
      this.synchronizer.movePlayer(this.object.position);
    }
    this.prevPos = this.object.position.clone();
  }
}
