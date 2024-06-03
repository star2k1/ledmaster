import React from 'react';
import { useTranslation } from 'react-i18next';
import { BlurView } from 'expo-blur';
import
{
	Text,
	StyleSheet,
	View,
	Modal,
	ActivityIndicator
} from 'react-native';

const AnimationLoadingModal = ({ visible }) => {
	const { t } = useTranslation();
	return (
		<Modal 
			animationType="fade"
			visible={visible}
			transparent
		>
			<View style={styles.container}>
				<BlurView intensity={20} style={styles.overlay} />
				<BlurView intensity={40} style={styles.dialogContainer}>
					<Text style={styles.buttonText}>
						{t('my-animations.animation-sending')}
					</Text>
					<ActivityIndicator size={'large'} color={'white'} style={{margin: 10}} />
				</BlurView>
			</View>
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
		paddingTop: 15,
		paddingBottom: 15,
		borderRadius: 28,
		width: '70%',
		overflow: 'hidden',
		backgroundColor: 'rgba(0,0,0,0.5)',
		alignContent: 'center',
		elevation: 10
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
	},
	flatlistContiner: {
		flexGrow: 1,
	},
	titleText: {
		color: 'white', // Text color
		fontSize: 17,
		alignSelf: 'center',
		textAlign: 'center',
		fontFamily: 'Inter-Medium',
		margin: 5
	},
	buttonText: {
		color: 'white', // Text color
		fontSize: 17,
		alignSelf: 'center',
		textAlign: 'center',
		fontFamily: 'Inter-Medium',
		margin: 5
	},
	bottomSeparator: {
		height: 0.3,
		backgroundColor: 'rgba(255, 255, 255, 0.3)', // Example color
		marginVertical: 10
	},
});
	
export default AnimationLoadingModal;