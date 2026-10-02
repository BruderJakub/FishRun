import { Modal, StyleSheet, Text, View } from "react-native";
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
  const isOver = mode === "gameOver";
  return (
    <Modal
      visible
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      supportedOrientations={["landscape", "landscape-left", "landscape-right"]}
      onRequestClose={isOver ? onMenu : onResume} // Android-Zurück-Taste
    >
      <View style={styles.overlay}>
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
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: { color: "#fff", fontSize: 40, fontWeight: "bold", marginBottom: 8 },
  line: { color: "#fff", fontSize: 22, marginBottom: 4 },
  buttons: { marginTop: 16, gap: 10 },
});