import { Pressable, StyleSheet, Text } from "react-native";

type Props = { title: string; onPress: () => void; secondary?: boolean };

export default function GameButton({ title, onPress, secondary }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.btn, secondary && styles.secondary]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { backgroundColor: "#ED1C24", paddingVertical: 14, width: 240, borderRadius: 14, alignItems: "center" },
  secondary: { backgroundColor: "transparent", borderWidth: 2, borderColor: "#78909C" },
  text: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});