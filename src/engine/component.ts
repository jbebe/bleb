import { Object3D } from "three";
import { Tag } from "../tags";
import { InputManager } from "./input-manager";
import { SceneManager } from "./scene-manager";

export interface EventfulComponent {
  onClick(): void;
}

export class ComponentBase<T extends Object3D> {
  object: T;
  tags: Set<Tag>;
  props: Map<string, any>;
  events: {
    onClick?: () => void;
  };

  constructor(object: T, ...tags: Tag[]){
    this.object = object;
    this.object.userData.component = this;
    this.tags = new Set<Tag>(tags);
    this.props = new Map<string, any>();
    this.events = {};
  }
}

export class StaticComponent<T extends Object3D> extends ComponentBase<T> {}

export abstract class DynamicComponent<T extends Object3D> extends ComponentBase<T> {
  update(scene: SceneManager, input: InputManager): void {
    throw new Error("Base method cannot be called");
  }
}
