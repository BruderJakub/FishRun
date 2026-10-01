export const GROUND_HEIGHT = 80;   // height of the sea floor strip
export const FISH_X = 120;
export const FISH_BOTTOM = 61;     // render offset of the fish sprite

export type ObstacleKind = "ground" | "overhead";
// y = bottom edge, measured UP from the bottom of the screen
export type Rect = { x: number; y: number; w: number; h: number };

export const ROCK = { width: 70, height: 70 };
export const DIVER = { width: 110, height: 110, bottom: 120 }; // bottom = gap above screen bottom

export function fishHitbox(fishY: number, ducking: boolean): Rect {
  return { x: FISH_X + 15, y: GROUND_HEIGHT + fishY, w: 70, h: ducking ? 36 : 62 };
}

export function obstacleHitbox(kind: ObstacleKind, x: number): Rect {
  if (kind === "ground") {
    return { x: x + 12, y: GROUND_HEIGHT, w: ROCK.width - 24, h: 52 };
  }
  // diver hitbox: bottom edge at 128 → standing fish (top 142) hits it, ducked fish (top 116) passes
  return { x: x + 25, y: DIVER.bottom + 8, w: DIVER.width - 50, h: 90 };
}

export function overlaps(a: Rect, b: Rect) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}