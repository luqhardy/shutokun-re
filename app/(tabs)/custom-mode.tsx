import React, { useState, useEffect, useCallback } from 'react';
import { Link, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { builder as kuromojiBuilder, Tokenizer, IpadicFeatures } from '@sglkc/kuromoji';
import { Asset } from 'expo-asset';
import { runCustomVocabQuery, getAllCustomVocabQuery } from '@/db/database';
import { useFocusEffect } from 'expo-router';

// !!! IMPORTANT !!!
// Replace this with the IP address of your extraction server.
// For local development with an emulator, '127.0.0.1' or 'localhost' should work.
// If running on a physical device, use your computer's local network IP address.
const SERVER_IP = '192.168.11.32';
const PDF_EXTRACTOR_URL = `http://${SERVER_IP}:5000/extract`;
const OCR_EXTRACTOR_URL = `http://${SERVER_IP}:5000/ocr`;

interface CustomSet {
  id: number;
  name: string;
  created_at: number;
}

interface VocabWithDefinition {
  term: string;
  reading: string;
  definition: string;
}

const CustomModeScreen: React.FC = () => {
  const router = useRouter();
  const [tokenizer, setTokenizer] = useState<Tokenizer<IpadicFeatures> | null>(null);
  const [isTokenizerReady, setIsTokenizerReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('Initializing language tools...');
  const [customSets, setCustomSets] = useState<CustomSet[]>([]);

  useEffect(() => {
    const initializeTokenizer = async () => {
      if (tokenizer || isTokenizerReady) return;
      console.log('Initializing tokenizer...');
      try {
        // Use expo-asset to get a URI for a bundled dictionary file
        const dictAsset = Asset.fromModule(require('/assets/kuromoji-dict/base.dat.gz'));
        await dictAsset.downloadAsync(); // Ensure the asset is available
        
        const dictUri = dictAsset.localUri || dictAsset.uri;
        // The builder needs the path to the directory, so we strip the filename
        const dictPath = dictUri.substring(0, dictUri.lastIndexOf('/') + 1);

        const builtTokenizer = await kuromojiBuilder({ dicPath: dictPath }).build();
        console.log('Tokenizer built successfully.');
        setTokenizer(builtTokenizer);
        setIsTokenizerReady(true);
      } catch (err) {
        console.error('Error building tokenizer:', err);
        Alert.alert('Error', 'Failed to load Japanese language tools.');
      }
    };

    initializeTokenizer();
  }, []);

  const fetchCustomSets = async () => {
    try {
      const sets = await getAllCustomVocabQuery<CustomSet>('SELECT * FROM custom_sets ORDER BY created_at DESC', []);
      setCustomSets(sets);
    } catch (error) {
      console.error('Failed to fetch custom sets:', error);
    }
  };

  useFocusEffect(useCallback(() => { fetchCustomSets(); }, []));

  const fetchDefinitions = async (words: string[]): Promise<VocabWithDefinition[]> => {
    const results: VocabWithDefinition[] = [];
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      setProcessingStatus(`Fetching definition for "${word}" (${i + 1}/${words.length})`);
      try {
        const response = await fetch(`https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(word)}`);
        const json = await response.json();
        if (json.data && json.data.length > 0) {
          const firstResult = json.data[0];
          results.push({
            term: word,
            reading: firstResult.japanese[0]?.reading || '',
            definition: firstResult.senses[0]?.english_definitions.join(', ') || 'No definition found.',
          });
        } else {
          results.push({ term: word, reading: '', definition: 'No definition found.' });
        }
        // Add a small delay to be polite to the API
        await new Promise(resolve => setTimeout(resolve, 150));
      } catch (error) {
        console.error(`Failed to fetch definition for ${word}:`, error);
        results.push({ term: word, reading: '', definition: 'Failed to fetch.' });
      }
    }
    return results;
  };

  const saveVocabSet = async (vocabWithDefs: VocabWithDefinition[]) => {
    if (vocabWithDefs.length === 0) {
      Alert.alert('No Vocabulary Found', 'No new vocabulary words were found.');
      return;
    }
    const setName = `Custom Set ${new Date().toLocaleString()}`;
    try {
      setProcessingStatus('Saving to database...');
      const setResult = await runCustomVocabQuery('INSERT INTO custom_sets (name, created_at) VALUES (?, ?);', [setName, Date.now()]);
      const setId = setResult.lastInsertRowId;
      if (!setId) throw new Error('Failed to create a new custom set.');

      for (const item of vocabWithDefs) {
        await runCustomVocabQuery(
          'INSERT INTO custom_vocab (set_id, term, reading, definition) VALUES (?, ?, ?, ?);',
          [setId, item.term, item.reading, item.definition]
        );
      }
      Alert.alert('Success', `Saved ${vocabWithDefs.length} words to a new set: "${setName}"`);
      fetchCustomSets();
    } catch (error) {
      console.error('Error saving vocab set:', error);
      Alert.alert('Database Error', 'Could not save the new vocabulary set.');
    }
  };

  const processTextForVocab = async (text: string) => {
    if (!tokenizer) {
      Alert.alert('Tokenizer not ready', 'Please wait for the language tools to finish loading.');
      return;
    }
    setIsProcessing(true);
    setProcessingStatus('Analyzing text...');
    setTimeout(async () => {
      try {
        const tokens = tokenizer.tokenize(text);
        const vocab = tokens.filter(token => ['名詞', '動詞', '形容詞'].includes(token.pos));
        const uniqueWords = [...new Set(vocab.map(token => token.basic_form))];
        
        const vocabWithDefs = await fetchDefinitions(uniqueWords);
        console.log('Fetched Data:', vocabWithDefs); // Log the rich data
        
        await saveVocabSet(vocabWithDefs);

      } catch (e) {
        console.error("Error during text processing:", e);
        Alert.alert("Error", "An unexpected error occurred during text processing.");
      } finally {
        setIsProcessing(false);
      }
    }, 100);
  };

  const uploadFileForExtraction = async (file: { uri: string, name: string, mimeType?: string }, url: string) => {
    if (SERVER_IP.includes('<YOUR_SERVER_IP>')) {
      Alert.alert('Configuration Needed', 'Please update the SERVER_IP in the source code with your server address.');
      return;
    }
    setIsProcessing(true);
    setProcessingStatus('Uploading file to server...');
    const formData = new FormData();
    formData.append('file', { uri: file.uri, name: file.name, type: file.mimeType } as any);
    try {
      const response = await fetch(url, { method: 'POST', body: formData, headers: { 'Content-Type': 'multipart/form-data' } });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Failed to process the file.');
      await processTextForVocab(json.text);
    } catch (error: any) {
      console.error('Error uploading file:', error);
      Alert.alert('Extraction Failed', `Could not connect to the server or process the file. ${error.message}`);
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: ['text/plain', 'application/pdf'], copyToCacheDirectory: true });
      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        if (file.mimeType === 'application/pdf') {
          await uploadFileForExtraction(file, PDF_EXTRACTOR_URL);
        } else if (file.mimeType === 'text/plain' || file.name.endsWith('.txt')) {
          const content = await FileSystem.readAsStringAsync(file.uri);
          await processTextForVocab(content);
        } else {
          Alert.alert('Unsupported File', 'Please select a .txt or .pdf file.');
        }
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'An error occurred while picking the file.');
    }
  };

  const handleScan = () => {
    Alert.alert("Select Image Source", "Where would you like to get the image from?",
      [
        { text: "Take Photo", onPress: () => pickImage(true) },
        { text: "Choose from Library", onPress: () => pickImage(false) },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const pickImage = async (useCamera: boolean) => {
    let result: ImagePicker.ImagePickerResult;
    const options: ImagePicker.ImagePickerOptions = { allowsEditing: true, quality: 0.7 };
    if (useCamera) {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) { Alert.alert("Permission Required", "Camera access is required."); return; }
      result = await ImagePicker.launchCameraAsync(options);
    } else {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) { Alert.alert("Permission Required", "Photo library access is required."); return; }
      result = await ImagePicker.launchImageLibraryAsync({ ...options, mediaTypes: ImagePicker.MediaTypeOptions.Images });
    }
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const image = result.assets[0];
      const fileName = image.uri.split('/').pop() || 'ocr-image.jpg';
      await uploadFileForExtraction({ uri: image.uri, name: fileName, mimeType: image.mimeType || 'image/jpeg' }, OCR_EXTRACTOR_URL);
    }
  };

  const renderSetItem = ({ item }: { item: CustomSet }) => (
    <TouchableOpacity style={styles.setItem} onPress={() => router.push(`/vocab-editor/${item.id}`)}>
      <View style={styles.iconContainer}><MaterialIcons name="list-alt" size={24} color="#007bff" /></View>
      <View style={styles.itemTextContainer}>
        <Text style={styles.setItemName}>{item.name}</Text>
        <Text style={styles.setItemDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#6C757D" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../../assets/images/logo.png')} style={{ width: 150, height: 50 }} contentFit="contain" />
          <Link href="/signin-modal" asChild><TouchableOpacity style={styles.signInButton}><Text style={styles.signInButtonText}>Sign in</Text></TouchableOpacity></Link>
        </View>

        <ScrollView contentContainerStyle={styles.mainContent}>
          {(isProcessing || !isTokenizerReady) && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007bff" />
              <Text style={styles.loadingText}>{isProcessing ? processingStatus : 'Initializing language tools...'}</Text>
            </View>
          )}

          <Text style={styles.title}>Create a new study set</Text>

          <TouchableOpacity style={[styles.button, { backgroundColor: '#007bff' }, !isTokenizerReady && styles.disabledButton]} onPress={handleImport} disabled={!isTokenizerReady}>
            <View style={styles.buttonContent}>
              <MaterialIcons name="attach-file" size={30} color="white" style={styles.icon} />
              <View style={styles.textContainer}>
                <Text style={styles.buttonText}>Import from File</Text>
                <Text style={styles.buttonDescription}>Select a .txt or .pdf file</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { backgroundColor: '#6f42c1' }, !isTokenizerReady && styles.disabledButton]} onPress={handleScan} disabled={!isTokenizerReady}>
            <View style={styles.buttonContent}>
              <MaterialIcons name="camera-alt" size={30} color="white" style={styles.icon} />
              <View style={styles.textContainer}>
                <Text style={styles.buttonText}>Scan with Camera</Text>
                <Text style={styles.buttonDescription}>Use OCR to extract text from an image</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />
          <Text style={styles.subTitle}>Your Custom Sets</Text>
          
          {customSets.length > 0 ? (
            <FlatList data={customSets} renderItem={renderSetItem} keyExtractor={(item) => item.id.toString()} style={styles.list} />
          ) : (
            <View style={styles.placeholder}><Text style={styles.placeholderText}>Your custom study sets will appear here.</Text></View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#E9ECEF' },
  signInButton: { backgroundColor: '#343A40', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
  signInButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  mainContent: { alignItems: 'center', paddingVertical: 40, paddingBottom: 80 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#343A40', marginBottom: 25 },
  subTitle: { fontSize: 20, fontWeight: 'bold', color: '#495057', marginTop: 20, marginBottom: 15, alignSelf: 'flex-start', paddingHorizontal: '5%' },
  button: { width: '90%', padding: 18, borderRadius: 12, marginVertical: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
  disabledButton: { backgroundColor: '#a9a9a9' },
  buttonContent: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginRight: 15 },
  textContainer: { flex: 1 },
  buttonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  buttonDescription: { color: '#fff', fontSize: 14, opacity: 0.9 },
  divider: { height: 1, width: '90%', backgroundColor: '#E9ECEF', marginVertical: 30 },
  placeholder: { width: '90%', height: 150, backgroundColor: '#FFFFFF', borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#E9ECEF', borderStyle: 'dashed' },
  placeholderText: { color: '#6C757D', fontSize: 16 },
  loadingContainer: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(248, 249, 250, 0.8)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  loadingText: { marginTop: 10, fontSize: 16, color: '#343A40' },
  list: { width: '90%' },
  setItem: { backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#E9ECEF', marginBottom: 10 },
  iconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e7f3ff', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  itemTextContainer: { flex: 1 },
  setItemName: { fontSize: 16, fontWeight: '600', color: '#343A40' },
  setItemDate: { fontSize: 12, color: '#6C757D', marginTop: 2 },
});

export default CustomModeScreen;