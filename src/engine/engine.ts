import { Renderer } from "expo-three";
import { Color } from "../colors";
import { SceneManager } from "./scene-manager";

export type MetaData = {
  screen: {
    width: number;
    height: number;
  }
};

export class Engine {

  animationTimer?: number;
  readonly meta: MetaData;

  private readonly gl: WebGLRenderingContext;
  private readonly renderer: Renderer;

  constructor(gl: WebGLRenderingContext){
    this.gl = gl;
    this.meta = {
      screen: {
        height: gl.drawingBufferHeight,
        width: gl.drawingBufferWidth,
      }
    };
    this.renderer = new Renderer({ gl: this.gl });
    this.renderer.setSize(this.meta.screen.width, this.meta.screen.height);
    this.renderer.setClearColor(Color.Background);
  }

  private render(sceneManager: SceneManager){
    const curriedRender = () => {
      this.animationTimer = requestAnimationFrame(curriedRender);
      this.update(sceneManager);
      this.renderer.render(sceneManager.scene, sceneManager.camera);
      (this.gl as any).endFrameEXP();
    };
    curriedRender();
  }

  start(sceneManager: SceneManager){
    this.render(sceneManager);
  }

  private update(sceneManager: SceneManager){
    sceneManager.update();
  }
}