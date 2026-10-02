import * as ScreenOrientation from "expo-screen-orientation";
import { Accelerometer } from "expo-sensors";
import { useEffect, useRef, useState } from "react";

export type MotionMode = "phone" | "body";

// Modus "phone": Handy hoch/runter bewegen
const PHONE_THRESHOLD = 0.35;   // in g, wird durch die Empfindlichkeit geteilt
const PHONE_COOLDOWN_MS = 300;
const AXIS_SIGN = 1;            // auf -1 setzen, falls hoch/runter vertauscht ist

// Modus "body": Person springt / geht in die Hocke
const BODY_JUMP_THRESHOLD = 0.6;  // kräftiger Ausschlag beim Abheben
const BODY_DUCK_THRESHOLD = 0.3;  // schwächerer Ausschlag beim Hinhocken
const BODY_COOLDOWN_MS = 700;     // deckt Flug und Landung ab
const GRAVITY_ALPHA = 0.02;       // langsamer Filter für die Schwerkraft-Richtung

type Opts = {
  enabled: boolean;
  mode: MotionMode;
  sensitivity?: number; // 0.5 - 2.0
  debug?: boolean;      // nur dann wird der Messwert angezeigt
  onJump: () => void;
  onDuck: () => void;
};

export default function useMotionControl({ enabled, mode, sensitivity = 1, debug = false, onJump, onDuck }: Opts) {
  const [delta, setDelta] = useState(0);
  const cb = useRef({ onJump, onDuck });
  cb.current = { onJump, onDuck };

  const orientationSign = useRef(1);                     // +1 landscape-left, -1 landscape-right
  const baseline = useRef<number | null>(null);          // Ruheposition (phone)
  const gravity = useRef<{ x: number; y: number; z: number } | null>(null); // (body)

  // Achse folgt der Handydrehung (nur für "phone")
  useEffect(() => {
    const update = (o: ScreenOrientation.Orientation) => {
      const next = o === ScreenOrientation.Orientation.LANDSCAPE_RIGHT ? -1 : 1;
      if (next !== orientationSign.current) {
        orientationSign.current = next;
        baseline.current = null;
      }
    };
    ScreenOrientation.getOrientationAsync().then(update);
    const sub = ScreenOrientation.addOrientationChangeListener((e) => update(e.orientationInfo.orientation));
    return () => ScreenOrientation.removeOrientationChangeListener(sub);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    baseline.current = null;
    gravity.current = null;
    let lastEvent = 0;
    Accelerometer.setUpdateInterval(20);

    const sub = Accelerometer.addListener(({ x, y, z }) => {
      const now = Date.now();

      if (mode === "phone") {
        const v = x * AXIS_SIGN * orientationSign.current;
        if (baseline.current === null) baseline.current = v;
        baseline.current += (v - baseline.current) * 0.1;
        const d = v - baseline.current;
        if (debug) setDelta(d);

        if (now - lastEvent < PHONE_COOLDOWN_MS) return;
        const t = PHONE_THRESHOLD / sensitivity;
        if (d > t) { lastEvent = now; cb.current.onJump(); }
        else if (d < -t) { lastEvent = now; cb.current.onDuck(); }
        return;
      }

      // --- body: Beschleunigung entlang der Schwerkraft, unabhängig von der Handyhaltung ---
      if (!gravity.current) gravity.current = { x, y, z };
      const g = gravity.current;
      g.x += (x - g.x) * GRAVITY_ALPHA;
      g.y += (y - g.y) * GRAVITY_ALPHA;
      g.z += (z - g.z) * GRAVITY_ALPHA;
      const gm = Math.hypot(g.x, g.y, g.z) || 1;
      const v = ((x - g.x) * g.x + (y - g.y) * g.y + (z - g.z) * g.z) / gm; // + = hoch, - = runter
      if (debug) setDelta(v);

      if (now - lastEvent < BODY_COOLDOWN_MS) return;
      if (v > BODY_JUMP_THRESHOLD / sensitivity) { lastEvent = now; cb.current.onJump(); }
      else if (v < -BODY_DUCK_THRESHOLD / sensitivity) { lastEvent = now; cb.current.onDuck(); }
    });
    return () => sub.remove();
  }, [enabled, mode, sensitivity, debug]);

  return { delta };
}