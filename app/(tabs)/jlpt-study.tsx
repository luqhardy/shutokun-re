import React, { useEffect, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentUser, AuthUser } from 'aws-amplify/auth';
import { API, graphqlOperation } from 'aws-amplify';
import { listUserProgresses } from '../../src/graphql/queries';
import { getAllFromDatabase } from '../../db/database';
import { UserProgress } from '../../src/API';

type MenuButtonProps = {
  color: string;
  title: string;
  subtitle?: string;
  emoji: string;
  isNew?: boolean;
  progress?: number;
};

const MenuButton: React.FC<MenuButtonProps> = ({
  color,
  title,
  subtitle,
  emoji,
  isNew = false,
  progress,
}) => {
  const router = useRouter();

  return (
    <TouchableOpacity style={[styles.menuButton, { backgroundColor: color }]} onPress={() => router.push({ pathname: '/srsWindow', params: { level: title.replace('JLPT ', '') } })}>
      <View>
        <Text style={styles.menuButtonTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuButtonSubtitle}>{subtitle}</Text>}
        {progress !== undefined && <Text style={styles.menuButtonSubtitle}>{progress}% complete</Text>}
      </View>
      <Text style={styles.menuButtonEmoji}>{emoji}</Text>
      {isNew && (
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>New</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const LanguageAppUI: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [progress, setProgress] = useState<Map<string, number>>(new Map());
  const [totalItems, setTotalItems] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    const fetchProgress = async () => {
      if (user) {
        try {
          const result: any = await API.graphql(graphqlOperation(listUserProgresses));
          const userProgressItems = result.data.listUserProgresses.items as UserProgress[];
          const progressMap = new Map<string, number>();
          userProgressItems.forEach(item => {
            const level = item.level;
            if (progressMap.has(level)) {
              progressMap.set(level, progressMap.get(level)! + 1);
            } else {
              progressMap.set(level, 1);
            }
          });
          setProgress(progressMap);
        } catch (error) {
          console.error('Error fetching user progress:', error);
        }
      }
    };

    fetchProgress();
  }, [user]);

  useEffect(() => {
    const fetchTotalItems = async () => {
      try {
        const levels = ['N1', 'N2', 'N3', 'N4', 'N5'];
        const totalItemsMap = new Map<string, number>();
        for (const level of levels) {
          const vocabRows: any[] = await getAllFromDatabase(undefined, undefined, 'SELECT COUNT(*) as count FROM vocab WHERE level = ?', [level]);
          const kanjiRows: any[] = await getAllFromDatabase(undefined, undefined, 'SELECT COUNT(*) as count FROM kanji WHERE level = ?', [level]);
          const total = vocabRows[0].count + kanjiRows[0].count;
          totalItemsMap.set(level, total);
        }
        setTotalItems(totalItemsMap);
      } catch (error) {
        console.error('Error fetching total items:', error);
      }
    };

    fetchTotalItems();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ## Header ## */}
        <View style={styles.header}>
          <View>
            <Image source={require('../../assets/images/logo.png')} style={{ width: 150, height: 50 }} contentFit="contain" />
          </View>
                    <TouchableOpacity style={styles.signInButton}>
                      <Link href="/signin-modal" asChild>
                        <TouchableOpacity style={styles.signInButton}>
                          <Text style={styles.signInButtonText}>Sign in</Text>
                        </TouchableOpacity>
                      </Link>
                    </TouchableOpacity>
        </View>

        {/* ## Main Content ## */}
        <ScrollView contentContainerStyle={styles.mainContent}>
          <Text style={styles.title}>Sign in to sync your progress</Text>

          <MenuButton
            color="#ff0000ff"
            title="JLPT N1"
            subtitle="Hardest Level"
            emoji=""
            progress={totalItems.get('N1') ? Math.round((progress.get('N1') || 0) / totalItems.get('N1')! * 100) : 0}
          />
          <MenuButton
            color="#ff9900ff"
            title="JLPT N2"
            subtitle=""
            emoji=""
            progress={totalItems.get('N2') ? Math.round((progress.get('N2') || 0) / totalItems.get('N2')! * 100) : 0}
          />
          <MenuButton
            color="#f7ce00ff"
            title="JLPT N3"
            emoji=""
            progress={totalItems.get('N3') ? Math.round((progress.get('N3') || 0) / totalItems.get('N3')! * 100) : 0}
          />
          <MenuButton
            color="#078bffff"
            title="JLPT N4"
            emoji=""
            progress={totalItems.get('N4') ? Math.round((progress.get('N4') || 0) / totalItems.get('N4')! * 100) : 0}
          />
          <MenuButton
            color="#15c03dff"
            title="JLPT N5"
            subtitle="Easiest Level"
            emoji=""
            progress={totalItems.get('N5') ? Math.round((progress.get('N5') || 0) / totalItems.get('N5')! * 100) : 0}
          />
        </ScrollView>
        
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
  },
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343A40',
  },
  logoSubtext: {
    fontSize: 10,
    color: '#6C757D',
    letterSpacing: 1,
  },
  signInButton: {
    backgroundColor: '#343A40',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  // Main Content Styles
  mainContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  title: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 25,
  },
  // Menu Button Component Styles
  menuButton: {
    width: '85%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 15,
    marginBottom: 15,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 5,
  },
  menuButtonTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuButtonSubtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.9,
  },
  menuButtonEmoji: {
    fontSize: 30,
  },
  newBadge: {
    position: 'absolute',
    top: -8,
    right: 12,
    backgroundColor: '#dc3545',
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
    // Floating Button Styles
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  floatingButtonIcon: {
      fontSize: 24,
  }
});

export default LanguageAppUI;