import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { Settings } from "../lib/types";

const KEY = "fishrun:data";
const DEFAULT_SETTINGS: Settings = { sensitivity: 1, touch: true, motion: true, voiceHints: false, sound: true, vibration: true };

type GameContextType = {
  highScore: number;
  settings: Settings;
  submitScore: (score: number) => void;
  updateSettings: (patch: Partial<Settings>) => void;
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [highScore, setHighScore] = useState(0);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  // load once at app start
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const data = JSON.parse(raw);
          if (typeof data.highScore === "number") setHighScore(data.highScore);
          if (data.settings) setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
        }
      } catch (e) {
        console.warn("Load failed", e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // save on every change (but only after loading, so we never overwrite with defaults)
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(KEY, JSON.stringify({ highScore, settings })).catch((e) =>
      console.warn("Save failed", e)
    );
  }, [highScore, settings, loaded]);

  const submitScore = useCallback((score: number) => setHighScore((h) => Math.max(h, score)), []);
  const updateSettings = useCallback((patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch })), []);

  if (!loaded) return null; // short blank moment while loading

  return (
    <GameContext.Provider value={{ highScore, settings, submitScore, updateSettings }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside <GameProvider>");
  return ctx;
}