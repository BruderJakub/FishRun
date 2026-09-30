import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect } from "react";

import GameWorld from "../components/GameWorld";

export default function GameScreen() {
  useEffect(() => {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE
    );

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  return <GameWorld />;
}