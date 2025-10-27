import React, { useState } from 'react';
import { Link } from 'expo-router';
import { Image } from 'expo-image';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Button,
} from 'react-native';



const hiragana = [
  { kana: 'あ', romaji: 'a' },
  { kana: 'い', romaji: 'i' },
  { kana: 'う', romaji: 'u' },
  { kana: 'え', romaji: 'e' },
  { kana: 'お', romaji: 'o' },
  { kana: 'か', romaji: 'ka' },
  { kana: 'き', romaji: 'ki' },
  { kana: 'く', romaji: 'ku' },
  { kana: 'け', romaji: 'ke' },
  { kana: 'こ', romaji: 'ko' },
  { kana: 'さ', romaji: 'sa' },
  { kana: 'し', romaji: 'shi' },
  { kana: 'す', romaji: 'su' },
  { kana: 'せ', romaji: 'se' },
  { kana: 'そ', romaji: 'so' },
  { kana: 'た', romaji: 'ta' },
  { kana: 'ち', romaji: 'chi' },
  { kana: 'つ', romaji: 'tsu' },
  { kana: 'て', romaji: 'te' },
  { kana: 'と', romaji: 'to' },
  { kana: 'な', romaji: 'na' },
  { kana: 'に', romaji: 'ni' },
  { kana: 'ぬ', romaji: 'nu' },
  { kana: 'ね', romaji: 'ne' },
  { kana: 'の', romaji: 'no' },
  { kana: 'は', romaji: 'ha' },
  { kana: 'ひ', romaji: 'hi' },
  { kana: 'ふ', romaji: 'fu' },
  { kana: 'へ', romaji: 'he' },
  { kana: 'ほ', romaji: 'ho' },
  { kana: 'ま', romaji: 'ma' },
  { kana: 'み', romaji: 'mi' },
  { kana: 'む', romaji: 'mu' },
  { kana: 'め', romaji: 'me' },
  { kana: 'も', romaji: 'mo' },
  { kana: 'や', romaji: 'ya' },
  { kana: 'ゆ', romaji: 'yu' },
  { kana: 'よ', romaji: 'yo' },
  { kana: 'ら', romaji: 'ra' },
  { kana: 'り', romaji: 'ri' },
  { kana: 'る', romaji: 'ru' },
  { kana: 'れ', romaji: 're' },
  { kana: 'ろ', romaji: 'ro' },
  { kana: 'わ', romaji: 'wa' },
  { kana: 'を', romaji: 'wo' },
  { kana: 'ん', romaji: 'n' },
];

const katakana = [
  { kana: 'ア', romaji: 'a' },
  { kana: 'イ', romaji: 'i' },
  { kana: 'ウ', romaji: 'u' },
  { kana: 'エ', romaji: 'e' },
  { kana: 'オ', romaji: 'o' },
  { kana: 'カ', romaji: 'ka' },
  { kana: 'キ', romaji: 'ki' },
  { kana: 'ク', romaji: 'ku' },
  { kana: 'ケ', romaji: 'ke' },
  { kana: 'コ', romaji: 'ko' },
  { kana: 'サ', romaji: 'sa' },
  { kana: 'シ', romaji: 'shi' },
  { kana: 'ス', romaji: 'su' },
  { kana: 'セ', romaji: 'se' },
  { kana: 'ソ', romaji: 'so' },
  { kana: 'タ', romaji: 'ta' },
  { kana: 'チ', romaji: 'chi' },
  { kana: 'ツ', romaji: 'tsu' },
  { kana: 'テ', romaji: 'te' },
  { kana: 'ト', romaji: 'to' },
  { kana: 'ナ', romaji: 'na' },
  { kana: 'ニ', romaji: 'ni' },
  { kana: 'ヌ', romaji: 'nu' },
  { kana: 'ネ', romaji: 'ne' },
  { kana: 'ノ', romaji: 'no' },
  { kana: 'ハ', romaji: 'ha' },
  { kana: 'ヒ', romaji: 'hi' },
  { kana: 'フ', romaji: 'fu' },
  { kana: 'ヘ', romaji: 'he' },
  { kana: 'ホ', romaji: 'ho' },
  { kana: 'マ', romaji: 'ma' },
  { kana: 'ミ', romaji: 'mi' },
  { kana: 'ム', romaji: 'mu' },
  { kana: 'メ', romaji: 'me' },
  { kana: 'モ', romaji: 'mo' },
  { kana: 'ヤ', romaji: 'ya' },
  { kana: 'ユ', romaji: 'yu' },
  { kana: 'ヨ', romaji: 'yo' },
  { kana: 'ラ', romaji: 'ra' },
  { kana: 'リ', romaji: 'ri' },
  { kana: 'ル', romaji: 'ru' },
  { kana: 'レ', romaji: 're' },
  { kana: 'ロ', romaji: 'ro' },
  { kana: 'ワ', romaji: 'wa' },
  { kana: 'ヲ', romaji: 'wo' },
  { kana: 'ン', romaji: 'n' },
];

const LanguageAppUI: React.FC = () => {
  const [mode, setMode] = useState<'hiragana' | 'katakana'>('hiragana');
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState(() => randomKana('hiragana'));
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [total, setTotal] = useState(0);

  function randomKana(mode: 'hiragana' | 'katakana') {
    const arr = mode === 'hiragana' ? hiragana : katakana;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function handleModeChange(newMode: 'hiragana' | 'katakana') {
    setMode(newMode);
    setScore(0);
    setTotal(0);
    setFeedback('');
    setInput('');
    setQuestion(randomKana(newMode));
  }

  function handleSubmit() {
    if (input.trim().toLowerCase() === question.romaji) {
      setScore(score + 1);
      setFeedback('Correct!');
    } else {
      setFeedback(`Wrong! (${question.kana} = ${question.romaji})`);
    }
    setTotal(total + 1);
    setInput('');
    setQuestion(randomKana(mode));
  }

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
          
          <View style={styles.modeSwitch}>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'hiragana' && styles.selected]}
              onPress={() => handleModeChange('hiragana')}
            >
              <Text style={styles.modeText}>Hiragana</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'katakana' && styles.selected]}
              onPress={() => handleModeChange('katakana')}
            >
              <Text style={styles.modeText}>Katakana</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.score}>Score: {score} / {total}</Text>
          <View style={styles.quizBox}>
            <Text style={styles.kana}>{question.kana}</Text>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Type romaji..."
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={handleSubmit}
            />
            <Button title="Submit" onPress={handleSubmit} />
            <Text style={styles.feedback}>{feedback}</Text>
          </View>
        </ScrollView>
        
        {/* ## Floating Action Button ## */}
        <TouchableOpacity style={styles.floatingButton}>
             <Text style={styles.floatingButtonIcon}>🌙</Text>
        </TouchableOpacity>
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
  },
  modeSwitch: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  modeButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
  },
  selected: {
    backgroundColor: '#aee2ff',
  },
  modeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 18,
    marginBottom: 16,
  },
  quizBox: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    minWidth: 220,
  },
  kana: {
    fontSize: 64,
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    fontSize: 20,
    marginBottom: 12,
    width: 120,
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
  },
  feedback: {
    fontSize: 18,
    marginTop: 12,
    color: '#007aff',
    minHeight: 24,
  },
});

export default LanguageAppUI;