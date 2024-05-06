import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import
{
	SafeAreaView,
	Text,
	StyleSheet,
	TouchableOpacity,
	View,
	Modal
} from 'react-native';
import ColorPicker, { Preview, Panel3, BrightnessSlider } from 'reanimated-color-picker';

const ColorPickerModal = ({ visible, onClose, onSelectColor }) => {
	const { t } = useTranslation();
	return (
		<Modal animationType="fade" visible={visible} transparent onRequestClose={onClose} onOrientationChange={'portrait'}>
			<SafeAreaView style={styles.container}>
				<BlurView intensity={20} style={styles.overlay}>
					<TouchableOpacity 
						style={styles.overlay} 
						activeOpacity={1} 
						onPress={onClose} // Close the modal when clicking outside
					/>
				</BlurView>
				<BlurView intensity={40} style={styles.dialogContainer}>
					<Text style={styles.titleText}>{t('choose-color')}</Text>
					<View style={styles.bottomSeparator}></View>
					<View>
						<ColorPicker
							adaptSpectrum={true}
							boundedThumb={false}
							sliderThickness={20}
							thumbSize={30}
							thumbColor='rgb(255,255,255)'
							thumbScaleAnimationValue={1.1}
							thumbAnimationDuration={50}
							thumbShape='circle'
							onComplete={() => onSelectColor()}
						>
							<Preview style={{ margin: 5, width: '90%' }}/>
							<View style={{ margin: 10, width: '80%'}}>
								<Panel3 />
							</View>
							<View style={{ margin: 5, width: '80%'}}>
								<BrightnessSlider />
							</View>
						</ColorPicker>
					</View>
					<View style={styles.bottomSeparator}></View>
					<View>
						<TouchableOpacity>
							<Text style={styles.buttonText}>
                            OK
							</Text>
						</TouchableOpacity>
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
		paddingTop: 15,
		paddingBottom: 15,
		borderRadius: 28,
		width: '85%',
		overflow: 'hidden',
		backgroundColor: 'rgba(0,0,0,0.5)',
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
	
export default ColorPickerModal;