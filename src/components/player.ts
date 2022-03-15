import { TextureLoader, loadTextureAsync } from "expo-three";
import { BoxBufferGeometry, Mesh, MeshStandardMaterial, Scene } from "three";
import { DynamicComponent } from "../engine/component";
import { Tag } from "../tags";

class IconMesh extends Mesh {
  constructor() {
    const icon = new TextureLoader().load(require('../../assets/icon.jpg'), (tex) => {
      console.log('texture updated!');
      this.material = new MeshStandardMaterial({
        map: tex
      });
    });
    super(
      new BoxBufferGeometry(1.0, 1.0, 1.0),
      new MeshStandardMaterial({ map: icon }),
    );
  }
}

export class Player extends DynamicComponent<IconMesh> {
  constructor(){
    super(new IconMesh(), Tag.Player);
  }

  update(scene: Scene): void {
    this.object.rotation.y += 0.05;
    this.object.rotation.x += 0.025;
  }
}
