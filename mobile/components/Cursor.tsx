import React from "react";
import { StyleSheet, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { clamp, getYForX, Path } from "react-native-redash";

const CURSOR = 50;

interface CursorProps {
  data: Animated.SharedValue<{ path: Path }>;
  y: Animated.SharedValue<number>;
  x: Animated.SharedValue<number>;
  defaultX: number;
  defaultY: number;
  minMaxX: [number, number];
}

export const Cursor = ({
  data,
  y,
  x,
  defaultX,
  defaultY,
  minMaxX,
}: CursorProps) => {
  const active = useSharedValue(false);
  const onGestureEvent = useAnimatedGestureHandler({
    onStart: () => {
      active.value = true;
    },
    onActive: (event) => {
      x.value = clamp(event.x, minMaxX[0], minMaxX[1] - 0.1);
      y.value = getYForX(data.value.path, x.value)!;
    },
    onEnd: () => {
      active.value = false;
      x.value = defaultX;
      y.value = defaultY;
    },
  });

  const style = useAnimatedStyle(() => {
    const translateX = x.value - CURSOR / 2 - 1;
    const translateY = y.value - CURSOR / 2;
    return {
      transform: [{ translateX }, { translateY }],
      opacity: 1,
    };
  });

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View style={StyleSheet.absoluteFill}>
        <Animated.View style={[styles.cursor, style]}>
          <View style={styles.cursorBody} />
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  cursor: {
    width: CURSOR,
    height: CURSOR,
    borderRadius: CURSOR / 2,
    backgroundColor: "rgba(135, 234, 224, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  cursorBody: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: "#5bd3c9",
  },
});
