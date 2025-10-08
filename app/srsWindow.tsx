import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const questions = [
	{ id: 1, text: '「犬」はdogである。', answer: true },
	{ id: 2, text: '「猫」はbirdである。', answer: false },
];

export default function SRSWindow() {
	const [current, setCurrent] = useState(0);
	const [result, setResult] = useState<string | null>(null);

	const handleAnswer = (userAnswer: boolean) => {
		if (userAnswer === questions[current].answer) {
			setResult('正解！');
		} else {
			setResult('不正解');
		}
		setTimeout(() => {
			setResult(null);
			setCurrent((prev) => (prev + 1) % questions.length);
		}, 1000);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.question}>{questions[current].text}</Text>
			<View style={styles.buttonRow}>
				<TouchableOpacity style={styles.button} onPress={() => handleAnswer(true)}>
					<Text style={styles.buttonText}>True</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.button} onPress={() => handleAnswer(false)}>
					<Text style={styles.buttonText}>False</Text>
				</TouchableOpacity>
			</View>
			{result && <Text style={styles.result}>{result}</Text>}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F8F9FA',
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
});
