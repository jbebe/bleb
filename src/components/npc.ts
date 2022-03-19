import { TextureLoader } from "expo-three";
import { BoxBufferGeometry, Mesh, MeshStandardMaterial, Scene, SphereBufferGeometry, Vector2, Vector3 } from "three";
import { DynamicComponent } from "../engine/component";
import { InputManager } from "../engine/input-manager";
import { SceneManager } from "../engine/scene-manager";
import { Tag } from "../tags";

class NpcMesh extends Mesh {
  constructor(){
    super(
      new SphereBufferGeometry(0.6, 10, 10),
      new MeshStandardMaterial({ 
        color: 0xff0000,
      }),
    );
    this.castShadow = true;
    this.position.set(0, 0.5, 0);
  }
}

export class Npc extends DynamicComponent<NpcMesh> {
  fadeIter: number;
  targetPosition?: Vector3;

  constructor(playerId: number){
    super(new NpcMesh(), Tag.Npc);
    this.props.set('playerid', playerId);
    this.targetPosition = this.object.position;
    this.fadeIter = 0;
  }

  update(sceneMgr: SceneManager, input: InputManager): void {
    if (!this.targetPosition) return;

    const newPos = this.object.position.clone();
    newPos.lerp(this.targetPosition, this.fadeIter);
    this.object.position.set(newPos.x, newPos.y, newPos.z);
    this.fadeIter += 0.00005;
    if (this.fadeIter >= 1){
      this.fadeIter = 0;
      this.targetPosition = undefined;
    }
  }
}
