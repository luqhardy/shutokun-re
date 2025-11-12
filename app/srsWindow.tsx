import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Link } from 'expo-router';
import { Image } from 'expo-image';
import { getAllFromDatabase } from '../db/database';
import { API, graphqlOperation } from 'aws-amplify';
import { userProgressByUserId } from '../src/graphql/queries';
import { createUserProgress, updateUserProgress } from '../src/graphql/mutations';
import { UserProgress } from '../src/API';
import { getCurrentUser, AuthUser } from 'aws-amplify/auth';

type VocabRow = {
	id?: string;
	term: string;
	definition: string;
	level: string;
	srs_level: number;
	next_review_timestamp: number;
	points?: number;
};

export default function SRSWindow() {
	const { level: levelParam, type: itemTypeParam, dbName: dbNameParam, assetName: assetNameParam } = useLocalSearchParams();

	const level = (levelParam as string | undefined) ?? undefined;
	const itemType = (itemTypeParam as string | undefined) ?? 'vocab'; // 'vocab' or 'kanji'
	// Optional: allow specifying a different DB file/asset
	const dbName = dbNameParam as string | undefined;
	const assetName = assetNameParam as string | undefined;
	const [items, setItems] = useState<VocabRow[]>([]);
	const [current, setCurrent] = useState(0);
	const [showDef, setShowDef] = useState(false);
	const [loading, setLoading] = useState(true);
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
	}, []);

	useEffect(() => {
		let mounted = true;

		async function load() {
			setLoading(true);
			try {
				const lvl = level ?? 'N5';
				let rows: any[] = [];
				const now = Math.floor(Date.now() / 1000);
				if (itemType === 'kanji') {
					rows = await getAllFromDatabase<any>(dbName, assetName, 'SELECT character as term, meaning as definition, level, srs_level, next_review_timestamp FROM kanji WHERE (next_review_timestamp <= ? OR srs_level = 0) AND level = ? ORDER BY srs_level, RANDOM() LIMIT 20', [now, lvl]);
				} else {
					rows = await getAllFromDatabase<any>(dbName, assetName, 'SELECT term, definition, level, srs_level, next_review_timestamp FROM vocab WHERE (next_review_timestamp <= ? OR srs_level = 0) AND level = ? ORDER BY srs_level, RANDOM() LIMIT 20', [now, lvl]);
				}

				if (user) {
					const result: any = await API.graphql(graphqlOperation(userProgressByUserId, { userId: user.userId }));
					const userProgressItems = result.data.userProgressByUserId.items as UserProgress[];

					const mergedItems = rows.map(row => {
						const progressItem = userProgressItems.find(p => {
							try {
								const progressData = JSON.parse(p.progress);
								return progressData.term === row.term;
							} catch (e) {
								return false;
							}
						});

						if (progressItem) {
							const progressData = JSON.parse(progressItem.progress);
							return {
								...row,
								id: progressItem.id,
								srs_level: progressData.srs_level,
								next_review_timestamp: progressData.next_review_timestamp,
								points: progressItem.points,
							};
						}
						return row;
					});

					if (mounted) {
						setItems(mergedItems ?? []);
					}
				} else {
					if (mounted) {
						setItems(rows ?? []);
					}
				}

				if (mounted) {
					setCurrent(0);
					setShowDef(false);
				}
			} catch (e) {
				console.error('Failed to load vocab for level', level, e);
				if (mounted) setItems([]);
			} finally {
				if (mounted) setLoading(false);
			}
		}

		load();

		return () => {
			mounted = false;
		};
	}, [level, itemType, dbName, assetName, user]);



