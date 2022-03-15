import { GridHelper } from "three";
import { StaticComponent } from "../engine/component";

export class Floor extends StaticComponent<GridHelper> {
  constructor(){
    super(new GridHelper(20, 40));
  }
}
