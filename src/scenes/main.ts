import { Fog, Object3D, Vector3 } from "three";
import { BlebColor } from "../colors";
import { Floor } from "../components/floor";
import { DynamicLight, LightFactory, LightType } from "../components/light";
import { Player } from "../components/Player";
import { SimpleFollowerCamera } from "../components/simple-follower-camera";
import { StaticComponent } from "../engine/component";
import { MetaData } from "../engine/engine";
import { SceneConfiguration } from "../engine/scene-configuration";
import { SceneManager } from "../engine/scene-manager";
import { Synchronizer, User } from "../engine/synchronizer";

export class MainScene extends SceneManager {
  constructor(meta: MetaData, user: User, synchronizer: Synchronizer) {
    const staticComps = MainScene.createStatic();
    const player = new Player(user.id, synchronizer);
    const dynamicComps = MainScene.createDynamic(player);
    const config: SceneConfiguration = {
      fog: MainScene.createFog(),
      static: staticComps,
      dynamic: [player, ...dynamicComps],
    };
    super(config);
    if (!player) throw new Error('Cannot find player in dynamic components');
    config.camera = MainScene.createCamera(player.object, meta.screen.width/meta.screen.height);
  }

  private static createFog(): Fog {
    return new Fog(BlebColor.Background, 10, 20);
  }

  private static createCamera(player: Object3D, aspectRatio: number) {
    const offset = new Vector3(5, 10, 5);
    return new SimpleFollowerCamera(player, aspectRatio, offset);
  }

  private static createStatic(): StaticComponent<Object3D>[] {
    return [
      ...MainScene.createStaticLights(),
      new Floor(),
    ];
  }

  private static createDynamic(player: Player) {
    return [
      ...MainScene.createDynamicLights(player),
    ];
  }

  private static createStaticLights(){
    const ambientLight = LightFactory.create({
      color: BlebColor.Background as number,
      intensity: 0.2,
      type: LightType.Ambient,
      shadow: false,
    });
    return [ambientLight];
  }
  private static createDynamicLights(player: Player){
    const directionalLight = LightFactory.create({
      color: BlebColor.Background as number,
      intensity: 1,
      type: LightType.Directional,
      shadow: true,
      position: new Vector3(-1, 1, -1),
      player,
    }) as DynamicLight;
    return [
      directionalLight
    ];
  }
}