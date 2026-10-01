import { useEffect, useRef, useState } from "react";
import { fishHitbox, obstacleHitbox, ObstacleKind, overlaps } from "../lib/gameLogic";

const GRAVITY = 1500;
const JUMP_VELOCITY = 650;
const START_SPEED = 300;
const MAX_DELTA = 0.05; // one long frame must not teleport anything

export default function useGameLoop(screenWidth: number) {
  const [, setTick] = useState(0);
  const [isDucking, setIsDucking] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);

  const widthRef = useRef(screenWidth);
  widthRef.current = screenWidth;

  const speed = useRef(START_SPEED);
  const score = useRef(0);
  const fishY = useRef(0);
  const velocityY = useRef(0);
  const ducking = useRef(false);
  const bgScroll = useRef(0);
  const floorScroll = useRef(0);
  const obstacle = useRef<{ x: number; kind: ObstacleKind }>({ x: 1000, kind: "ground" });

  const jump = () => {
    if (!gameOver && !paused && fishY.current === 0) velocityY.current = JUMP_VELOCITY;
  };

  const duck = () => {
    if (gameOver || paused) return;
    ducking.current = true;
    setIsDucking(true);
  };

  const stopDuck = () => {
    ducking.current = false;
    setIsDucking(false);
  };

  const resetGame = () => {
    obstacle.current = { x: widthRef.current + 80, kind: "ground" };
    fishY.current = 0;
    velocityY.current = 0;
    speed.current = START_SPEED;
    score.current = 0;
    stopDuck();
    setPaused(false);
    setGameOver(false);
  };

  useEffect(() => {
    if (gameOver || paused) return;
    let frame: number;
    let last = Date.now();

    const loop = () => {
      const now = Date.now();
      const dt = Math.min((now - last) / 1000, MAX_DELTA);
      last = now;

      bgScroll.current += 30 * dt;
      floorScroll.current += speed.current * dt;

      obstacle.current.x -= speed.current * dt;
      speed.current += 3 * dt;
      if (obstacle.current.x < -150) {
        obstacle.current = {
          x: widthRef.current + 80 + Math.random() * 200,
          kind: Math.random() < 0.5 ? "ground" : "overhead",
        };
      }

      velocityY.current -= GRAVITY * dt;
      fishY.current += velocityY.current * dt;
      if (fishY.current <= 0) {
        fishY.current = 0;
        velocityY.current = 0;
      }

      const o = obstacle.current;
      if (overlaps(fishHitbox(fishY.current, ducking.current), obstacleHitbox(o.kind, o.x))) {
        setGameOver(true);
        setTick((t) => t + 1);
        return; // stop the loop
      }

      score.current += dt * 10;
      setTick((t) => t + 1);
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [gameOver, paused]);

  return {
    obstacle,
    fishY: fishY.current,
    jump,
    duck,
    stopDuck,
    isDucking,
    gameOver,
    paused,
    setPaused,
    score: Math.floor(score.current),
    resetGame,
    bgScroll: bgScroll.current,
    floorScroll: floorScroll.current,
  };
}