// app/leaderboard.tsx
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import GameButton from "../components/GameButton";
import { supabase } from "../lib/supabase";

type LeaderboardEntry = {
  key: number;
  player_name: string;
  score: number;
};

export default function LeaderboardScreen() {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const { data, error } = await supabase
          .from('leaderboard')
          .select('key, player_name, score')
            .gt('score', 0)
            .order('score', { ascending: false })
            .limit(10);

        if (error) {
          console.error("Error fetching leaderboard:", error.message);
        } else if (data) {
          setScores(data);
        }
      } catch (e) {
        console.error("Failed to load leaderboard", e);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Global Leaderboard 🏆</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#ED1C24" style={{ marginTop: 40 }} />
      ) : scores.length === 0 ? (
        <Text style={styles.emptyText}>No scores yet. Be the first!</Text>
      ) : (
        <FlatList
          data={scores}
          keyExtractor={(item) => item.key.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <Text style={styles.rank}>#{index + 1}</Text>
              <Text style={styles.name} numberOfLines={1}>{item.player_name}</Text>
              <Text style={styles.score}>{item.score}</Text>
            </View>
          )}
          style={styles.list}
        />
      )}

      <View style={styles.footer}>
        <GameButton title="Zurück" secondary onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#12243A", alignItems: "center", paddingVertical: 60, paddingHorizontal: 20 },
  title: { fontSize: 32, fontWeight: "bold", color: "#fff", marginBottom: 20 },
  emptyText: { color: "#9FB3C8", fontSize: 16, marginTop: 40 },
  list: { width: "100%", maxWidth: 400, marginTop: 10 },
  row: {
    flexDirection: "row",
    backgroundColor: "#1D3557",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  rank: { color: "#FFD700", fontSize: 18, fontWeight: "bold", width: 40 },
  name: { color: "#fff", fontSize: 18, flex: 1, marginHorizontal: 10 },
  score: { color: "#46DC6E", fontSize: 18, fontWeight: "bold" },
  footer: { marginTop: 20 },
});