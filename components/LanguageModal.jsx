import React from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, SafeAreaView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import languagesList from '../services/languagesList.json';
import { languageResources } from '../services/i18next';
import LinearGradient from 'react-native-linear-gradient';
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
				<BlurView intensity={90} style={styles.overlay}>
					<TouchableOpacity 
						style={styles.overlay} 
						activeOpacity={1} 
						onPress={onClose} // Close the modal when clicking outside
					/>
				</BlurView>
				<BlurView intensity={80} style={styles.dialogContainer}>
					<LinearGradient
						style={StyleSheet.absoluteFillObject}
						colors={['rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 120, 0.5)']}
						start={{ x: 0.1, y: 0.5 }} // Adjust the x value to move the starting point to the right
						end={{ x: 1, y: 5}}   // Adjust the x value to move the ending point to the right
					/>
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
		backgroundColor: 'rgba(80, 80, 80, 0.4)', // Semi-transparent background
		justifyContent: 'center',
		alignItems: 'center'
	},
	dialogContainer: {
		padding: 25,
		paddingBottom: 25,
		borderRadius: 20,
		width: '80%',
		overflow: 'hidden',
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
		fontFamily: 'Inter-Light',
	},
	separator: {
		height: 0.5,
		backgroundColor: 'rgba(255, 255, 255, 0.3)', // Example color
		marginVertical: 6, // Example margin
	},
});

export default LanguageDialog;