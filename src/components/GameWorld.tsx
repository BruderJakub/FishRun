import { Image, StyleSheet, View } from "react-native";

export default function GameWorld() {
  return (
    <View style={styles.container}>
        <View style={styles.sky} />

        <Image
            source={require("../assets/fish.png")}
            style={styles.fish}
        />

        <View style={styles.obstacle} />

        <View style={styles.ground} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  sky: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#9BD7F0",
    },

  fish: {
    position: "absolute",
    left: 120,
    bottom: 80,
    width: 90,
    height: 90,
    },

  obstacle: {
    position: "absolute",
    right: 150,
    bottom: 80,
    width: 50,
    height: 70,
    backgroundColor: "#12243A",
  },

  ground: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 80,
    backgroundColor: "#4E7E52",
  },
});