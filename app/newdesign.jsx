import { StyleSheet, TouchableOpacity, View, Button, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import DrawingPadGrid from '../components/DrawingPadGrid';
import ColorPalette from '../components/ColorPalette';
import { useAppDispatch } from '../state/store';
import { useNavigation, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { addToMyDesigns } from '../state/Matrix/matrixSlice';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import ColorPickerModal from '../components/ColorPickerModal';
import { setCurrentColor } from '../state/Matrix/matrixSlice';
import * as Haptics from 'expo-haptics';
import ScreenTemplate from '../components/ScreenTemplate';

const styles = StyleSheet.create({
	testView: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	wrapper: {
		flex: 1,
		alignItems: 'center', // Center horizontally
		justifyContent: 'center', // Center vertically
		backgroundColor: 'rgba(0,0,0,0.2)',
		borderRadius: 4,
	},
	header: {
		backgroundColor: 'rgba(0,0,0,0)', // Transparent background
	},
	footer: {
		height: 80, // Fixed height
		alignItems: 'center', // Center horizontally
		justifyContent: 'center', // Center vertically
		flexDirection: 'row', // Horizontal layout
	},
	eraserButton: {

	},

});

const NewDesignScreen = () => {
	const MATRIX_ROWS = 8;
	const MATRIX_COLUMNS = 32;

	const dispatch = useAppDispatch();
	const navigation = useNavigation();
	const { t } = useTranslation();
	const [orientationIsLandscape, setOrientation] = useState(true);
	const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
	const toggleColorPicker = () => {
		setIsColorPickerVisible(!isColorPickerVisible);
	};

	async function changeScreenOrientation() {
		if (orientationIsLandscape) {
			await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
		} else {
			await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
		}
	}
	const onSelectColor = ({ hex }) => {
		dispatch(setCurrentColor(hex));
	};

	const handleEraser = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		dispatch(setCurrentColor('#000000'));
	};

	const [pixelColors, setPixelColors] = useState(() => {
  		let initialPixelColors = {};
  		for (let i = 0; i < MATRIX_COLUMNS; i++) {
    		for (let j = 0; j < MATRIX_ROWS; j++) {
      			initialPixelColors[`${i},${j}`] = '#000000';
    		}
  		}
  		return initialPixelColors;
	});

	const toArray = (pixelColors) => {
		const pixelColorsArray = [];
		for (let i = 0; i < MATRIX_COLUMNS; i++) {
  			pixelColorsArray.push([]);
  			for (let j = 0; j < MATRIX_ROWS; j++) {
    			pixelColorsArray[i].push(pixelColors[`${i},${j}`]);
  			}
		}
		return pixelColorsArray;
	};

	const onSave = (pixelColors) => {
		const isNotBlank = Object.values(pixelColors).some(color => color !== '#000000');
		if (isNotBlank && !pixelColors.length > 0){
			dispatch(addToMyDesigns(toArray(pixelColors)));
			router.back();
		} else {
			Alert.alert(t('new-design.empty-canvas'), '\n' + t('new-design.empty-canvas-message'));
		}
	};

	const toggleOrientation = () => {
		setOrientation(!orientationIsLandscape);
		changeScreenOrientation();
	};

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<Button
					title= {t('save')}
					color= {'#007AFF'}
					onPress={() => onSave(pixelColors)}
				/>
			),
		});
	}), [navigation];
	
	useFocusEffect(
		React.useCallback(() => {
			toggleOrientation();
			return async () => {
				await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
			};
		}, [])
	);

	return (
		<ScreenTemplate>
			<View style={styles.testView}>
				<View style={styles.header}></View>
				<DrawingPadGrid
					rows={MATRIX_ROWS}
					columns={MATRIX_COLUMNS}
					pixelColors={pixelColors}
					setPixelColors={setPixelColors}
				/>
				<View style={styles.footer}>
					<TouchableOpacity
						onPress={handleEraser}
						style={{marginRight: 10}}
					>
						<FontAwesome6
							name='eraser'
							size={35}
							color='rgba(0,0,0,0.8)'
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={toggleColorPicker}
						style={{marginRight: 10}}
						disabled={true}
					>
						<Ionicons
							name={'color-palette'}
							size={35}
							color='white'
						/>
					</TouchableOpacity>
					<ColorPalette />
				</View>
				<ColorPickerModal
					visible={isColorPickerVisible}
					onSelectColor={onSelectColor}
					onClose={() => toggleColorPicker()}
				/>
			</View>
		</ScreenTemplate>
	);
};

export default NewDesignScreen;