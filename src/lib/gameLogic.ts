import { Difficulty } from "./types";

export const GROUND_HEIGHT = 80;   // Höhe des Meeresbodens
export const FISH_X = 120;
export const FISH_BOTTOM = 61;     // Render-Offset des Fisch-Sprites

// y = Unterkante, von unten gemessen
export type Rect = { x: number; y: number; w: number; h: number };

export const ROCK = { width: 70, height: 70 };
export const DIVER = { width: 110, height: 110, bottom: 120 };

// ---- Schwierigkeit ----
export const DIFFICULTY: Record<
  Difficulty,
  { startSpeed: number; accel: number; maxSpeed: number; multiplier: number }
> = {
  normal: { startSpeed: 300, accel: 3, maxSpeed: 700, multiplier: 1 },
  hard: { startSpeed: 380, accel: 9, maxSpeed: 950, multiplier: 2 },
};

export const MOTION_BONUS = 2.25;

export function scoreMultiplier(difficulty: Difficulty, motionOnly: boolean) {
  const m = DIFFICULTY[difficulty].multiplier * (motionOnly ? MOTION_BONUS : 1);
  return Math.round(m * 100) / 100;
}

// ---- Hitboxen ----
export function fishHitbox(fishY: number, ducking: boolean): Rect {
  return { x: FISH_X + 15, y: GROUND_HEIGHT + fishY, w: 70, h: ducking ? 36 : 62 };
}

export type ObstacleKind = "ground" | "overhead" | "hook";

// Haken: Schnur ohne Hitbox, nur der Kopf (head) trifft
export const HOOK = { width: 39, height: 636, head: 57, mid: 165, amp: 75, period: 2.2 };

export function hookBottom(t: number, phase: number) {
  return HOOK.mid + HOOK.amp * Math.sin((t / HOOK.period) * 2 * Math.PI + phase);
}

export function obstacleHitbox(kind: ObstacleKind, x: number, hookY = 0): Rect {
  if (kind === "ground") {
    return { x: x + 12, y: GROUND_HEIGHT, w: ROCK.width - 24, h: 52 };
  }
  if (kind === "hook") {
    return { x: x + 4, y: hookY + 4, w: HOOK.width - 8, h: HOOK.head - 8 };
  }
  return { x: x + 25, y: DIVER.bottom + 8, w: DIVER.width - 50, h: 90 };
}

export function overlaps(a: Rect, b: Rect) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}