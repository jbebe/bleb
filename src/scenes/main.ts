import { Fog, Object3D, Vector2, Vector3 } from "three";
import { BlebColor } from "../colors";
import { Debris } from "../components/debris";
import { Floor } from "../components/floor";
import { DynamicLight, LightFactory, LightType } from "../components/light";
import { Player } from "../components/player";
import { SimpleFollowerCamera } from "../components/simple-follower-camera";
import { DynamicComponent, StaticComponent } from "../engine/component";
import { MetaData } from "../engine/engine";
import { SceneConfiguration } from "../engine/scene-configuration";
import { SceneManager } from "../engine/scene-manager";
import { Synchronizer, User } from "../engine/synchronizer";
import MersenneTwister from "mersenne-twister";

export class MainScene extends SceneManager {
  constructor(meta: MetaData, user: User, synchronizer: Synchronizer) {
    const player = new Player(user.id, synchronizer);
    const { staticComponent, dynamicComponent } = MainScene.createComponents(player);
    const config: SceneConfiguration = {
      fog: MainScene.createFog(),
      static: staticComponent,
      dynamic: [player, ...dynamicComponent],
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

  private static createComponents(player: Player) {
    const staticComponent: StaticComponent<Object3D>[] = [];
    const dynamicComponent: DynamicComponent<Object3D>[] = [];
    MainScene.createLights(player, staticComponent, dynamicComponent);
    staticComponent.push(new Floor());
    this.createDebris(staticComponent);
    return {
      staticComponent,
      dynamicComponent,
    };
  }

  static createDebris(statics: StaticComponent<Object3D>[]){
    const rand = new MersenneTwister(13);
    const scatterSize = 300;
    for (let i = 0; i < 1000; ++i){
      const pos = new Vector2(
        rand.random() * scatterSize - scatterSize/2,
        rand.random() * scatterSize - scatterSize/2,
      );
      statics.push(new Debris(pos));
    }
  }

  private static createLights(
    player: Player, 
    staticComponent: StaticComponent<Object3D>[],
    dynamicComponent: DynamicComponent<Object3D>[])
  {
    const ambientLight = LightFactory.createStatic({
      color: BlebColor.Background as number,
      intensity: 0.2,
      type: LightType.Ambient,
      shadow: false,
    });
    staticComponent.push(ambientLight);
    const [directionalLight, dirLightTarget] = LightFactory.createDynamic({
      color: BlebColor.Background as number,
      intensity: 0.7,
      type: LightType.Directional,
      shadow: true,
      position: new Vector3(0, 20, -5),
      player,
    });
    dynamicComponent.push(directionalLight);
    if (dirLightTarget) dynamicComponent.push(dirLightTarget);
  }

}