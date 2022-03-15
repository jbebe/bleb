import { Object3D, PerspectiveCamera, Scene, Vector3 } from "three";
import { DynamicComponent } from "../engine/component";
import { Tag } from "../tags";

export class SimpleFollowerCamera extends DynamicComponent<PerspectiveCamera> {
  static Fov = 70;
  static Near = 0.01;
  static Far = 1000;

  playerRef: Object3D;

  constructor(player: Object3D, aspectRatio: number){
    super(new PerspectiveCamera(
      SimpleFollowerCamera.Fov, 
      aspectRatio, 
      SimpleFollowerCamera.Near,
      SimpleFollowerCamera.Far));
    this.tags.add(Tag.Camera);
    this.playerRef = player;
    const startPosition = new Vector3(
      this.playerRef.position.x + 5,
      this.playerRef.position.y + 10,
      this.playerRef.position.z + 5,
    );
    this.object.position.set(startPosition.x, startPosition.y, startPosition.z);
  }

  update(scene: Scene): void {
    this.object.lookAt(this.playerRef.position);
  }
}
