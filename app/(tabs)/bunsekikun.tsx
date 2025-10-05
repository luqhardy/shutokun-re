import React from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet } from 'react-native';

export default function Bunsekikun() {
  return (
    <WebView
      style={styles.container}
      source={{ uri: 'https://bunsekikun.luqmanhadi.com' }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});