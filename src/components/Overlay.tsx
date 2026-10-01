import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import GameButton from "./GameButton";

type Props = {
  mode: "pause" | "gameOver";
  score: number;
  best: number;
  onResume: () => void;
  onRetry: () => void;
  onMenu: () => void;
};

export default function Overlay({ mode, score, best, onResume, onRetry, onMenu }: Props) {
  const { width, height } = useWindowDimensions();
  const isOver = mode === "gameOver";
  return (
    <View style={[styles.overlay, { width, height }]}>
      <Text style={styles.title}>{isOver ? "GAME OVER" : "PAUSE"}</Text>
      {isOver && (
        <>
          <Text style={styles.line}>Score: {score}</Text>
          <Text style={styles.line}>{score >= best && score > 0 ? "Neuer Highscore! 🎉" : `Best: ${best}`}</Text>
        </>
      )}
      <View style={styles.buttons}>
        {isOver ? <GameButton title="Retry" onPress={onRetry} /> : <GameButton title="Weiter" onPress={onResume} />}
        {!isOver && <GameButton title="Neustart" secondary onPress={onRetry} />}
        <GameButton title="Menü" secondary onPress={onMenu} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    elevation: 100,
  },
  title: { color: "#fff", fontSize: 40, fontWeight: "bold", marginBottom: 8 },
  line: { color: "#fff", fontSize: 22, marginBottom: 4 },
  buttons: { marginTop: 16, gap: 10 },
});