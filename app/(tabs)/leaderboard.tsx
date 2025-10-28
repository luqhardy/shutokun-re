
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';
import { listUserProgresses } from '../../src/graphql/queries';
import { listUsers } from 'aws-amplify/auth';
import { UserProgress as UserProgressType } from '../../src/API';

type UserProgress = UserProgressType & {
  username?: string;
};

const LeaderboardScreen: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<UserProgress[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const result: any = await API.graphql(graphqlOperation(listUserProgresses));
        const userProgressItems = result.data.listUserProgresses.items as UserProgress[];

        const users = await listUsers();
        const userMap = new Map<string, string>();
        users.forEach(user => {
          userMap.set(user.userId, user.username);
        });

        const leaderboardData = userProgressItems.map(item => ({
          ...item,
          username: userMap.get(item.owner || '') || item.owner,
        }));

        leaderboardData.sort((a, b) => (b.points || 0) - (a.points || 0));
        setLeaderboard(leaderboardData);
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
            <Text style={styles.username}>{item.username}</Text>
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
