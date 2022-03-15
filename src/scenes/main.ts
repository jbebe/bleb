import { Fog, Object3D } from "three";
import { Color } from "../colors";
import { Floor } from "../components/floor";
import { Player } from "../components/Player";
import { SimpleFollowerCamera } from "../components/simple-follower-camera";
import { DynamicComponent, StaticComponent } from "../engine/component";
import { MetaData } from "../engine/engine";
import { SceneConfiguration } from "../engine/scene-configuration";
import { SceneManager } from "../engine/scene-manager";
import { Tag } from "../tags";

export class MainScene extends SceneManager {
  constructor(meta: MetaData) {
    const staticComps = MainScene.createStatic();
    const dynamicComps = MainScene.createDynamic();
    const config: SceneConfiguration = {
      fog: MainScene.createFog(),
      static: staticComps,
      dynamic: dynamicComps,
    };
    super(config);
    const player = dynamicComps.find(x => x.tags.has(Tag.Player));
    if (!player) throw new Error('Cannot find player in dynamic components');
    config.camera = MainScene.createCamera(player.object, meta.screen.width/meta.screen.height);
  }

  private static createFog(): Fog {
    return new Fog(Color.Background, 1, 20);
  }

  private static createCamera(player: Object3D, aspectRatio: number) {
    return new SimpleFollowerCamera(player, aspectRatio);
  }

  private static createStatic(): StaticComponent<Object3D>[] {
    return [
      new Floor(),
    ];
  }

  private static createDynamic(): DynamicComponent<Object3D>[] {
    return [
      new Player(),
    ];
  }
}