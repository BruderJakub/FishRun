import { router } from "expo-router";
import { useEffect, useState } from "react";
import { GestureResponderEvent, Image, Pressable, StyleSheet, Text, useWindowDimensions, Vibration, View } from "react-native";

import { useGame } from "../context/GameContext";
import useGameLoop from "../hooks/useGameLoop";
import useMotionControl from "../hooks/useMotionControl";
import { DIVER, FISH_BOTTOM, FISH_X, fishHitbox, GROUND_HEIGHT, obstacleHitbox, Rect, ROCK } from "../lib/gameLogic";
import Hud from "./Hud";
import Overlay from "./Overlay";
import ScrollingLayer from "./ScrollingLayer";

const DEBUG_HITBOX = true; // red outlines + motion value. Set to false when everything feels right.

const RUNNING_FRAMES = [
  require("../assets/running_fish/running_fish_0.png"),
  require("../assets/running_fish/running_fish_1.png"),
  require("../assets/running_fish/running_fish_2.png"),
  require("../assets/running_fish/running_fish_3.png"),
  require("../assets/running_fish/running_fish_4.png"),
  require("../assets/running_fish/running_fish_5.png"),
  require("../assets/running_fish/running_fish_6.png"),
  require("../assets/running_fish/running_fish_7.png"),
  require("../assets/running_fish/running_fish_8.png"),
  require("../assets/running_fish/running_fish_9.png"),
  require("../assets/running_fish/running_fish_10.png"),
  require("../assets/running_fish/running_fish_11.png"),
];

type Props = { onGameOver: () => void };

function Box({ rect }: { rect: Rect }) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: rect.x,
        bottom: rect.y,
        width: rect.w,
        height: rect.h,
        borderWidth: 2,
        borderColor: "red",
        zIndex: 200,
      }}
    />
  );
}

export default function GameWorld({ onGameOver }: Props) {
  const { width, height } = useWindowDimensions();
  const { highScore, settings, submitScore } = useGame();
  const {
    obstacle, fishY, jump, duck, stopDuck, isDucking,
    gameOver, paused, setPaused, score, resetGame, bgScroll, floorScroll,
  } = useGameLoop(width);

  const [frame, setFrame] = useState(0);
  const active = !gameOver && !paused;
  const o = obstacle.current;

  const { delta } = useMotionControl({
    enabled: active && settings.motion,
    sensitivity: settings.sensitivity,
    onJump: jump,
    onDuck: () => {
      duck();
      setTimeout(stopDuck, 500); // hold the duck for 0.5 s
    },
  });

  const pause = () => {
    stopDuck();
    setPaused(true);
  };

  const handlePress = (e: GestureResponderEvent) => {
    if (!active) return;
    if (e.nativeEvent.pageX < width / 2) jump();
    else duck();
  };

  useEffect(() => {
    if (gameOver) {
      submitScore(score);
      if (settings.vibration) Vibration.vibrate(150);
      onGameOver();
    }
  }, [gameOver]);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setFrame((p) => (p + 1) % RUNNING_FRAMES.length), 80);
    return () => clearInterval(id);
  }, [active]);

  return (
    <Pressable style={{ flex: 1 }} onPressIn={handlePress} onPressOut={stopDuck}>
      <View style={styles.container}>
        <ScrollingLayer
          source={require("../assets/sea_background.png")}
          height={height}
          screenWidth={width}
          scroll={bgScroll}
          top={0}
        />

        <Image
          source={RUNNING_FRAMES[frame]}
          resizeMode="contain"
          style={[styles.fish, { bottom: FISH_BOTTOM + fishY }, isDucking && styles.fishDucking]}
        />

        {o.kind === "ground" ? (
          <Image source={require("../assets/rock.png")} resizeMode="contain" style={[styles.rock, { left: o.x }]} />
        ) : (
          <Image source={require("../assets/diver.png")} resizeMode="contain" style={[styles.diver, { left: o.x }]} />
        )}

        <ScrollingLayer
          source={require("../assets/sea_floor.png")}
          height={GROUND_HEIGHT}
          screenWidth={width}
          scroll={floorScroll}
          bottom={0}
          zIndex={2}
        />

        {DEBUG_HITBOX && (
          <>
            <Box rect={fishHitbox(fishY, isDucking)} />
            <Box rect={obstacleHitbox(o.kind, o.x)} />
            <Text style={styles.debug}>motion: {delta.toFixed(2)}</Text>
          </>
        )}

        <Hud
          score={score}
          best={Math.max(highScore, score)}
          motionActive={active && settings.motion}
          onPause={pause}
        />

        {(gameOver || paused) && (
          <Overlay
            mode={gameOver ? "gameOver" : "pause"}
            score={score}
            best={highScore}
            onResume={() => setPaused(false)}
            onRetry={resetGame}
            onMenu={() => router.replace("/")}
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fish: { position: "absolute", left: FISH_X, width: 100, height: 100, zIndex: 10, transform: [{ scaleX: -1 }] },
  // temporary "duck" look until the real duck animation exists (Block 9)
  fishDucking: { transform: [{ translateY: 20 }, { scaleX: -1 }, { scaleY: 0.6 }] },
  rock: { position: "absolute", bottom: GROUND_HEIGHT, width: ROCK.width, height: ROCK.height, zIndex: 5 },
  diver: { position: "absolute", bottom: DIVER.bottom, width: DIVER.width, height: DIVER.height, zIndex: 5 },
  debug: { position: "absolute", top: 80, left: 20, zIndex: 50 },
});