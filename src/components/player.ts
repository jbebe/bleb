import { TextureLoader } from "expo-three";
import { BoxBufferGeometry, Mesh, MeshStandardMaterial, Scene } from "three";
import { DynamicComponent } from "../engine/component";
import { Tag } from "../tags";

class IconMesh extends Mesh {
  constructor() {
    super(
      new BoxBufferGeometry(1.0, 2.0, 1.0),
      new MeshStandardMaterial({ 
        map: new TextureLoader().load(require('../../assets/icon.jpg'))
      }),
    );
  }
}

export class Player extends DynamicComponent<IconMesh> {
  constructor(){
    super(new IconMesh(), Tag.Player);
  }

  update(scene: Scene): void {
    this.object.rotation.z += 0.025;
    this.object.rotation.y += 0.05;
    this.object.rotation.x += 0.025;
  }
}
