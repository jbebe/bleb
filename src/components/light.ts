import * as THREE from "three";
import { AmbientLight, Color, DirectionalLight, Vector3 } from "three";
import { StaticComponent } from "../engine/component";

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
};

export class Light extends StaticComponent<THREE.Light> {
  constructor(lightConfig: LightConfig){
    const light = Light.createLight(lightConfig);
    super(light);
  }

  private static createLight(config: LightConfig){
    return {
      [LightType.Ambient as number](){
        return new AmbientLight(config.color, config.intensity);
      },
      [LightType.Directional as number](){
        return new DirectionalLight(config.color, config.intensity);
      },
    }[config.type]();
  }
}