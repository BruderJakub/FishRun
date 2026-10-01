import { Stack } from "expo-router";
import { GameProvider } from "../context/GameContext";

export default function Layout() {
  return (
    <GameProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </GameProvider>
  );
}