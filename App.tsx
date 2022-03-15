import { GLView } from "expo-gl";
import { Engine } from "./src/engine/engine";
import { MainScene } from "./src/scenes/main";

export default function App() {
  const onContextCreate = (gl: WebGLRenderingContext) => {
    const engine = new Engine(gl);
    engine.start(new MainScene(engine.meta));
  };
  return <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />;
}
