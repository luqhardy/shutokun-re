import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Amplify } from 'aws-amplify';
import awsconfig from '../src/aws-exports';
import { Hub } from 'aws-amplify/utils';
import { getCurrentUser, AuthUser } from 'aws-amplify/auth';
import React, { useState, useEffect } from 'react';


import { useColorScheme } from '@/hooks/use-color-scheme';

Amplify.configure(awsconfig);



function RootLayout() {
  const colorScheme = useColorScheme();
  const [user, setUser] = useState<AuthUser | null>(null);

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

    const hubListener = (data: any) => {
      switch (data.payload.event) {
        case 'signedIn':
          checkUser();
          break;
        case 'signedOut':
          setUser(null);
          break;
      }
    };

    const unsubscribe = Hub.listen('auth', hubListener);

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default RootLayout;
