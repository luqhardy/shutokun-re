import React, { useState, useCallback } from 'react';
import { Link, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { getAllCustomVocabQuery, runCustomVocabQuery } from '@/db/database';
import { MaterialIcons } from '@expo/vector-icons';

interface CustomSet {
  id: number;
  name: string;
  created_at: number;
}

const VocabEditorScreen: React.FC = () => {
  const router = useRouter();
  const [customSets, setCustomSets] = useState<CustomSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomSets = async () => {
    try {
      setIsLoading(true);
      const sets = await getAllCustomVocabQuery<CustomSet>('SELECT * FROM custom_sets ORDER BY created_at DESC', []);
      setCustomSets(sets);
    } catch (error) {
      console.error('Failed to fetch custom sets:', error);
      Alert.alert('Error', 'Failed to load your custom sets.');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchCustomSets(); }, []));

  const handleCreateSet = () => {
    Alert.prompt(
      'Create New Set',
      'Enter a name for your new vocabulary set:',
      async (setName) => {
        if (setName) {
          try {
            await runCustomVocabQuery('INSERT INTO custom_sets (name, created_at) VALUES (?, ?);', [setName, Date.now()]);
            Alert.alert('Success', `Set "${setName}" created.`);
            fetchCustomSets();
          } catch (error) {
            console.error('Failed to create set:', error);
            Alert.alert('Error', 'Could not create the new set.');
          }
        }
      }
    );
  };

  const handleRenameSet = (item: CustomSet) => {
    Alert.prompt(
      'Rename Set',
      'Enter a new name for the set:',
      async (newName) => {
        if (newName && newName !== item.name) {
          try {
            await runCustomVocabQuery('UPDATE custom_sets SET name = ? WHERE id = ?;', [newName, item.id]);
            Alert.alert('Success', `Set renamed to "${newName}".`);
            fetchCustomSets();
          } catch (error) {
            console.error('Failed to rename set:', error);
            Alert.alert('Error', 'Could not rename the set.');
          }
        }
      },
      'plain-text',
      item.name
    );
  };

  const handleDeleteSet = (item: CustomSet) => {
    Alert.alert(
      'Delete Set',
      `Are you sure you want to delete the set "${item.name}"? All vocabulary within it will be permanently lost.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await runCustomVocabQuery('DELETE FROM custom_sets WHERE id = ?;', [item.id]);
              Alert.alert('Success', `Set "${item.name}" has been deleted.`);
              fetchCustomSets();
            } catch (error) {
              console.error('Failed to delete set:', error);
              Alert.alert('Error', 'Could not delete the set.');
            }
          },
        },
      ]
    );
  };

  const handleOpenSet = (item: CustomSet) => {
    router.push(`/vocab-editor/${item.id}`);
  };

  const renderSetItem = ({ item }: { item: CustomSet }) => (
    <View style={styles.setItem}>
      <TouchableOpacity style={styles.itemMainContent} onPress={() => handleOpenSet(item)}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="list-alt" size={24} color="#007bff" />
        </View>
        <View style={styles.itemTextContainer}>
          <Text style={styles.setItemName}>{item.name}</Text>
          <Text style={styles.setItemDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => handleRenameSet(item)} style={styles.actionButton}>
          <MaterialIcons name="edit" size={22} color="#6C757D" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteSet(item)} style={styles.actionButton}>
          <MaterialIcons name="delete" size={22} color="#dc3545" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../../assets/images/logo.png')} style={{ width: 150, height: 50 }} contentFit="contain" />
          <Link href="/signin-modal" asChild><TouchableOpacity style={styles.signInButton}><Text style={styles.signInButtonText}>Sign in</Text></TouchableOpacity></Link>
        </View>

        <View style={styles.titleBar}>
          <Text style={styles.title}>Vocabulary Editor</Text>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateSet}>
            <MaterialIcons name="add" size={24} color="#FFFFFF" />
            <Text style={styles.createButtonText}>Create Set</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={customSets}
            renderItem={renderSetItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.list}
            ListEmptyComponent={() => (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>No custom sets found.</Text>
                <Text style={styles.placeholderSubText}>Press "Create Set" to start.</Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#E9ECEF', backgroundColor: '#FFFFFF' },
  signInButton: { backgroundColor: '#343A40', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
  signInButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  titleBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#343A40' },
  createButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#28a745', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  createButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginLeft: 5 },
  list: { width: '100%', paddingHorizontal: 15 },
  setItem: { backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#E9ECEF', marginBottom: 10, justifyContent: 'space-between' },
  itemMainContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e7f3ff', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  itemTextContainer: { flex: 1 },
  setItemName: { fontSize: 16, fontWeight: '600', color: '#343A40' },
  setItemDate: { fontSize: 12, color: '#6C757D', marginTop: 2 },
  actionsContainer: { flexDirection: 'row' },
  actionButton: { padding: 5, marginLeft: 10 },
  placeholder: { marginTop: 50, alignItems: 'center' },
  placeholderText: { color: '#6C757D', fontSize: 18 },
  placeholderSubText: { color: '#6C757D', fontSize: 14, marginTop: 5 },
});

export default VocabEditorScreen;
