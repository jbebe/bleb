import { GLView } from "expo-gl";
import React, { useEffect, useState } from "react";
import { Engine } from "./src/engine/engine";
import { Synchronizer, User } from "./src/engine/synchronizer";
import PointerView, { PointerEvents } from "./src/react/pointer-view";
import usePersistent from "./src/react/use-persistent";
import { MainScene } from "./src/scenes/main";

const events: PointerEvents = {};

export default function App() {
  const [user] = usePersistent('bleb.user', () => {
    const randomId = Math.floor((Math.random()*1e10));
    return {
      name: prompt('What is your name?') ?? 'user' + randomId,
      id: randomId,
    } as User;
  });
  const [synchronizer, setSynchronizer] = useState(undefined as Synchronizer | undefined);
  useEffect(() => {
    (async () => {
      const s = await Synchronizer.createAsync(user);
      setSynchronizer(s);
    })();
  }, []);
  if (!user || !synchronizer) return null;

  const onContextCreate = async (gl: WebGLRenderingContext) => {
    const engine = new Engine(gl, synchronizer);
    events.onSetSwipe = (from, to) => {
      engine.input.swipeVector = to.sub(from);
    };
    engine.start(new MainScene(engine.meta, user, synchronizer));
  };
  return <>
    <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
    <PointerView events={events} />
  </>;
}
