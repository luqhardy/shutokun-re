import React from 'react';
import { Link } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const vocabEditor: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ## Header ## */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logoText}>Test</Text>
            <Text style={styles.logoSubtext}>TEST</Text>
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
          <Text>Vocab Editor</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
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
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  logoSubtext: {
    fontSize: 12,
    color: '#666666',
  },
  signInButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  // Main Content Styles
  mainContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

export default vocabEditor;