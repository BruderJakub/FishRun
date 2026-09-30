# FishRun – Architecture

## 1. Overview

| | |
|---|---|
| **Game** | Endless runner: a fish with legs runs automatically, dodges obstacles |
| **Controls** | Phone moved **up = jump**, **down = duck** (accelerometer) |
| **Platform** | iOS + Android |
| **Stack** | React Native, Expo, TypeScript, Expo Router |
| **Libraries** | `expo-sensors`, `expo-screen-orientation`, `@react-native-async-storage/async-storage` |
| **Backend** | None. Fully offline. |

---

## 2. Screens & Navigation

Only **3 routes** (Expo Router, stack). Pause and Game Over are **overlays inside the game screen**, so the game state never has to be passed between routes.

```text
app/
├── _layout.tsx   Providers, orientation setup
├── index.tsx     Start menu (Play, Settings, high score)
├── game.tsx      Gameplay + Pause / Game Over overlays
└── settings.tsx  Sensitivity, sound, vibration
```

```text
Start ──► Game ──► [Pause overlay]  ──► Resume / Menu
  │         └────► [Game Over overlay] ──► Retry / Menu
  └──► Settings
```

- Game screen: **landscape**. Menus: portrait or landscape.

---

## 3. Project Structure

```text
src/
├── app/               (routes, see above)
├── components/
│   ├── GameWorld.tsx  Background, ground, fish, obstacles
│   ├── Hud.tsx        Score, high score, pause button, sensor status
│   ├── Overlay.tsx    Pause + Game Over panel
│   └── GameButton.tsx Reusable button
├── hooks/
│   ├── useMotionControl.ts  Accelerometer → "jump" / "duck" events
│   └── useGameLoop.ts       Frame loop, movement, collision, score
├── context/
│   └── GameContext.tsx      Settings + high score (AsyncStorage)
├── lib/
│   ├── types.ts             All shared types
│   └── gameLogic.ts         Constants, obstacle spawning, collision check
└── assets/                  Fish sprite, background
docs/
├── architecture.md
└── FishRun_One-Pager.pdf
```

---

## 4. Data Model

All types live in `lib/types.ts`.

```ts
type FishAction = "running" | "jumping" | "ducking";
type GameStatus = "ready" | "playing" | "paused" | "gameOver";

type Fish = {
  y: number;              // vertical position
  velocityY: number;
  action: FishAction;     // one field, so jumping + ducking can't happen together
};

type Obstacle = {
  id: string;
  x: number; y: number;
  width: number; height: number;
  kind: "ground" | "overhead";   // ground → jump over, overhead → duck under
};

type MotionEvent = "jump" | "duck";

type Settings = {
  sensitivity: number;    // 0.5 – 2.0, scales the sensor threshold
  sound: boolean;         // post-MVP
  vibration: boolean;     // post-MVP
};
```

`highScore` is stored **once**, in `GameContext`, together with `Settings`.

---

## 5. State Management

| State | Where | How |
|---|---|---|
| Fish, obstacles, score, speed | `useGameLoop` | `useRef` (updated every frame) + one `useState` tick for rendering |
| Game status | `game.tsx` | `useState<GameStatus>` |
| Settings, high score | `GameContext` | Context + AsyncStorage (load on start, save on change) |

No extra state library needed.

---

## 6. Game Logic

### Game loop (`useGameLoop`)
- Uses `requestAnimationFrame` with **delta time**, so speed is the same on every phone.
- Each frame: move obstacles → apply jump/duck physics → check collision → add score → slowly raise speed.
- Loop runs only while `status === "playing"`. Pause and Game Over stop it.

### Collision (`lib/gameLogic.ts`)
- Rectangle overlap between fish hitbox and each obstacle.
- Ducking makes the fish hitbox shorter, so it passes under `overhead` obstacles.

### Motion control (`useMotionControl`)
The most fragile part, so:

| Rule | Why |
|---|---|
| Update interval **16–33 ms** | 100 ms feels laggy |
| Compare against a **threshold × sensitivity** | Adjustable in settings |
| **Cooldown ~300 ms** after each event | Braking after an upward move would otherwise trigger a fake duck |
| Pick the axis for landscape once, in one place | Axes are swapped in landscape |
| Subscribe when playing, remove on pause / game over / unmount | No leaks, saves battery |
| **Tap fallback** (left half = jump, right half = duck) | iOS simulator has no accelerometer; useful for testing |

---

## 7. MVP Scope

1. Auto-running fish, obstacles, collision.
2. Accelerometer jump / duck.
3. Score, Game Over, restart.
4. Local high score.
5. Sensitivity setting.

**Out of scope:** online leaderboard, multiplayer, cloud storage, advanced animation, sound/vibration.

---

## 8. Suggested Build Order

1. Project + folders + navigation (3 routes)
2. `GameWorld` with a static fish and obstacle
3. `useGameLoop` (movement + collision) controlled by **tap fallback**
4. Score + Game Over overlay
5. `useMotionControl` on a real phone
6. `GameContext` (high score, settings) + settings screen

---

## 9. AI Usage

AI helped structure and word this document. Final technical decisions and implementation are the author's responsibility.