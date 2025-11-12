import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllCustomVocabQuery } from '@/db/database';
import { MaterialIcons } from '@expo/vector-icons';

interface VocabItem {
  id: number;
  set_id: number;
  term: string;
  definition: string | null;
  reading: string | null;
}

// Function to shuffle an array
const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

const StudyCustomSetScreen: React.FC = () => {
  const { setId, setName } = useLocalSearchParams<{ setId: string; setName: string }>();
  const router = useRouter();
  
  const [words, setWords] = useState<VocabItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWords = async () => {
      if (!setId) return;
      setIsLoading(true);
      try {
        const fetchedWords = await getAllCustomVocabQuery<VocabItem>(
          'SELECT * FROM custom_vocab WHERE set_id = ?',
          [parseInt(setId, 10)]
        );
        setWords(shuffleArray(fetchedWords));
        setCurrentIndex(0);
        setShowAnswer(false);
      } catch (error) {
        console.error('Failed to fetch words for set:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadWords();
  }, [setId]);

  const handleNext = () => {
    setShowAnswer(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
  };

  const handlePrev = () => {
    setShowAnswer(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + words.length) % words.length);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#007bff" style={styles.loading} />
      </SafeAreaView>
    );
  }

  if (words.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ title: setName || 'Study Set' }} />
        <View style={styles.container}>
          <Text style={styles.noWordsText}>No words found in this set.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentWord = words[currentIndex];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: setName || 'Study Set' }} />
      <View style={styles.container}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{currentIndex + 1} / {words.length}</Text>
        </View>

        <View style={styles.flashcard}>
          <Text style={styles.termText}>{currentWord.term}</Text>
          {showAnswer && (
            <View style={styles.answerContainer}>
              <Text style={styles.answerText}>
                {currentWord.reading ? `[${currentWord.reading}]` : ''}
              </Text>
              <Text style={styles.answerText}>
                {currentWord.definition || '(No definition available)'}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.showAnswerButton} onPress={() => setShowAnswer(!showAnswer)}>
          <Text style={styles.showAnswerButtonText}>{showAnswer ? 'Hide' : 'Show'} Answer</Text>
        </TouchableOpacity>

        <View style={styles.navigationButtons}>
          <TouchableOpacity style={styles.navButton} onPress={handlePrev}>
            <MaterialIcons name="navigate-before" size={36} color="white" />
            <Text style={styles.navButtonText}>Prev</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={handleNext}>
            <Text style={styles.navButtonText}>Next</Text>
            <MaterialIcons name="navigate-next" size={36} color="white" />
          </TouchableOpacity>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noWordsText: {
    fontSize: 18,
    color: '#6C757D',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
  },
  progressText: {
    fontSize: 16,
    color: '#6C757D',
    fontWeight: '500',
  },
  flashcard: {
    width: '100%',
    minHeight: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  termText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#343A40',
  },
  answerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  answerText: {
    fontSize: 24,
    color: '#007bff',
  },
  todoText: {
    fontSize: 14,
    color: '#dc3545',
    fontStyle: 'italic',
    marginTop: 10,
  },
  showAnswerButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    backgroundColor: '#28a745',
  },
  showAnswerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#343A40',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 5,
  },
});

export default StudyCustomSetScreen;
