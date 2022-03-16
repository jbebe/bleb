import { GLView } from "expo-gl";
import React, { useRef } from "react";
import { Animated, useWindowDimensions, View } from "react-native";
import { Engine } from "./src/engine/engine";
import { MainScene } from "./src/scenes/main";

const CURSOR_SIDE_SIZE = 20;
const CURSOR_HALF_SIDE_SIZE = CURSOR_SIDE_SIZE / 2;

export default function App() {
  const dimensions = useWindowDimensions();
  const touch = useRef(
    new Animated.ValueXY({ 
      x: dimensions.width / 2 - CURSOR_HALF_SIDE_SIZE, 
      y: dimensions.height / 2 - CURSOR_HALF_SIDE_SIZE })
  ).current;
  const onContextCreate = (gl: WebGLRenderingContext) => {
    const engine = new Engine(gl);
    engine.start(new MainScene(engine.meta));
  };
  return <>
    <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
    <View style={{ 
      position: "absolute", 
      width: `calc(100% - 2*${CURSOR_SIDE_SIZE}px)`,
      height: `calc(100% - 2*${CURSOR_SIDE_SIZE}px)`,
      margin: `${CURSOR_SIDE_SIZE}px`,
      borderColor: 'rgba(0,0,0,0.2)',
      borderWidth: 5 }}
      onStartShouldSetResponder={() => true}
      onResponderMove={(event) => {
        touch.setValue({
          x: event.nativeEvent.locationX,
          y: event.nativeEvent.locationY,
        });
      }}
      onResponderRelease={() => {
        Animated.spring(touch, {
          toValue: {
            x:
              dimensions.width / 2 -
              CURSOR_HALF_SIDE_SIZE,
            y:
              dimensions.height / 2 -
              CURSOR_HALF_SIDE_SIZE,
          },
          // left/top are not supported
          useNativeDriver: false,
        }).start();
      }}>
      <Animated.View
        style={{
          position: 'relative',
          left: Animated.subtract(touch.x, CURSOR_HALF_SIDE_SIZE),
          top: Animated.subtract(touch.y, CURSOR_HALF_SIDE_SIZE),
          height: CURSOR_SIDE_SIZE,
          width: CURSOR_SIDE_SIZE,
          borderRadius: CURSOR_HALF_SIDE_SIZE,
          backgroundColor: 'red',
        }}
      />
  </View>
  </>;
}
