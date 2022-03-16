import { Object3D } from "three";
import { Tag } from "../tags";
import { InputManager } from "./input-manager";
import { SceneManager } from "./scene-manager";

class ComponentBase<T extends Object3D> {
  object: T;
  tags: Set<Tag>;

  constructor(object: T, ...tags: Tag[]){
    this.object = object;
    this.tags = new Set<Tag>(tags);
  }
}

export abstract class StaticComponent<T extends Object3D> extends ComponentBase<T> {}

export abstract class DynamicComponent<T extends Object3D> extends ComponentBase<T> {
  update(scene: SceneManager, input: InputManager): void {
    throw new Error("Base method cannot be called");
  }
}
