import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Settings } from "../lib/types";

const KEY = "fishrun:data";
const DEFAULT_SETTINGS: Settings = {
  sensitivity: 1, touch: true, motion: true, motionMode: "phone",
  voiceHints: false, sound: true, vibration: true, showHitboxes: false,
  difficulty: "normal",
};

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

  // Fragt den Server nach meiner Zeile: null = offline/Fehler, sonst exists + score
  const fetchPlayer = useCallback(async (): Promise<{ exists: boolean; score: number } | null> => {
    try {
      const { data, error } = await supabase.rpc("get_player", { p_id: playerId });
      if (error) {
        console.warn("Supabase error:", error.message);
        return null;
      }
      const row = Array.isArray(data) ? data[0] : data;
      return row ? { exists: true, score: row.score ?? 0 } : { exists: false, score: 0 };
    } catch (e) {
      console.warn("Network error:", e);
      return null;
    }
  }, [playerId]);

  // Beim App-Start abgleichen: Zeile gelöscht -> Name und Highscore zurücksetzen
  useEffect(() => {
    if (!loaded || !playerId || !playerName) return;
    (async () => {
      const server = await fetchPlayer();
      if (!server) return;
      if (!server.exists) {
        setPlayerName("");
        setHighScore(0);
      } else {
        setHighScore(server.score);
      }
    })();
  }, [loaded, playerId]); // bewusst nur einmal pro Start

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
      let name = playerName;
      let base = highScore;

      const server = await fetchPlayer();
      if (server && name && !server.exists) {
        // Zeile wurde im Dashboard gelöscht: Name und alter Highscore sind ungültig
        name = "";
        base = 0;
        setPlayerName("");
      } else if (server && server.exists) {
        base = server.score; // Server ist die Wahrheit
      }

      const finalScore = Math.max(score, base);
      setHighScore(finalScore);
      return pushScore(name, finalScore);
    },
    [highScore, playerName, fetchPlayer, pushScore]
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