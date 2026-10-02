export type FishAction = "running" | "jumping" | "ducking";

export type GameStatus =
  | "ready"
  | "playing"
  | "paused"
  | "gameOver";

export type Fish = {
  y: number;
  velocityY: number;
  action: FishAction;
};

export type Obstacle = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  kind: "ground" | "overhead";
};

export type MotionEvent = "jump" | "duck";

export type Difficulty = "normal" | "hard";

export type Settings = {
  sensitivity: number;
  touch: boolean;
  motion: boolean;
  motionMode: "phone" | "body";
  voiceHints: boolean;
  sound: boolean;
  vibration: boolean;
  showHitboxes: boolean;
  difficulty: Difficulty;
};