import { Camera, Scene, Vector3 } from "three";
import { Npc } from "../components/npc";
import { RawVector3 } from "../types";
import { InputManager } from "./input-manager";
import { SceneConfiguration } from "./scene-configuration";

export class SceneManager {

  scene: Scene;
  config: SceneConfiguration
  
  constructor(config: SceneConfiguration){
    this.config = config;
    this.scene = new Scene();
    this.scene.fog = this.config.fog ?? null;
    this.scene.add(...this.config.static.map(x => x.object));
    this.scene.add(...this.config.dynamic.map(x => x.object));
  }

  update(input: InputManager){
    for (const obj of this.config.dynamic){
      obj.update(this, input);
    }
    this.config.camera?.update(this, input);
    //input.update()
  }

  get camera(): Camera {
    return this.config.camera!.object;
  }

  addNpc(playerId: number){
    const npc = new Npc(playerId);
    this.config.dynamic.push(npc);
    this.scene.add(npc.object);
  }
  
  moveNpc(playerId: number, position: RawVector3){
    const npc = this.config.dynamic.find(x => x.props.get('playerid') === playerId) as Npc;
    if (!npc) throw new Error(`Unknown npc with id: ${playerId}`);
    npc.targetPosition = new Vector3(position.x, position.y, position.z);
    //npc.object.position.set(position.x, position.y, position.z);
  }
}
