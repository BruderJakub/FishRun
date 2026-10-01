import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
};

export default function Checkbox({ label, description, checked, onChange, disabled }: Props) {
  return (
    <Pressable
      style={[styles.row, disabled && styles.disabled]}
      onPress={() => !disabled && onChange(!checked)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={label}
      accessibilityHint={description}
    >
      <View style={[styles.box, checked && styles.boxOn]}>
        {checked && <Text style={styles.tick}>✓</Text>}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        {description ? <Text style={styles.desc}>{description}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 10 },
  disabled: { opacity: 0.5 },
  box: {
    width: 30, height: 30, borderRadius: 8, borderWidth: 2, borderColor: "#78909C",
    alignItems: "center", justifyContent: "center",
  },
  boxOn: { backgroundColor: "#ED1C24", borderColor: "#ED1C24" },
  tick: { color: "#fff", fontSize: 20, fontWeight: "bold", marginTop: -2 },
  label: { color: "#fff", fontSize: 17, fontWeight: "bold" },
  desc: { color: "#9FB3C8", fontSize: 13, marginTop: 2 },
});