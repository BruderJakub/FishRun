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

export type Settings = {
  sensitivity: number; // 0.5 - 2.0
  touch: boolean;      // Touch-Steuerung
  motion: boolean;     // Bewegungssteuerung
  voiceHints: boolean; // Blind-Modus: Sprachhinweise
  sound: boolean;      // folgt später
  vibration: boolean;
};