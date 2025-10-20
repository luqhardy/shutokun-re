import React from 'react';
import { Link, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

type MenuButtonProps = {
  color: string;
  title: string;
  subtitle?: string;
  emoji: string;
  isNew?: boolean;
};

const MenuButton: React.FC<MenuButtonProps> = ({
  color,
  title,
  subtitle,
  emoji,
  isNew = false,
}) => {
  const router = useRouter();

  return (
    <TouchableOpacity style={[styles.menuButton, { backgroundColor: color }]} onPress={() => router.push({ pathname: '/srsWindow', params: { level: title.replace('JLPT ', '') } })}>
      <View>
        <Text style={styles.menuButtonTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuButtonSubtitle}>{subtitle}</Text>}
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
          />
          <MenuButton
            color="#ff9900ff"
            title="JLPT N2"
            emoji=""
          />
          <MenuButton
            color="#f7ce00ff"
            title="JLPT N3"
            emoji=""
          />
          <MenuButton
            color="#078bffff"
            title="JLPT N4"
            emoji=""
          />
          <MenuButton
            color="#15c03dff"
            title="JLPT N5"
            subtitle="Easiest Level"
            emoji=""
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