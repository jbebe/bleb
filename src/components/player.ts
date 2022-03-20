import { TextureLoader } from "expo-three";
import { BoxBufferGeometry, Mesh, MeshStandardMaterial, Scene, Vector2, Vector3 } from "three";
import { DynamicComponent, EventfulComponent } from "../engine/component";
import { InputManager } from "../engine/input-manager";
import { SceneManager } from "../engine/scene-manager";
import { Synchronizer } from "../engine/synchronizer";
import { Tag } from "../tags";
import { Npc } from "./npc";

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

export class Player extends DynamicComponent<IconMesh> implements EventfulComponent {
  
  synchronizer: Synchronizer
  prevPos: Vector3 = new Vector3()

  constructor(playerId: number, synchronizer: Synchronizer){
    super(new IconMesh(), Tag.Player, Tag.Event);
    this.synchronizer = synchronizer;
    this.synchronizer.addPlayer(playerId);
  }

  update(sceneMgr: SceneManager, input: InputManager): void {
    this.object.rotation.y += 0.02;
    
    if (!input.swipeVector) return;
    
    const raw = input.swipeVector.clone();
    const rotated = raw.rotateAround(new Vector2(0, 0), -Math.PI/4);
    const normalizedSwipe = new Vector3(rotated.x, 0, rotated.y).normalize();
    const scaledDownSwipe = normalizedSwipe.multiplyScalar(0.1);
    this.object.position.add(scaledDownSwipe);
    if (!this.prevPos.equals(this.object.position)){
      this.synchronizer.movePlayer(this.object.id, this.object.position);
      this.prevPos = this.object.position.clone();
    }
  }

  onClick(){
    console.log('player says: ', this.object.position.toArray());
  }
}
