import { Tabs } from 'expo-router';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const LogoHeader = () => (
  <></>
);

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerTitle: () => <LogoHeader />,
        headerTitleAlign: 'center',
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="jlpt-study"
        options={{
          title: 'JLPT Study',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="kana-quiz"
        options={{
          title: 'Kana Quiz',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="quiz" color={color} />,
        }}
      />
      <Tabs.Screen
        name="custom-mode"
        options={{
          title: 'Custom Mode',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="settings" color={color} />,
        }}
      />
      <Tabs.Screen
        name="vocab-editor"
        options={{
          title: 'Vocab Editor',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="edit" color={color} />,
        }}
      />
      <Tabs.Screen
        name="bunsekikun"
        options={{
          title: 'Bunsekikun',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="magnify-scan" size={24} color={color} />,
        }}
      />
      
    </Tabs>
  );
}
