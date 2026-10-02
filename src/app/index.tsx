import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import GameButton from "../components/GameButton";
import { useGame } from "../context/GameContext";

export default function Start() {
  const { highScore, playerName, setName } = useGame();
  const [input, setInput] = useState(playerName);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [busy, setBusy] = useState(false);

  // Feld folgt dem gespeicherten Namen (z. B. wenn die Zeile im Dashboard gelöscht wurde)
  useEffect(() => setInput(playerName), [playerName]);

  const save = async () => {
    setBusy(true);
    const res = await setName(input);
    setBusy(false);
    if (res === "ok") setMsg({ text: "Name gespeichert ✓", ok: true });
    else if (res === "taken") setMsg({ text: "Dieser Name ist schon vergeben. Wähle einen anderen.", ok: false });
    else if (res === "invalid") setMsg({ text: "Der Name braucht 3 bis 20 Zeichen.", ok: false });
    else setMsg({ text: "Keine Verbindung. Versuche es später nochmal.", ok: false });
  };

  const changed = input.trim() !== playerName;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Image source={require("../assets/fish.png")} style={styles.fish} resizeMode="contain" />

        <Text style={styles.title}>
          Fish<Text style={styles.run}>Run</Text>
        </Text>
        <Text style={styles.tag}>Move your phone, move your fish.</Text>

        <View style={styles.nameBox}>
          <Text style={styles.label}>Spielername</Text>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={(t) => {
              setInput(t);
              setMsg(null);
            }}
            placeholder="z. B. FishMaster"
            placeholderTextColor="#6F86A0"
            maxLength={20}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {msg && <Text style={[styles.msg, { color: msg.ok ? "#46DC6E" : "#FF8A80" }]}>{msg.text}</Text>}
          {changed && (
            <GameButton title={busy ? "Prüfe…" : "Name speichern"} secondary onPress={busy ? () => {} : save} />
          )}
        </View>

        <GameButton title="SPIEL STARTEN" onPress={() => router.push("/game")} />
        <GameButton title="Einstellungen" secondary onPress={() => router.push("/settings")} />
        <GameButton title="Leaderboard" secondary onPress={() => router.push("/leaderboard")} />
        <Text style={styles.best}>Highscore: {highScore}</Text>
        {!playerName && <Text style={styles.hint}>Ohne Namen wird dein Score nicht im Leaderboard gespeichert.</Text>}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#12243A", alignItems: "center", justifyContent: "center", gap: 14, padding: 24 },
  fish: { width: 160, height: 120 },
  title: { color: "#fff", fontSize: 44, fontWeight: "bold" },
  run: { color: "#ED1C24" },
  tag: { color: "#DCE6F2", fontStyle: "italic", marginBottom: 8 },
  nameBox: { width: 240, gap: 8, marginBottom: 8 },
  label: { color: "#9FB3C8", fontSize: 13, fontWeight: "bold" },
  input: {
    backgroundColor: "#1C3450", color: "#fff", fontSize: 18, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, borderWidth: 2, borderColor: "#2E4A6B",
  },
  msg: { fontSize: 14 },
  best: { color: "#FF8A80", fontSize: 18, fontWeight: "bold", marginTop: 8 },
  hint: { color: "#9FB3C8", fontSize: 12, textAlign: "center", maxWidth: 260 },
});