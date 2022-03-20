import * as THREE from "three";
import { AmbientLight, Camera, Color, DirectionalLight, DirectionalLightHelper, DirectionalLightShadow, Light, Vector3 } from "three";
import { DynamicComponent, StaticComponent } from "../engine/component";
import { InputManager } from "../engine/input-manager";
import { SceneManager } from "../engine/scene-manager";
import { Tag } from "../tags";
import { Player } from "./player";

export enum LightType {
  Ambient,
  Directional,
  Spot,
  Point,
}

export type LightConfig = {
  type: LightType;
  position?: Vector3;
  color: number;
  intensity: number; // [0,1]
  shadow: boolean,
  player?: Player,
};

export class StaticLight extends StaticComponent<Light> {
  constructor(light: Light){
    super(light);
  }
}

export class DynamicLight extends DynamicComponent<Light> {
  private config: LightConfig;

  constructor(light: Light, config: LightConfig){
    super(light);
    this.config = config;
  }

  update(sceneMgr: SceneManager, input: InputManager): void {
    /*const offseted = new Vector3(
      this.config.player?.object.position.x! - 1,
      this.config.player?.object.position.y! + 1,
      this.config.player?.object.position.z! - 1,
    );
    offseted.multiplyScalar(0.5);
    this.object.position.set(offseted.x, offseted.y, offseted.z);*/
  }
}

export class LightFactory {
  static create(config: LightConfig): StaticComponent<Light> | DynamicComponent<Light> {
    return {
      [LightType.Ambient as number](){
        const l = new AmbientLight(config.color, config.intensity);
        l.castShadow = config.shadow;
        return new StaticLight(l);
      },
      [LightType.Directional as number](){
        const l = new DirectionalLight(config.color, config.intensity);
        if (config.shadow){
          l.castShadow = true;
          if (config.position) l.position.set(config.position.x, config.position.y, config.position.z);
        }
        return new DynamicLight(l, config);
      },
    }[config.type]();
  }
}