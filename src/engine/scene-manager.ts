import { Camera, Scene } from "three";
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

  update(){
    for (const obj of this.config.dynamic){
      obj.update(this.scene);
    }
    this.config.camera?.update(this.scene);
  }

  get camera(): Camera {
    return this.config.camera!.object;
  }
}
