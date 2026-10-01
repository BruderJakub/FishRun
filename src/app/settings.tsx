import Slider from "@react-native-community/slider";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import Checkbox from "../components/Checkbox";
import GameButton from "../components/GameButton";
import { useGame } from "../context/GameContext";

export default function Settings() {
  const { settings, updateSettings } = useGame();
  const [sens, setSens] = useState(settings.sensitivity);

  // at least one control method must stay on
  const onlyTouch = settings.touch && !settings.motion;
  const onlyMotion = settings.motion && !settings.touch;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Einstellungen</Text>

      <Text style={styles.section}>Steuerung (Handicap-Modus)</Text>
      <Checkbox
        label="Touch-Steuerung"
        description="Links tippen = springen, rechts halten = ducken"
        checked={settings.touch}
        disabled={onlyTouch}
        onChange={(v) => updateSettings({ touch: v })}
      />
      <Checkbox
        label="Bewegungssteuerung"
        description="Handy hoch = springen, runter = ducken"
        checked={settings.motion}
        disabled={onlyMotion}
        onChange={(v) => updateSettings({ motion: v })}
      />
      <Text style={styles.hint}>Mindestens eine Steuerung muss aktiv bleiben.</Text>

      <View style={[styles.sliderBox, !settings.motion && { opacity: 0.4 }]}>
        <Text style={styles.label}>Sensor-Empfindlichkeit: {sens.toFixed(1)}</Text>
        <Slider
          minimumValue={0.5}
          maximumValue={2}
          step={0.1}
          value={sens}
          disabled={!settings.motion}
          minimumTrackTintColor="#ED1C24"
          maximumTrackTintColor="#4A6283"
          thumbTintColor="#fff"
          onValueChange={setSens}
          onSlidingComplete={(v) => updateSettings({ sensitivity: v })}
          accessibilityLabel="Sensor-Empfindlichkeit"
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.hint}>niedrig</Text>
          <Text style={styles.hint}>hoch</Text>
        </View>
      </View>

      <Text style={styles.section}>Barrierefreiheit</Text>
      <Checkbox
        label="Sprachhinweise (Blind-Modus)"
        description={'Sagt „Spring!“ oder „Duck!“ kurz vor einem Hindernis'}
        checked={settings.voiceHints}
        onChange={(v) => updateSettings({ voiceHints: v })}
      />

      <Text style={styles.section}>Sonstiges</Text>
      <Checkbox
        label="Vibration"
        description="Kurzes Vibrieren bei Game Over"
        checked={settings.vibration}
        onChange={(v) => updateSettings({ vibration: v })}
      />
      <Checkbox
        label="Sound"
        description="folgt später"
        checked={settings.sound}
        onChange={(v) => updateSettings({ sound: v })}
      />

      <View style={{ marginTop: 24, alignItems: "center" }}>
        <GameButton title="Zurück" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#12243A" },
  content: { padding: 24, paddingBottom: 48, width: "100%", maxWidth: 600, alignSelf: "center" },
  title: { color: "#fff", fontSize: 32, fontWeight: "bold", marginBottom: 12 },
  section: { color: "#FF8A80", fontSize: 14, fontWeight: "bold", letterSpacing: 1, marginTop: 20, marginBottom: 4 },
  label: { color: "#fff", fontSize: 17, fontWeight: "bold", marginBottom: 6 },
  hint: { color: "#9FB3C8", fontSize: 13 },
  sliderBox: { marginTop: 16, backgroundColor: "#1C3450", borderRadius: 14, padding: 16 },
  sliderLabels: { flexDirection: "row", justifyContent: "space-between" },
});