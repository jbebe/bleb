import * as THREE from "three";
import { AmbientLight, Camera, Color, DirectionalLight, DirectionalLightHelper, DirectionalLightShadow, Light, Object3D, OrthographicCamera, Vector2, Vector3 } from "three";
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
    const size = 20;
    this.object.shadow.camera = new OrthographicCamera(-size, size, size, -size, 0.5, 1000); 
    this.object.shadow.mapSize = new Vector2(1024, 1024);
    this.config = config;
  }

  update(sceneMgr: SceneManager, input: InputManager): void {
    this.object.position.set(
      sceneMgr.playerRef.object.position.x + 0,
      this.object.position.y,
      sceneMgr.playerRef.object.position.z + -10,
    );
  }
}

export class LightTarget extends DynamicComponent<Object3D> {
  update(scene: SceneManager, input: InputManager): void {
    this.object.position.set(
      scene.playerRef.object.position.x,
      scene.playerRef.object.position.y,
      scene.playerRef.object.position.z,
    );
  }
}

export class LightFactory {
  static createStatic(config: LightConfig): StaticLight {
    return {
      [LightType.Ambient as number](){
        const l = new AmbientLight(config.color, config.intensity);
        l.castShadow = config.shadow;
        return new StaticLight(l);
      },
    }[config.type]();
  }

  static createDynamic(config: LightConfig): [DynamicLight, LightTarget | undefined] {
    return {
      [LightType.Directional as number](){
        const l = new DirectionalLight(config.color, config.intensity);
        let target = undefined as StaticComponent<Object3D> | undefined;
        if (config.shadow){
          l.castShadow = true;
          if (config.position) l.position.set(config.position.x, config.position.y, config.position.z);
          target = new LightTarget(l.target);
          console.log('target is set');
        }
        return [new DynamicLight(l, config), target] as [DynamicLight, LightTarget | undefined];
      },
    }[config.type]();
  }
}