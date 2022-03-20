import { Camera, Object3D, Raycaster, Scene, Vector2, Vector3 } from "three";
import { Npc } from "../components/npc";
import { Player } from "../components/player";
import { Tag } from "../tags";
import { RawVector3 } from "../types";
import { ComponentBase, EventfulComponent } from "./component";
import { InputManager } from "./input-manager";
import { SceneConfiguration } from "./scene-configuration";

export class SceneManager {

  scene: Scene;
  config: SceneConfiguration;
  raycaster: Raycaster;
  playerRef: Player;
  
  constructor(config: SceneConfiguration){
    this.config = config;
    this.raycaster = new Raycaster();
    this.scene = new Scene();
    this.scene.fog = this.config.fog ?? null;
    this.scene.add(...this.config.static.map(x => x.object));
    this.scene.add(...this.config.dynamic.map(x => x.object));
    this.playerRef = this.config.dynamic.find(x => x.tags.has(Tag.Player)) as Player;
  }

  update(input: InputManager){
    for (const obj of this.config.dynamic){
      obj.update(this, input);
    }
    this.config.camera?.update(this, input);
    this.updateClick(input);
  }

  updateClick(input: InputManager) {
    if (input.clickLocation){
      const dims = input.meta.screen;
      const normalized = new Vector2(
        (input.clickLocation.x / dims.width) * 2 - 1,
        -(input.clickLocation.y / dims.height) * 2 + 1,
      );
      input.clickLocation = undefined;

      this.raycaster.setFromCamera(normalized, this.camera);
      const objs = (this.config.dynamic as ComponentBase<Object3D>[]).concat(this.config.static)
        .filter(x => x.tags.has(Tag.Event))
        .map(x => x.object);
      const [intersected] = this.raycaster.intersectObjects(objs, false);
      if (!intersected) return;
      (intersected.object.userData.component as EventfulComponent).onClick();
    }
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
