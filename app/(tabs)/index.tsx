import React from 'react';
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

import { MaterialIcons } from '@expo/vector-icons';



const LanguageAppUI: React.FC = () => {
  const router = useRouter();

  const menuItems = [
    { title: 'JLPT Study', description: 'Prepare for the Japanese Language Proficiency Test', icon: 'school', color: '#28a745', route: '/jlpt-study' },
    { title: 'Hiragana', description: 'Learn and practice Hiragana characters', icon: 'translate', color: '#17a2b8', route: '/kana-quiz' },
    { title: 'Custom Mode (Beta)', description: 'Create your own custom study sets', icon: 'create', color: '#007bff', route: '/custom-mode' },
    { title: 'Vocab Editor (Beta)', description: 'Edit and manage your vocabulary lists', icon: 'edit', color: '#ffd000ff', route: '/vocab-editor' },
    { title: 'Japanese Sentence Analyser', description: 'Analyse Japanese sentences to understand grammar and vocabulary', icon: 'analytics', color: '#6f42c1', route: '/bunsekikun', isNew: true },
  ];

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

          {menuItems.map(item => (
            <TouchableOpacity
              key={item.title}
              style={[styles.button, { backgroundColor: item.color }]}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.buttonContent}>
                <MaterialIcons name={item.icon as any} size={30} color="white" style={styles.icon} />
                <View style={styles.textContainer}>
                    <Text style={styles.buttonText}>{item.title}</Text>
                    <Text style={styles.buttonDescription}>{item.description}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },

  mainContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  title: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 25,
  },

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
    shadowOpacity: 0.2,
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
  },
  button: {
    width: '90%',
    padding: 18,
    borderRadius: 12,
    marginVertical: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 15,
  },
  textContainer: {
      flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonDescription: {
      color: '#fff',
      fontSize: 14,
  }
});

export default LanguageAppUI;