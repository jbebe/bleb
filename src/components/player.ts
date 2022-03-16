import { TextureLoader } from "expo-three";
import { BoxBufferGeometry, Mesh, MeshStandardMaterial, Scene, Vector3 } from "three";
import { DynamicComponent } from "../engine/component";
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

  update(scene: Scene): void {
    this.object.rotation.y += 0.05;
    this.object.position.setX(Math.sin(this.i)*2);
    this.i += 0.05;
  }
}
