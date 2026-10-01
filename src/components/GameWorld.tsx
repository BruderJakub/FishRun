import { Image, Pressable, StyleSheet, View } from "react-native";
import useGameLoop from "../hooks/useGameLoop";

export default function GameWorld() {
    const { obstacleX, fishY, jump } = useGameLoop();
    
    return (
        <Pressable
            style={{ flex: 1 }}
            onPress={jump}
        >
            <View style={styles.container}>
            <View style={styles.sky} />

            <Image
                source={require("../assets/fish.png")}
                style={[
                styles.fish,
                {
                    bottom: 80 + fishY,
                },
                ]}
            />

            <View
                style={[
                styles.obstacle,
                {
                    left: obstacleX,
                },
                ]}
            />

            <View style={styles.ground} />
            </View>
        </Pressable>
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