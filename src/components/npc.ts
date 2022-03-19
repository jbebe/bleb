import { TextureLoader } from "expo-three";
import { BoxBufferGeometry, Mesh, MeshStandardMaterial, Scene, Vector2, Vector3 } from "three";
import { DynamicComponent } from "../engine/component";
import { InputManager } from "../engine/input-manager";
import { SceneManager } from "../engine/scene-manager";
import { Tag } from "../tags";

class IconMesh extends Mesh {
  constructor() {
    super(
      new BoxBufferGeometry(1.0, 1.0, 1.0),
      new MeshStandardMaterial({ 
        map: new TextureLoader().load(require('../../assets/icon.jpg'))
      }),
    );
    this.castShadow = true;
    this.position.set(0, 0.5, 0);
  }
}

export class Npc extends DynamicComponent<IconMesh> {
  constructor(playerId: number){
    super(new IconMesh(), Tag.Npc);
    this.props.set('playerid', playerId);
  }

  update(sceneMgr: SceneManager, input: InputManager): void {}
}
