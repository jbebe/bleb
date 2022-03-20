import { Vector2 } from "three";
import { MetaData } from "./engine";

export class InputManager {
  meta: MetaData;

  constructor(meta: MetaData){
    this.meta = meta;
  }

  swipeVector: Vector2 | undefined;
  clickLocation: Vector2 | undefined;
}
