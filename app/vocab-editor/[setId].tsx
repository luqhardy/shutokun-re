import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { getAllCustomVocabQuery, runCustomVocabQuery } from '@/db/database';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

interface VocabItem {
  id: number;
  set_id: number;
  term: string;
  definition: string | null;
  reading: string | null;
}

interface CustomSet {
  id: number;
  name: string;
  created_at: number;
}

const WordEditorScreen = () => {
  const { setId } = useLocalSearchParams<{ setId: string }>();
  const router = useRouter();
  const [setInfo, setSetInfo] = useState<CustomSet | null>(null);
  const [words, setWords] = useState<VocabItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingWord, setIsAddingWord] = useState(false);

  const fetchData = async () => {
    if (!setId) return;
    try {
      setIsLoading(true);
      const setIdNum = parseInt(setId, 10);
      
      const sets = await getAllCustomVocabQuery<CustomSet>('SELECT * FROM custom_sets WHERE id = ?;', [setIdNum]);
      if (sets.length > 0) setSetInfo(sets[0]);

      const fetchedWords = await getAllCustomVocabQuery<VocabItem>('SELECT * FROM custom_vocab WHERE set_id = ? ORDER BY term ASC;', [setIdNum]);
      setWords(fetchedWords);

    } catch (error) {
      console.error('Failed to fetch set data:', error);
      Alert.alert('Error', 'Could not load the vocabulary for this set.');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchData(); }, [setId]));

  const fetchDefinition = async (word: string): Promise<{ reading: string; definition: string }> => {
    try {
      const response = await fetch(`https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(word)}`);
      const json = await response.json();
      if (json.data && json.data.length > 0) {
        const firstResult = json.data[0];
        return {
          reading: firstResult.japanese[0]?.reading || '',
          definition: firstResult.senses[0]?.english_definitions.join(', ') || 'No definition found.',
        };
      }
    } catch (error) {
      console.error(`Failed to fetch definition for ${word}:`, error);
    }
    return { reading: '', definition: 'No definition found.' };
  };

  const handleAddWord = () => {
    Alert.prompt('Add New Word', 'Enter the new term:', async (term) => {
      if (term && setId) {
        setIsAddingWord(true);
        try {
          const { reading, definition } = await fetchDefinition(term);
          await runCustomVocabQuery(
            'INSERT INTO custom_vocab (set_id, term, reading, definition) VALUES (?, ?, ?, ?);',
            [parseInt(setId, 10), term, reading, definition]
          );
          fetchData();
        } catch (e) {
          Alert.alert('Error', 'Failed to add the new word.');
        } finally {
          setIsAddingWord(false);
        }
      }
    });
  };

  const handleEditWord = (item: VocabItem) => {
    Alert.prompt('Edit Word', 'Enter the new term:', async (newTerm) => {
      if (newTerm && newTerm !== item.term) {
        setIsAddingWord(true); // Reuse loading indicator
        try {
          const { reading, definition } = await fetchDefinition(newTerm);
          await runCustomVocabQuery(
            'UPDATE custom_vocab SET term = ?, reading = ?, definition = ? WHERE id = ?;',
            [newTerm, reading, definition, item.id]
          );
          fetchData();
        } catch (e) {
          Alert.alert('Error', 'Failed to update the word.');
        } finally {
          setIsAddingWord(false);
        }
      }
    }, 'plain-text', item.term);
  };

  const handleDeleteWord = (item: VocabItem) => {
    Alert.alert('Delete Word', `Are you sure you want to delete "${item.term}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await runCustomVocabQuery('DELETE FROM custom_vocab WHERE id = ?;', [item.id]);
            fetchData();
          } catch (e) {
            Alert.alert('Error', 'Failed to delete the word.');
          }
        },
      },
    ]);
  };

  const handleStudySet = () => {
    if (words.length === 0) {
      Alert.alert('Empty Set', 'Add some words to this set before you can study it.');
      return;
    }
    router.push({
      pathname: '/study-custom-set',
      params: { setId, setName: setInfo?.name || 'Custom Set' },
    });
  };

  const renderWordItem = ({ item }: { item: VocabItem }) => (
    <View style={styles.wordItem}>
      <View style={styles.itemMainContent}>
        <Text style={styles.wordTerm}>{item.term}</Text>
        <Text style={styles.wordDefinition}>{item.definition || 'No definition'}</Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => handleEditWord(item)} style={styles.actionButton}>
          <MaterialIcons name="edit" size={22} color="#6C757D" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteWord(item)} style={styles.actionButton}>
          <MaterialIcons name="delete" size={22} color="#dc3545" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: setInfo ? setInfo.name : 'Edit Set' }} />
      <View style={styles.container}>
        {(isLoading || isAddingWord) && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.loadingText}>{isAddingWord ? 'Adding word...' : 'Loading...'}</Text>
          </View>
        )}
        <View style={styles.headerContainer}>
          <View style={styles.titleBar}>
            <Text style={styles.title}>{setInfo ? setInfo.name : 'Words'}</Text>
            <TouchableOpacity style={styles.createButton} onPress={handleAddWord} disabled={isAddingWord}>
              <MaterialIcons name="add" size={24} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Add Word</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.studyButton} onPress={handleStudySet}>
            <MaterialIcons name="school" size={24} color="#FFFFFF" />
            <Text style={styles.studyButtonText}>Study This Set</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={words}
          renderItem={renderWordItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          ListEmptyComponent={() => (
            !isLoading && (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>This set is empty.</Text>
                <Text style={styles.placeholderSubText}>Press "Add Word" to start.</Text>
              </View>
            )
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
  container: { flex: 1 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(248, 249, 250, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#343A40',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  titleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#343A40' },
  createButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#007bff', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  createButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginLeft: 5 },
  studyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
  },
  studyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  list: { width: '100%', paddingHorizontal: 15, paddingTop: 10 },
  wordItem: { backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#E9ECEF', marginBottom: 10, justifyContent: 'space-between' },
  itemMainContent: { flex: 1 },
  wordTerm: { fontSize: 18, fontWeight: '500', color: '#343A40' },
  wordDefinition: { fontSize: 14, color: '#6C757D', marginTop: 4, fontStyle: 'italic' },
  actionsContainer: { flexDirection: 'row' },
  actionButton: { padding: 5, marginLeft: 10 },
  placeholder: { marginTop: 50, alignItems: 'center' },
  placeholderText: { color: '#6C757D', fontSize: 18 },
  placeholderSubText: { color: '#6C757D', fontSize: 14, marginTop: 5 },
});

export default WordEditorScreen;
