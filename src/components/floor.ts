import { TextureLoader } from "expo-three";
import { DoubleSide, Mesh, MeshStandardMaterial, PlaneGeometry, RepeatWrapping, Side, Vector2 } from "three";
import { StaticComponent } from "../engine/component";

export class Floor extends StaticComponent<Mesh> {
  constructor(){
    const texture = new TextureLoader().load(require('../../assets/floor-tile.png'));
    texture.repeat = new Vector2(100, 100);
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    super(new Mesh(
      new PlaneGeometry(1000, 1000),
      new MeshStandardMaterial({ 
        map: texture,
      }),
    ));
    this.object.receiveShadow = true;
    this.object.rotateX(-Math.PI/2);
  }
}
