import React from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, SafeAreaView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import languagesList from '../services/languagesList.json';
import { languageResources } from '../services/i18next';
import LinearGradient from 'react-native-linear-gradient';

const LanguageDialog = ({ visible, onClose }) => {
	const { t, i18n } = useTranslation();

	const changeLanguage = lng => {
		i18n.changeLanguage(lng);
		onClose(); // Close the dialog
	};

	return (
		<Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
			<SafeAreaView style={styles.container}>
				<TouchableOpacity 
					style={styles.overlay} 
					activeOpacity={1} 
					onPress={onClose} // Close the modal when clicking outside
				/>
				<LinearGradient
					colors={['black', 'blue']}
					start={{ x: 0.1, y: 0.5 }} // Adjust the x value to move the starting point to the right
					end={{ x: 1, y: 5}}   // Adjust the x value to move the ending point to the right
					style={styles.dialogContainer}    
				>
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
				</LinearGradient>
			</SafeAreaView>
		</Modal>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'rgba(40, 40, 40, 0.5)', // Semi-transparent background
		justifyContent: 'center',
		alignItems: 'center',
	},
	dialogContainer: {
		backgroundColor: 'transparent', // Dark mode background color
		padding: 20,
		borderRadius: 20,
		width: '80%',
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
	},
	title: {
		color: 'white', // Text color
		fontSize: 18,
		marginBottom: 25,
		textAlign: 'center',
		fontWeight: '500',
	},
	languageName: {
		color: 'white', // Text color
		fontSize: 17,
		marginBottom: 5,
		fontWeight: '400'
	},
	separator: {
		height: 0.5,
		backgroundColor: 'rgba(255, 255, 255, 0.3)', // Example color
		marginVertical: 6, // Example margin
	},
});

export default LanguageDialog;