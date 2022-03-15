import { Camera, Fog, Object3D } from "three";
import { DynamicComponent, StaticComponent } from "./component";

export type SceneConfiguration = {
  camera?: DynamicComponent<Camera>,
  fog?: Fog,
  static: StaticComponent<Object3D>[],
  dynamic: DynamicComponent<Object3D>[],
};
