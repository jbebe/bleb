import { Renderer } from "expo-three";
import { BlebColor } from "../colors";
import { InputManager } from "./input-manager";
import { SceneManager } from "./scene-manager";

export type MetaData = {
  screen: {
    width: number;
    height: number;
  }
};

export class Engine {
  readonly meta: MetaData;
  readonly input: InputManager;

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
    this.renderer.setClearColor(BlebColor.Background);
    this.renderer.shadowMap.enabled = true;
    this.input = new InputManager();
  }

  private render(sceneManager: SceneManager){
    const curriedRender = () => {
      requestAnimationFrame(curriedRender);
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
    sceneManager.update(this.input);
  }
}