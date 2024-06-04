import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import
{
	Text,
	StyleSheet,
	TouchableOpacity,
	View,
	Modal
} from 'react-native';
import ColorPicker, { Preview, Panel3, BrightnessSlider } from 'reanimated-color-picker';
import { useAppSelector } from '../state/store';

const ColorPickerModal = ({ visible, onClose, onSelectColor }) => {
	const { t } = useTranslation();
	const storedColor = useAppSelector(state => state.matrix.color);
	const [selectedColor, setSelectedColor] = useState(storedColor);
	const handleColorSelect = (color) => {
		setSelectedColor(color); // Store the selected color locally
	};
	const handleSubmit = () => {
		onClose();
		onSelectColor(selectedColor);
	};
	return (
		<Modal 
			animationType="fade"
			visible={visible}
			transparent
			onRequestClose={onClose}
		>
			<View style={styles.container}>
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
					<View style={styles.colorPickerContainer}>
						<ColorPicker
							adaptSpectrum
							boundedThumb={false}
							sliderThickness={20}
							value={storedColor}
							thumbSize={30}
							thumbScaleAnimationValue={1.1}
							thumbAnimationDuration={50}
							onComplete={handleColorSelect}
						>
							<Preview style={{ marginTop: 5, marginBottom: 10 }}/>
							<View style={{ margin: 10}}>
								<Panel3
									style={styles.panelStyle}
								/>
							</View>
							<View style={{ marginTop: 10, marginBottom: 5}}>
								<BrightnessSlider
									style={styles.sliderStyle}
								/>
							</View>
						</ColorPicker>
					</View>
					<View style={styles.bottomSeparator}></View>
					<TouchableOpacity onPress={handleSubmit}>
						<Text style={styles.buttonText}>
                            OK
						</Text>
					</TouchableOpacity>
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
		width: '85%',
		overflow: 'hidden',
		backgroundColor: 'rgba(0,0,0,0.5)',
		alignContent: 'center',
		elevation: 10
	},
	colorPickerContainer: {
		alignSelf: 'center',
		width: '90%',
		paddingHorizontal: 20,
		elevation: 10,
	},
	panelStyle: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	sliderStyle: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5,
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