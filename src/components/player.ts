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

export class Player extends DynamicComponent<IconMesh> {
  private i = 0;

  constructor(){
    super(new IconMesh(), Tag.Player);
  }

  update(sceneMgr: SceneManager, input: InputManager): void {
    this.object.rotation.y += 0.02;
    const raw = input.swipeVector.clone();
    const rotated = raw.rotateAround(new Vector2(0, 0), -Math.PI/4);
    const normalizedSwipe = new Vector3(rotated.x, 0, rotated.y).normalize();
    const scaledDownSwipe = normalizedSwipe.multiplyScalar(0.1);
    this.object.position.add(scaledDownSwipe);
  }
}
