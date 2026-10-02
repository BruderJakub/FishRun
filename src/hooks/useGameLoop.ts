import { useEffect, useRef, useState } from "react";
import { DIFFICULTY, FISH_X, fishHitbox, hookBottom, obstacleHitbox, ObstacleKind, overlaps } from "../lib/gameLogic";
import { Difficulty } from "../lib/types";

const GRAVITY = 1500;
const JUMP_VELOCITY = 650;
const MAX_DELTA = 0.05; // ein langer Frame darf nichts teleportieren
const LEAD_S = 1.1;     // Sprachhinweis kommt so viele Sekunden vor dem Hindernis

type Obst = { x: number; kind: ObstacleKind; warned: boolean; t: number; phase: number; hookY: number };

const KINDS: ObstacleKind[] = ["ground", "overhead", "hook"];

const newObstacle = (x: number, kind: ObstacleKind): Obst => ({
  x,
  kind,
  warned: false,
  t: 0,
  phase: Math.random() * Math.PI * 2,
  hookY: 0,
});

export default function useGameLoop(
  screenWidth: number,
  onWarn?: (kind: ObstacleKind) => void,
  difficulty: Difficulty = "normal",
  multiplier = 1
) {
  const [, setTick] = useState(0);
  const [isDucking, setIsDucking] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);

  const widthRef = useRef(screenWidth);
  widthRef.current = screenWidth;
  const warnRef = useRef(onWarn);
  warnRef.current = onWarn;
  const cfg = useRef(DIFFICULTY[difficulty]);
  cfg.current = DIFFICULTY[difficulty];
  const mult = useRef(multiplier);
  mult.current = multiplier;

  const speed = useRef(DIFFICULTY[difficulty].startSpeed);
  const score = useRef(0);
  const fishY = useRef(0);
  const velocityY = useRef(0);
  const ducking = useRef(false);
  const bgScroll = useRef(0);
  const floorScroll = useRef(0);
  const obstacle = useRef<Obst>(newObstacle(1000, "ground"));

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
    obstacle.current = newObstacle(widthRef.current + 80, "ground");
    fishY.current = 0;
    velocityY.current = 0;
    speed.current = cfg.current.startSpeed;
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
      speed.current = Math.min(speed.current + cfg.current.accel * dt, cfg.current.maxSpeed);
      if (obstacle.current.x < -150) {
        obstacle.current = newObstacle(
          widthRef.current + 80 + Math.random() * 200,
          KINDS[Math.floor(Math.random() * KINDS.length)]
        );
      }

      const o = obstacle.current;
      o.t += dt;
      if (o.kind === "hook") o.hookY = hookBottom(o.t, o.phase);

      velocityY.current -= GRAVITY * dt;
      fishY.current += velocityY.current * dt;
      if (fishY.current <= 0) {
        fishY.current = 0;
        velocityY.current = 0;
      }

      // Sprachhinweis: einmal pro Hindernis, LEAD_S Sekunden vor dem Fisch
      const gap = o.x - (FISH_X + 85);
      if (!o.warned && gap < speed.current * LEAD_S) {
        o.warned = true;
        warnRef.current?.(o.kind);
      }

      if (overlaps(fishHitbox(fishY.current, ducking.current), obstacleHitbox(o.kind, o.x, o.hookY))) {
        setGameOver(true);
        setTick((t) => t + 1);
        return; // Loop stoppen
      }

      score.current += dt * 10 * mult.current;
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