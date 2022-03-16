import { Camera, Scene } from "three";
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
  }

  get camera(): Camera {
    return this.config.camera!.object;
  }
}
