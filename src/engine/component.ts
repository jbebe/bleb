import { Object3D, Scene } from "three";
import { Tag } from "../tags";

class ComponentBase<T extends Object3D> {
  object: T;
  tags: Set<Tag>;

  constructor(object: T, ...tags: Tag[]){
    this.object = object;
    this.tags = new Set<Tag>(tags);
  }
}

export class StaticComponent<T extends Object3D> extends ComponentBase<T> {}

export class DynamicComponent<T extends Object3D> extends ComponentBase<T> {
  update(scene: Scene): void {
    throw new Error("Base method cannot be called");
  }
}
