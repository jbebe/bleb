import { GLView } from "expo-gl";
import React from "react";
import { Engine } from "./src/engine/engine";
import PointerView, { PointerEvents } from "./src/react/pointer-view";
import { MainScene } from "./src/scenes/main";

const events: PointerEvents = {};

export default function App() {
  
  const onContextCreate = (gl: WebGLRenderingContext) => {
    const engine = new Engine(gl);
    events.onSetSwipe = (from, to) => {
      engine.input.swipeVector = to.sub(from);
    };
    engine.start(new MainScene(engine.meta));
  };
  return <>
    <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
    <PointerView events={events} />
  </>;
}
