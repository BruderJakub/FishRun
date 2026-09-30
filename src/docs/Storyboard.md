# FishRun – Storyboard & User Flow

## 1. Project Overview

**App name:** FishRun  
**Type:** Mobile Endless Runner  
**Platform:** iOS and Android (Expo / React Native)  
**Main input:** Accelerometer + Touch  
**Orientation:** Landscape (game), Portrait or Landscape (menus)

**Concept:**  
FishRun is an endless runner in which a fish with legs runs automatically and avoids obstacles. The player controls the fish by moving their smartphone. Moving the phone upwards triggers a jump, while moving it downwards makes the fish duck.

---

## 2. Storyboard

### Screen 1 – Start Screen

**Purpose:** Entry point of the game.

```text
┌─────────────────────────┐
│                         │
│       FISHRUN 🐟        │
│                         │
│         🐟🦵           │
│                         │
│    ┌───────────────┐    │
│    │   START GAME  │    │
│    └───────────────┘    │
│                         │
│    ┌───────────────┐    │
│    │    SETTINGS   │    │
│    └───────────────┘    │
│                         │
└─────────────────────────┘
```

**Interactions:**
- **START GAME:** Opens the game screen.
- **SETTINGS:** Opens the settings screen.

**Ergonomics:**
- Large touch targets.
- Buttons positioned in the central or lower thumb zone.
- Simple layout with minimal distractions.

**Navigation:**
- Start Game → Game
- Settings → Settings

---

### Screen 2 – Game Screen

**Purpose:** Main gameplay screen.

```text
┌──────────────────────────────────┐
│ SCORE: 00125                 ⚙   │
│                                  │
│                 🪨               │
│                                  │
│       🐟🦵                      │
│  ──────────────────────────────  │
│                                  │
│                                  │
└──────────────────────────────────┘
```

**Interactions:**
- **Move phone upwards:** Fish jumps.
- **Move phone downwards:** Fish ducks.
- **Keep phone steady:** Fish continues running.
- **Settings icon:** Opens the pause screen.

**Sensor input:**
- Accelerometer measures smartphone movement.
- Movement is evaluated using thresholds.
- A detected movement triggers the corresponding action.

**Ergonomics:**
- No gameplay buttons are required.
- The game uses landscape orientation.
- The settings icon remains a large, accessible touch target.

**Navigation:**
- Collision → Game Over
- Settings icon → Pause

---

### Screen 3 – Pause Screen

**Purpose:** Pause gameplay and access additional options.

```text
┌──────────────────────────────┐
│                              │
│           PAUSED             │
│                              │
│      ┌──────────────┐        │
│      │    RESUME    │        │
│      └──────────────┘        │
│                              │
│      ┌──────────────┐        │
│      │   SETTINGS   │        │
│      └──────────────┘        │
│                              │
│      ┌──────────────┐        │
│      │  MAIN MENU   │        │
│      └──────────────┘        │
│                              │
└──────────────────────────────┘
```

**Interactions:**
- **RESUME:** Continues the current game.
- **SETTINGS:** Opens the settings screen.
- **MAIN MENU:** Returns to the start screen.

**Ergonomics:**
- Large, clearly separated buttons.
- Central placement for easy touch interaction.

**Navigation:**
- Resume → Game
- Settings → Settings
- Main Menu → Start Screen

---

### Screen 4 – Game Over

**Purpose:** Show the result and allow the player to restart.

```text
┌──────────────────────────────┐
│                              │
│          GAME OVER           │
│                              │
│         SCORE: 00125         │
│         BEST: 00482          │
│                              │
│      ┌──────────────┐        │
│      │    RETRY     │        │
│      └──────────────┘        │
│                              │
│      ┌──────────────┐        │
│      │  MAIN MENU   │        │
│      └──────────────┘        │
│                              │
└──────────────────────────────┘
```

**Interactions:**
- **RETRY:** Starts a new game.
- **MAIN MENU:** Returns to the start screen.

**Ergonomics:**
- Score is displayed prominently.
- Large buttons allow easy restarting.

**Navigation:**
- Retry → Game
- Main Menu → Start Screen

---

### Screen 5 – Settings

**Purpose:** Configure the game and sensor controls.

```text
┌──────────────────────────────┐
│           SETTINGS           │
│                              │
│  Sensor sensitivity          │
│  ─────────●────────          │
│                              │
│  Sound                 ON    │
│                       [●]    │
│                              │
│  Vibration             ON    │
│                       [●]    │
│                              │
│      ┌──────────────┐        │
│      │     BACK     │        │
│      └──────────────┘        │
└──────────────────────────────┘
```

**Interactions:**
- **Sensitivity slider:** Adjusts sensor sensitivity.
- **Sound switch:** Enables or disables sound.
- **Vibration switch:** Enables or disables vibration.
- **BACK:** Returns to the previous screen.

**Ergonomics:**
- Large sliders and switches.
- Clearly labelled controls.
- Settings are accessible from the pause screen.

**Navigation:**
- Back → Previous screen

---

## 3. User Flow

```text
                 ┌─────────────┐
                 │ START SCREEN│
                 └──────┬──────┘
                        │
                    START GAME
                        ↓
                 ┌─────────────┐
                 │     GAME    │
                 │             │
                 │ Accelerometer
                 └──┬───────┬──┘
                    │       │
                Collision   ⚙
                    │       │
                    ↓       ↓
             ┌──────────┐ ┌─────────┐
             │ GAME OVER│ │  PAUSE  │
             └────┬─────┘ └────┬────┘
                  │            │
                RETRY        RESUME
                  │            │
                  └─────┬──────┘
                        ↓
                       GAME

                 PAUSE
                   │
                   ↓
                SETTINGS
                   │
                   ↓
                  BACK
                   │
                   ↓
                  PAUSE
```

---

## 4. Sensor Interaction

| Smartphone movement | Game action |
|---|---|
| Quick upward movement | Fish jumps |
| Downward movement | Fish ducks |
| No significant movement | Fish keeps running |

The accelerometer detects movement and triggers the corresponding action when a threshold is reached. The sensor should be paused when the game is paused or over.

---

## 5. Device Variation & Ergonomics

- **Device:** Smartphone
- **Platforms:** Android and iOS
- **Game orientation:** Landscape
- **Menu orientation:** Portrait or landscape
- **Input:** Accelerometer and touch
- **Touch targets:** Large buttons with sufficient spacing
- **Thumb zone:** Important menu actions placed centrally or towards the bottom of the screen
- **Accessibility:** Clear text, strong contrast and simple navigation

---

## 6. MVP – Minimum Viable Product

1. Endless running gameplay with obstacles and collision detection.
2. Accelerometer-based controls for jumping and ducking.
3. Score display, Game Over screen and restart functionality.

---

## 7. AI Usage

AI was used to help formulate and structure this storyboard. The final concept and content are the responsibility of the author.
