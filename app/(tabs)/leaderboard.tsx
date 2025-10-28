
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';
import { listUserProgresses } from '../../src/graphql/queries';
import { UserProgress } from '../../src/API';

const LeaderboardScreen: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<UserProgress[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const result: any = await API.graphql(graphqlOperation(listUserProgresses));
        const userProgressItems = result.data.listUserProgresses.items as UserProgress[];
        userProgressItems.sort((a, b) => (b.points || 0) - (a.points || 0));
        setLeaderboard(userProgressItems);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.leaderboardItem}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Text style={styles.username}>{item.owner}</Text>
            <Text style={styles.points}>{item.points || 0}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  leaderboardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 18,
  },
  points: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LeaderboardScreen;
