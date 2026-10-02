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

  // mindestens eine Steuerung muss aktiv bleiben
  const onlyTouch = settings.touch && !settings.motion;
  const onlyMotion = settings.motion && !settings.touch;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Einstellungen</Text>

      <Text style={styles.section}>Schwierigkeit</Text>
      <Checkbox
        label="Normal"
        description="Gemütliches Tempo, Punkte ×1"
        checked={settings.difficulty === "normal"}
        onChange={() => updateSettings({ difficulty: "normal" })}
      />
      <Checkbox
        label="Hard"
        description="Wird schneller und schneller, Punkte ×2"
        checked={settings.difficulty === "hard"}
        onChange={() => updateSettings({ difficulty: "hard" })}
      />

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
        description="Mit dem Sensor spielen"
        checked={settings.motion}
        disabled={onlyMotion}
        onChange={(v) => updateSettings({ motion: v })}
      />
      <Text style={styles.hint}>Mindestens eine Steuerung muss aktiv bleiben.</Text>

      {settings.motion && (
        <View style={styles.sub}>
          <Text style={styles.subTitle}>Art der Bewegung</Text>
          <Checkbox
            label="Handy bewegen"
            description="Handy hoch = springen, runter = ducken"
            checked={settings.motionMode === "phone"}
            onChange={() => updateSettings({ motionMode: "phone" })}
          />
          <Checkbox
            label="Körper-Modus"
            description="Du springst oder gehst in die Hocke, der Fisch macht es nach. Mit dem Sensor spielen. Punkte ×2,25, wenn Touch aus ist"
            checked={settings.motionMode === "body"}
            onChange={() => updateSettings({ motionMode: "body" })}
          />
          {settings.motionMode === "body" && (
            <Text style={styles.hint}>
              Handy fest halten oder in die Tasche stecken. Spiele auf einer freien Fläche. Springen wird zuverlässiger
              erkannt als Ducken. Passe bei Bedarf die Empfindlichkeit an.
            </Text>
          )}
        </View>
      )}

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
      <Checkbox
        label="Hitboxen anzeigen"
        description="Rote Rahmen und Sensorwert zum Testen"
        checked={settings.showHitboxes}
        onChange={(v) => updateSettings({ showHitboxes: v })}
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
  sub: { marginTop: 10, marginLeft: 12, paddingLeft: 14, borderLeftWidth: 3, borderLeftColor: "#2E4A6B" },
  subTitle: { color: "#9FB3C8", fontSize: 13, fontWeight: "bold", marginBottom: 2 },
  sliderBox: { marginTop: 16, backgroundColor: "#1C3450", borderRadius: 14, padding: 16 },
  sliderLabels: { flexDirection: "row", justifyContent: "space-between" },
});