import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useState } from "react";

import GameWorld from "../components/GameWorld";

export default function GameScreen() {
  const [status, setStatus] = useState("playing");

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  return <GameWorld onGameOver={() => setStatus("gameOver")} />;
}