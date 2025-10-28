import { Link, useRouter } from 'expo-router';
import { signIn, signInWithRedirect, getCurrentUser } from 'aws-amplify/auth';
import { StyleSheet, TextInput, TouchableOpacity, Text, View } from 'react-native';
import React, { useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { getUserProgress, userProgressByUserId } from '../src/graphql/queries';
import { createUserProgress } from '../src/graphql/mutations';
//import { ThemedText } from '@/components/themed-text';
//import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchOrCreateUserProgress = async () => {
    try {
      const { userId } = await getCurrentUser();
      const userProgress = await API.graphql(graphqlOperation(userProgressByUserId, { userId: userId }));

      // @ts-ignore
      if (userProgress.data.userProgressByUserId.items.length > 0) {
        // User progress already exists
        // You can store it in your app's state here
      } else {
        // User progress does not exist, create it
        await API.graphql(graphqlOperation(createUserProgress, { input: { id: userId, userId: userId, progress: JSON.stringify({}), points: 0 } }));
      }
    } catch (error) {
      console.error('Error fetching or creating user progress:', error);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('メールとパスワードを入力してください');
      return;
    }
    try {
      await signIn({ username: email, password });
      await fetchOrCreateUserProgress();
      router.back();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithRedirect({ provider: 'Google' });
      await fetchOrCreateUserProgress();
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalWindow}>
        <Text style={styles.title}>Sign In</Text>
        <TextInput
          style={styles.input}
          placeholder="メールアドレス"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="パスワード"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
        <Link href="/" dismissTo style={styles.link}>
          <Text style={styles.linkText}>Go to home screen</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalWindow: {
    width: '90%',
    maxWidth: 350,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
    alignItems: 'center',
  },
  googleButton: {
    backgroundColor: '#fff',
    borderColor: '#4285F4',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    color: '#4285F4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#343A40',
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  button: {
    backgroundColor: '#343A40',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#dc3545',
    marginBottom: 10,
  },
  link: {
    marginTop: 10,
    paddingVertical: 10,
  },
  linkText: {
    color: '#007bff',
    fontSize: 16,
  },
});
