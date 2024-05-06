import React from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, SafeAreaView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import languagesList from '../services/languagesList.json';
import { languageResources } from '../services/i18next';
import { BlurView } from 'expo-blur';

const LanguageDialog = ({ visible, onClose }) => {
	const { t, i18n } = useTranslation();

	const changeLanguage = lng => {
		i18n.changeLanguage(lng);
		onClose(); // Close the dialog
	};

	return (
		<Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
			<SafeAreaView style={styles.container}>
				<BlurView intensity={40} style={styles.overlay}>
					<TouchableOpacity 
						style={styles.overlay} 
						activeOpacity={1} 
						onPress={onClose} // Close the modal when clicking outside
					/>
				</BlurView>
				<BlurView intensity={50} style={styles.dialogContainer}>
					<View>
						<Text style={styles.title}>{t('select-language')}</Text>
						<FlatList 
							data={Object.keys(languageResources)}
							renderItem={({item}) => (
								<TouchableOpacity onPress={() => changeLanguage(item)}>
									<Text style={styles.languageName}>{languagesList[item].nativeName}</Text>
								</TouchableOpacity>
							)}
							ItemSeparatorComponent={() => (
								<View style={styles.separator} />
							)} 
						/>
					</View>
				</BlurView>
			</SafeAreaView>
		</Modal>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent background
		justifyContent: 'center',
		alignItems: 'center'
	},
	dialogContainer: {
		padding: 25,
		paddingBottom: 35,
		borderRadius: 20,
		width: '80%',
		overflow: 'hidden',
		backgroundColor: 'rgba(0,0,0,0.4)'
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
	},
	title: {
		color: 'white', // Text color
		fontSize: 18,
		marginBottom: 25,
		textAlign: 'center',
		fontFamily: 'Inter-Medium',
	},
	languageName: {
		color: 'white', // Text color
		fontSize: 17,
		marginBottom: 5,
		fontFamily: 'Inter-Regular',
	},
	separator: {
		height: 0.5,
		backgroundColor: 'rgba(255, 255, 255, 0.3)', // Example color
		marginVertical: 6, // Example margin
	},
});

export default LanguageDialog;