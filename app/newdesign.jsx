import { StyleSheet, TouchableOpacity, View, Button, Alert, ActivityIndicator } from 'react-native';
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
import ColorPickerModalSmall from '../components/ColorPickerModalSmall';
import { setCurrentColor } from '../state/Matrix/matrixSlice';
import * as Haptics from 'expo-haptics';
import ScreenTemplate from '../components/ScreenTemplate';
import { HeaderBackButton } from '@react-navigation/elements';

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

	const [isLoading, setIsLoading] = useState(true);
	const dispatch = useAppDispatch();
	const navigation = useNavigation();
	const { t } = useTranslation();
	const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
	const toggleColorPicker = () => {
		setIsColorPickerVisible(!isColorPickerVisible);
	};

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
			router.back({prevRoute: 'newdesign'});
		} else {
			Alert.alert(t('new-design.empty-canvas'), '\n' + t('new-design.empty-canvas-message'));
		}
	};

	const changeOrientation = async (newOrientation) => {
		console.log('newOrientation: ', newOrientation);
		await ScreenOrientation.lockAsync(newOrientation);
		setIsLoading(false);
	};
	
	useFocusEffect(
		React.useCallback(() => {
			setIsLoading(true);
			changeOrientation(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
			return async () => {
				await changeOrientation(ScreenOrientation.OrientationLock.PORTRAIT_UP);
			};
		}, [])
	);

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<Button
					title= {t('save')}
					color= {'#007AFF'}
					onPress={() => onSave(pixelColors)}
				/>
			),
			headerLeft: () => (
				<HeaderBackButton 
					label= {t('back')}
					onPress={() => [setIsLoading(true), router.back('mydesigns', {params: 'newdesign'})]}
				/>
			)
		});
	}), [navigation];

	const handlePixelColorsChange = (updatedPixelColors) => {
		setPixelColors(prevPixelColors => ({
			...prevPixelColors,
			...updatedPixelColors
		}));
	};

	return (
		<ScreenTemplate>
			{isLoading ? (<View><ActivityIndicator size={'large'}/></View>) :
				(<View style={styles.testView}>
					<View style={styles.header}></View>
					<DrawingPadGrid
						rows={MATRIX_ROWS}
						columns={MATRIX_COLUMNS}
						pixelColors={pixelColors}
						onPixelColorsChange={handlePixelColorsChange}
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
						>
							<Ionicons
								name={'color-palette'}
								size={35}
								color='white'
							/>
						</TouchableOpacity>
						<ColorPalette />
					</View>
					<ColorPickerModalSmall
						visible={isColorPickerVisible}
						onSelectColor={onSelectColor}
						onClose={() => toggleColorPicker()}
					/>
				</View>)}
		</ScreenTemplate>
	);
};

export default NewDesignScreen;