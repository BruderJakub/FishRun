import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = { score: number; best: number; motionActive: boolean; onPause: () => void };

export default function Hud({ score, best, motionActive, onPause }: Props) {
  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <View style={styles.left}>
        <Text style={styles.score}>Score: {score}</Text>
        <Text style={styles.best}>Best: {best}</Text>
      </View>

      <View style={styles.chip}>
        <View style={[styles.dot, { backgroundColor: motionActive ? "#46DC6E" : "#999" }]} />
        <Text style={styles.chipText}>{motionActive ? "Motion aktiv" : "Motion aus"}</Text>
      </View>

      <Pressable style={styles.pause} onPress={onPause}>
        <View style={styles.bar} />
        <View style={styles.bar} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  left: { position: "absolute", top: 16, left: 20 },
  score: { fontSize: 28, fontWeight: "bold", color: "#12243A" },
  best: { fontSize: 16, color: "#28465F" },
  chip: {
    position: "absolute", top: 16, alignSelf: "center", flexDirection: "row", alignItems: "center",
    backgroundColor: "#12243A", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16,
  },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  chipText: { color: "#fff", fontSize: 14 },
  pause: {
    position: "absolute", top: 12, right: 20, width: 44, height: 44, borderRadius: 22,
    backgroundColor: "#12243A", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5,
  },
  bar: { width: 5, height: 18, backgroundColor: "#fff", borderRadius: 2 },
});