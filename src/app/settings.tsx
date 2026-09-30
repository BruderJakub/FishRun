import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import GameButton from "../components/GameButton";

export default function Settings() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Einstellungen (folgt in Block 6)</Text>
      <GameButton title="Zurück" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#12243A", alignItems: "center", justifyContent: "center", gap: 14 },
  text: { fontSize: 22, fontWeight: "bold", color: "#fff" },
});