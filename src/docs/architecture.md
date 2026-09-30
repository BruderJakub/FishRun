# FishRun – Architecture & Data Model

## 1. Project Overview

**App name:** FishRun  
**Platform:** iOS and Android  
**Framework:** React Native with Expo  
**Language:** TypeScript  
**Navigation:** Expo Router  
**Sensor:** expo-sensors (Accelerometer)  
**Game type:** Endless Runner

FishRun is a mobile endless runner in which a fish with legs runs automatically and avoids obstacles. The player controls the fish by moving their smartphone. An upward movement triggers a jump, while a downward movement triggers a duck.

The MVP is designed to work offline and does not require a backend.

---

## 2. Component Architecture

The application is divided into reusable UI components, game components and screens.

### Screens

| Component | Responsibility |
|---|---|
| `index.tsx` | Start screen with navigation to the game and settings |
| `game.tsx` | Main gameplay screen |
| `pause.tsx` | Pause menu with resume and navigation options |
| `game-over.tsx` | Displays the final score and restart options |
| `settings.tsx` | Allows the player to configure game settings |

### Reusable UI Components

| Component | Responsibility |
|---|---|
| `GameHeader` | Displays the current score and pause button |
| `FishCharacter` | Displays and animates the fish |
| `Obstacle` | Displays obstacles and their positions |
| `GameBackground` | Displays the game background and ground |
| `GameButton` | Reusable button for menus and game actions |
| `ScoreDisplay` | Displays the current score and high score |
| `SensorStatus` | Shows whether motion controls are active |
| `SensitivitySlider` | Allows the player to adjust sensor sensitivity |

### Hooks and Logic

| Module | Responsibility |
|---|---|
| `useAccelerometer` | Reads and processes accelerometer data |
| `useGameLoop` | Updates the game over time |
| `useCollisionDetection` | Detects collisions between the fish and obstacles |
| `useGameSettings` | Loads and saves local game settings |

---

## 3. Navigation

**Navigation pattern:** Stack navigation using Expo Router.

The application uses a stack-based navigation structure. The game screen is the central screen, while the start, settings, pause and game-over screens provide access to the other functions.

### Navigation hierarchy

```text
app/
├── _layout.tsx
├── index.tsx
├── game.tsx
├── pause.tsx
├── game-over.tsx
└── settings.tsx
```

### Navigation flow

```text
          Start Screen
          /          \
    Start Game     Settings
         |             |
         v             |
        Game           |
       /    \          |
  Pause     Collision  |
    |           |      |
    v           v      |
 Settings   Game Over  |
    |          /   \   |
    └── Back  Retry  Menu
                |      |
                v      v
               Game   Start
```

The game screen uses landscape orientation. Menus can support portrait orientation where appropriate.

---

## 4. Data Model

FishRun uses simple TypeScript types to describe its central data objects.

### GameState

Represents the current state of the game.

```ts
type GameStatus = "ready" | "playing" | "paused" | "gameOver";

type GameState = {
  status: GameStatus;
  score: number;
  highScore: number;
  speed: number;
  fishY: number;
  isJumping: boolean;
  isDucking: boolean;
};
```

### Obstacle

Represents an obstacle in the game.

```ts
type Obstacle = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: "rock" | "seaweed";
};
```

### SensorData

Contains the latest accelerometer measurements.

```ts
type SensorData = {
  x: number;
  y: number;
  z: number;
  timestamp: number;
};
```

### GameSettings

Stores the player's preferences.

```ts
type GameSettings = {
  sensitivity: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
};
```

### ScoreRecord

Represents a saved high score.

```ts
type ScoreRecord = {
  highScore: number;
  updatedAt: number;
};
```

---

## 5. State Management

FishRun uses local React state for screen-specific data and shared state for information needed across multiple screens.

| State | Scope | Technology |
|---|---|---|
| Current score | Game screen | useState |
| Fish position | Game screen | useRef / useState |
| Obstacle positions | Game screen | useRef / useState |
| Jump and duck state | Game screen | useState |
| Accelerometer values | Sensor hook | useRef / useState |
| Game status | Shared game state | React Context |
| High score | Shared game state | React Context + AsyncStorage |
| Game settings | Shared settings state | React Context + AsyncStorage |

### Local State

The game screen manages rapidly changing values such as the fish position, obstacle positions and current score. Refs can be used for values updated frequently to avoid unnecessary re-renders.

### Global State

React Context is used for the game status, high score and settings because these values may be needed by multiple screens.

A separate global state library is not required for the MVP.

---

## 6. Side Effects & Storage

### Accelerometer

The accelerometer is accessed through `expo-sensors`.

- Set the update interval to approximately 100 ms.
- Subscribe when gameplay starts.
- Detect upward and downward movements using configurable thresholds.
- Remove the subscription when the game is paused, ends or the screen unmounts.

### Local Storage

`@react-native-async-storage/async-storage` is used to save settings and the high score locally.

| Data | Storage | Purpose |
|---|---|---|
| Game settings | AsyncStorage | Preserve player preferences |
| High score | AsyncStorage | Preserve the best score |
| Current score | React state | Track the current run |
| Sensor readings | Memory | Process live movement |

### Game Loop

A game loop updates the fish, obstacles and score while the game is running.

- Update game objects at regular intervals.
- Move obstacles towards the fish.
- Check for collisions.
- Increase the score and gradually adjust difficulty.
- Stop the loop when the game is paused or over.

### API & Backend

The MVP does not require an external API or backend. All game logic runs locally on the device.

---

## 7. Project Structure

```text
src/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── game.tsx
│   ├── pause.tsx
│   ├── game-over.tsx
│   └── settings.tsx
│
├── components/
│   ├── GameHeader.tsx
│   ├── FishCharacter.tsx
│   ├── Obstacle.tsx
│   ├── GameBackground.tsx
│   ├── GameButton.tsx
│   ├── ScoreDisplay.tsx
│   ├── SensorStatus.tsx
│   └── SensitivitySlider.tsx
│
├── hooks/
│   ├── useAccelerometer.ts
│   ├── useGameLoop.ts
│   ├── useCollisionDetection.ts
│   └── useGameSettings.ts
│
├── context/
│   └── GameContext.tsx
│
├── types/
│   └── game.ts
│
└── utils/
    ├── gameLogic.ts
    └── storage.ts

docs/
└── architecture.md
```

---

## 8. MVP Scope

The first version of FishRun focuses on the following features:

1. Automatic running, obstacles and collision detection.
2. Accelerometer-based jump and duck controls.
3. Score tracking, Game Over and restart.
4. Local high score storage.
5. Basic sensor sensitivity settings.

Advanced animations, online leaderboards, multiplayer and cloud storage are outside the scope of the MVP.

---

## 9. AI Usage

AI was used to assist with the structure and wording of this architecture document. The final technical decisions and implementation are the responsibility of the author.
