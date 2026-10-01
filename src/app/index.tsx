import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import GameButton from "../components/GameButton";
import { useGame } from "../context/GameContext";

export default function Start() {
  const { highScore } = useGame();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FishRun</Text>
      <Text style={styles.tag}>Move your phone, move your fish.</Text>
      <GameButton title="SPIEL STARTEN" onPress={() => router.push("/game")} />
      <GameButton title="Einstellungen" secondary onPress={() => router.push("/settings")} />
      <Text style={styles.best}>Highscore: {highScore}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#12243A", alignItems: "center", justifyContent: "center", gap: 14 },
  title: { color: "#fff", fontSize: 44, fontWeight: "bold" },
  tag: { color: "#DCE6F2", fontStyle: "italic", marginBottom: 20 },
  best: { color: "#FF8A80", fontSize: 18, fontWeight: "bold", marginTop: 12 },
});