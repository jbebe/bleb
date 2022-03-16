import { TextureLoader } from "expo-three";
import { DoubleSide, Mesh, MeshStandardMaterial, PlaneGeometry, Side } from "three";
import { StaticComponent } from "../engine/component";

export class Floor extends StaticComponent<Mesh> {
  constructor(){
    super(new Mesh(
      new PlaneGeometry(20, 20),
      new MeshStandardMaterial({ 
        map: new TextureLoader().load(require('../../assets/floor-tile.png')),
      }),
    ));
    this.object.receiveShadow = true;
    this.object.rotateX(-Math.PI/2);
  }
}