const srsIntervals = [0, 4 * 3600, 8 * 3600, 24 * 3600, 3 * 24 * 3600, 7 * 24 * 3600, 2 * 7 * 24 * 3600, 30 * 24 * 3600, 4 * 30 * 24 * 3600]; // 0s, 4h, 8h, 1d, 3d, 1w, 2w, 1mo, 4mo
	const handleNext = () => {
		setShowDef(false);
		setCurrent((prev) => (items.length ? (prev + 1) % items.length : 0));
	};

	const handleSrsUpdate = async (rating: 'again' | 'good') => {
	    const item = items[current];
	    if (!item) return;

		if (!user) {
			handleNext();
			return;
		}

	    let newSrsLevel = item.srs_level;
	    let points = 0;
	    switch (rating) {
	        case 'again':
	            newSrsLevel = 0;
	            break;
	        case 'good':
	            newSrsLevel++;
	            points = 10;
	            break;
	    }

		newSrsLevel = Math.min(newSrsLevel, srsIntervals.length - 1);

		const nextReviewTimestamp = Math.floor(Date.now() / 1000) + srsIntervals[newSrsLevel];

		const progressJSON = {
			term: item.term,
			definition: item.definition,
			level: item.level,
			srs_level: newSrsLevel,
			next_review_timestamp: nextReviewTimestamp,
		};

		const newPoints = (item.points || 0) + points;

		try {
			if (item.id) { // item.id is the UserProgress id
				const updateInput = {
					id: item.id,
					progress: JSON.stringify(progressJSON),
					points: newPoints,
				};
				await API.graphql(graphqlOperation(updateUserProgress, { input: updateInput }));
			} else {
				const createInput = {
					id: `${user.userId}-${item.term}`,
					userId: user.userId,
					progress: JSON.stringify(progressJSON),
					points: newPoints,
				};
				await API.graphql(graphqlOperation(createUserProgress, { input: createInput }));
			}
		} catch (e) {
			console.error("Failed to update SRS progress", e);
		} finally {
			// Move to next card
			handleNext();
		}
	};

	if (loading) {
		return (
			<View style={styles.container}>
				<ActivityIndicator size="large" />
				<Text style={{ marginTop: 12 }}>Loading...</Text>
			</View>
		);
	}

	if (!items.length) {
		return (
			<View style={styles.container}>
				<Text style={styles.question}>No items found for level {level ?? 'N5'}.</Text>
			</View>
		);
	}

		const item = items[current];

		// Kanji-focused UI
		if (itemType === 'kanji') {
			return (
				<SafeAreaView style={styles.safeArea}>
					<View style={styles.header}>
						<View>
							<Image source={require('../assets/images/logo.png')} style={{ width: 150, height: 50 }} contentFit="contain" />
						</View>
						<TouchableOpacity style={styles.signInButton}>
							<Link href="/signin-modal" asChild>
								<TouchableOpacity style={styles.signInButton}>
									<Text style={styles.signInButtonText}>Sign in</Text>
								</TouchableOpacity>
							</Link>
						</TouchableOpacity>
					</View>
					<View style={styles.container}>
						<Text style={styles.levelText}>Level: {level ?? 'N5'}</Text>

						<View style={styles.kanjiCard}>
							<Text style={styles.kanjiChar}>{item.term}</Text>
							{showDef && <Text style={styles.kanjiMeaning}>{item.definition}</Text>}
						</View>

						<Text style={styles.progressText}>{current + 1} / {items.length}</Text>

						{!showDef ? (
							<TouchableOpacity style={styles.button} onPress={() => setShowDef(true)}>
								<Text style={styles.buttonText}>Show Reading and Meaning</Text>
							</TouchableOpacity>
						) : (
							<View style={styles.buttonRow}>
								<TouchableOpacity style={styles.button} onPress={() => handleSrsUpdate('again')}>
									<Text style={styles.buttonText}>I don&apos;t know</Text>
								</TouchableOpacity>
								<TouchableOpacity style={styles.button} onPress={() => handleSrsUpdate('good')}>
									<Text style={styles.buttonText}>I know</Text>
								</TouchableOpacity>
							</View>
						)}
					</View>
				</SafeAreaView>
			);
		}

		// Vocab/default UI
		return (
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.header}>
					<View>
						<Image source={require('../assets/images/logo.png')} style={{ width: 150, height: 50 }} contentFit="contain" />
					</View>
					<TouchableOpacity style={styles.signInButton}>
						<Link href="/signin-modal" asChild>
							<TouchableOpacity style={styles.signInButton}>
								<Text style={styles.signInButtonText}>Sign in</Text>
							</TouchableOpacity>
						</Link>
					</TouchableOpacity>
				</View>
				<View style={styles.container}>
					<Text style={styles.levelText}>Level: {level ?? 'N5'}</Text>
					<Text style={styles.question}>{item.term}</Text>

					{showDef && <Text style={styles.definition}>{item.definition}</Text>}

					{!showDef ? (
						<TouchableOpacity style={styles.button} onPress={() => setShowDef(true)}>
							<Text style={styles.buttonText}>Show Reading and Meaning</Text>
						</TouchableOpacity>
					) : (
						<View style={styles.buttonRow}>
							<TouchableOpacity style={styles.button} onPress={() => handleSrsUpdate('again')}>
								<Text style={styles.buttonText}>I don&apos;t know</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.button} onPress={() => handleSrsUpdate('good')}>
								<Text style={styles.buttonText}>I know</Text>
							</TouchableOpacity>
						</View>
					)}
				</View>
			</SafeAreaView>
		);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#F8F9FA',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#E9ECEF',
	},
	signInButton: {
		backgroundColor: '#343A40',
		paddingVertical: 4,
		paddingHorizontal: 10,
		borderRadius: 8,
	},
	signInButtonText: {
		color: '#FFFFFF',
		fontWeight: '600',
		fontSize: 14,
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 24,
	},
	question: {
		fontSize: 22,
		marginBottom: 32,
		color: '#343A40',
		textAlign: 'center',
	},
	buttonRow: {
		flexDirection: 'row',
		gap: 24,
		marginBottom: 24,
	},
	button: {
		backgroundColor: '#343A40',
		paddingVertical: 16,
		paddingHorizontal: 32,
		borderRadius: 10,
	},
	buttonText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: 'bold',
	},
	result: {
		fontSize: 20,
		color: '#007bff',
		marginTop: 10,
	},
	levelText: {
		fontSize: 14,
		color: '#495057',
		marginBottom: 8,
	},
	definition: {
		fontSize: 18,
		color: '#495057',
		marginTop: 12,
		textAlign: 'center',
	},
	kanjiCard: {
		width: '90%',
		height: 280,
		backgroundColor: '#fff',
		borderRadius: 14,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.08,
		shadowRadius: 12,
		elevation: 6,
		marginBottom: 16,
	},
	kanjiChar: {
		fontSize: 120,
		lineHeight: 140,
		color: '#222',
		textAlign: 'center',
	},
	kanjiMeaning: {
		fontSize: 20,
		color: '#495057',
		marginTop: 12,
		textAlign: 'center',
	},
	progressText: {
		fontSize: 13,
		color: '#6c757d',
		marginBottom: 12,
	},
});