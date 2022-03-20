import { TextureLoader } from "expo-three";
import { BoxBufferGeometry, Mesh, MeshStandardMaterial, Scene, SphereBufferGeometry, Vector2, Vector3 } from "three";
import { DynamicComponent, EventfulComponent } from "../engine/component";
import { InputManager } from "../engine/input-manager";
import { SceneManager } from "../engine/scene-manager";
import { Tag } from "../tags";

class NpcMesh extends Mesh {
  constructor(){
    super(
      new SphereBufferGeometry(0.6, 10, 10),
      new MeshStandardMaterial({ 
        color: 0x00ff00,
      }),
    );
    this.castShadow = true;
    this.position.set(0, 0.5, 0);
  }
}

export class Debris extends DynamicComponent<NpcMesh> {
  constructor(pos: Vector2){
    super(new NpcMesh(), Tag.Npc);
    this.object.castShadow = true;
    this.object.position.setX(pos.x);
    this.object.position.setZ(pos.y);
  }
}
