import { Object3D, PerspectiveCamera, Scene, Vector3 } from "three";
import { DynamicComponent } from "../engine/component";
import { InputManager } from "../engine/input-manager";
import { SceneManager } from "../engine/scene-manager";
import { Tag } from "../tags";

export class SimpleFollowerCamera extends DynamicComponent<PerspectiveCamera> {
  static Fov = 70;
  static Near = 0.01;
  static Far = 1000;

  playerRef: Object3D;
  offset: Vector3;

  constructor(player: Object3D, aspectRatio: number, offset: Vector3){
    super(new PerspectiveCamera(
      SimpleFollowerCamera.Fov, 
      aspectRatio, 
      SimpleFollowerCamera.Near,
      SimpleFollowerCamera.Far));
    this.tags.add(Tag.Camera);
    this.playerRef = player;
    this.offset = offset;
    
    const playerPos = this.playerRef.position.clone();
    const startPosition = playerPos.add(offset);
    this.object.position.set(startPosition.x, startPosition.y, startPosition.z);
  }

  update(sceneMgr: SceneManager, input: InputManager): void {
    const playerPos = this.playerRef.position.clone();
    const pos = playerPos.add(this.offset);
    this.object.position.set(pos.x, pos.y, pos.z);
    this.object.lookAt(this.playerRef.position);
  }
}
