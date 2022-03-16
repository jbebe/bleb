import React, { useRef } from "react";
import { Animated, GestureResponderEvent, useWindowDimensions, View } from "react-native";
import { Vector2 } from "three";

export type PointerEvents = {
  onSetSwipe?: (from: Vector2, to: Vector2) => void
};

let touchData: {
  from: Vector2,
  to: Vector2,
} | undefined;

type Props = {
  events: PointerEvents;
};

export default function PointerView({ events }: Props){
  const CURSOR_SIDE_SIZE = 20;
  const CURSOR_HALF_SIDE_SIZE = CURSOR_SIDE_SIZE / 2;
  const dimensions = useWindowDimensions();
  const touch = useRef(
    new Animated.ValueXY({ 
      x: dimensions.width / 2 - CURSOR_HALF_SIDE_SIZE, 
      y: dimensions.height / 2 - CURSOR_HALF_SIDE_SIZE })
  ).current;
  const onMove = (event: GestureResponderEvent) => {
    const locX = event.nativeEvent.locationX;
    const locY = event.nativeEvent.locationY;
    if (!touchData){
      touchData = {
        from: new Vector2(locX, locY),
        to: new Vector2(0, 0),
      };
    } else {
      touchData.to.set(locX, locY);
      if (events.onSetSwipe) events.onSetSwipe(touchData.from, touchData.to);
    }
    touch.setValue({ x: locX, y: locY });
  };
  const onRelease = () => {
    if (touchData){
      touchData = undefined;
      if (events.onSetSwipe) events.onSetSwipe(new Vector2(0, 0), new Vector2(0, 0));
    }
    Animated.spring(touch, {
      toValue: {
        x:
          dimensions.width / 2 -
          CURSOR_HALF_SIDE_SIZE,
        y:
          dimensions.height / 2 -
          CURSOR_HALF_SIDE_SIZE,
      },
      useNativeDriver: false,
    }).start();
  };

  return <View style={{ 
    position: "absolute", 
    width: `calc(100% - 2*${CURSOR_SIDE_SIZE}px)`,
    height: `calc(100% - 2*${CURSOR_SIDE_SIZE}px)`,
    margin: `${CURSOR_SIDE_SIZE}px`,
    borderColor: 'rgba(0,0,0,0.2)',
    borderWidth: 5 }}
    onStartShouldSetResponder={() => true}
    onResponderMove={onMove}
    onResponderRelease={onRelease}>
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
}