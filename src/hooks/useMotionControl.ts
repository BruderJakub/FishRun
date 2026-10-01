import * as ScreenOrientation from "expo-screen-orientation";
import { Accelerometer } from "expo-sensors";
import { useEffect, useRef, useState } from "react";

const BASE_THRESHOLD = 0.35; // in g, gets divided by sensitivity
const COOLDOWN_MS = 300;
const AXIS_SIGN = 1;         // set to -1 if up/down feel swapped on your phone

type Opts = {
  enabled: boolean;
  sensitivity?: number; // 0.5 - 2.0, comes from settings later
  onJump: () => void;
  onDuck: () => void;
};

export default function useMotionControl({ enabled, sensitivity = 1, onJump, onDuck }: Opts) {
  const [delta, setDelta] = useState(0); // only for the debug display
  const cb = useRef({ onJump, onDuck });
  cb.current = { onJump, onDuck };

  const orientationSign = useRef(1);       // +1 landscape-left, -1 landscape-right
  const baseline = useRef<number | null>(null);

  // follow the phone's rotation: the sensor axis flips when the screen flips
  useEffect(() => {
    const update = (o: ScreenOrientation.Orientation) => {
      const next = o === ScreenOrientation.Orientation.LANDSCAPE_RIGHT ? -1 : 1;
      if (next !== orientationSign.current) {
        orientationSign.current = next;
        baseline.current = null; // start fresh after a rotation
      }
    };
    ScreenOrientation.getOrientationAsync().then(update);
    const sub = ScreenOrientation.addOrientationChangeListener((e) => update(e.orientationInfo.orientation));
    return () => ScreenOrientation.removeOrientationChangeListener(sub);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    baseline.current = null;
    let lastEvent = 0;
    Accelerometer.setUpdateInterval(20);

    const sub = Accelerometer.addListener(({ x }) => {
      const v = x * AXIS_SIGN * orientationSign.current;
      if (baseline.current === null) baseline.current = v;
      baseline.current += (v - baseline.current) * 0.1; // slow low-pass = resting position
      const d = v - baseline.current;                   // quick change = movement
      setDelta(d);

      const now = Date.now();
      if (now - lastEvent < COOLDOWN_MS) return;        // cooldown prevents fake duck after a jump
      const threshold = BASE_THRESHOLD / sensitivity;
      if (d > threshold) { lastEvent = now; cb.current.onJump(); }
      else if (d < -threshold) { lastEvent = now; cb.current.onDuck(); }
    });
    return () => sub.remove();
  }, [enabled, sensitivity]);

  return { delta };
}