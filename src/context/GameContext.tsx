import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Settings } from "../lib/types";

const KEY = "fishrun:data";
const DEFAULT_SETTINGS: Settings = { sensitivity: 1, touch: true, motion: true, voiceHints: false, sound: true, vibration: true };

const newId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export type NameResult = "ok" | "taken" | "invalid" | "error";

type GameContextType = {
  highScore: number;
  playerName: string; // "" = noch kein Name gewählt
  settings: Settings;
  submitScore: (score: number) => Promise<boolean>;
  setName: (name: string) => Promise<NameResult>;
  updateSettings: (patch: Partial<Settings>) => void;
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [highScore, setHighScore] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        const data = raw ? JSON.parse(raw) : {};
        if (typeof data.highScore === "number") setHighScore(data.highScore);
        if (data.playerName && data.playerName !== "Anonymous") setPlayerName(data.playerName);
        if (data.settings) setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
        setPlayerId(data.playerId || newId());
      } catch (e) {
        console.warn("Load failed", e);
        setPlayerId(newId());
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(KEY, JSON.stringify({ highScore, playerName, playerId, settings })).catch((e) =>
      console.warn("Save failed", e)
    );
  }, [highScore, playerName, playerId, settings, loaded]);

  const pushScore = useCallback(
    async (name: string, score: number) => {
      if (!name || score <= 0) return false;
      try {
        const { error } = await supabase.rpc("submit_score", { p_id: playerId, p_name: name, p_score: score });
        if (error) {
          console.warn("Supabase error:", error.message);
          return false;
        }
        return true;
      } catch (e) {
        console.warn("Network error:", e);
        return false;
      }
    },
    [playerId]
  );

  const submitScore = useCallback(
    async (score: number) => {
      const finalScore = Math.max(score, highScore); // synct auch Offline-Scores
      if (score > highScore) setHighScore(score);
      return pushScore(playerName, finalScore);
    },
    [highScore, playerName, pushScore]
  );

  const setName = useCallback(
    async (raw: string): Promise<NameResult> => {
      const name = raw.trim();
      if (name.length < 3 || name.length > 20) return "invalid";
      try {
        const { data, error } = await supabase.rpc("claim_name", { p_id: playerId, p_name: name });
        if (error) {
          console.warn("Supabase error:", error.message);
          return "error";
        }
        if (data === "ok") {
          setPlayerName(name);
          pushScore(name, highScore); // vorhandenen lokalen Highscore nachtragen
          return "ok";
        }
        return data === "taken" ? "taken" : "invalid";
      } catch (e) {
        console.warn("Network error:", e);
        return "error";
      }
    },
    [playerId, highScore, pushScore]
  );

  const updateSettings = useCallback((patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch })), []);

  if (!loaded) return null;

  return (
    <GameContext.Provider value={{ highScore, playerName, settings, submitScore, setName, updateSettings }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside <GameProvider>");
  return ctx;
}