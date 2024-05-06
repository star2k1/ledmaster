import { StyleSheet, SafeAreaView, View, Button, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import DrawingPadGrid from '../components/DrawingPadGrid';
import LinearGradient from 'react-native-linear-gradient';
import ColorPalette from '../components/ColorPalette';
import { useAppDispatch } from '../state/store';
import { useNavigation, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { addToMyDesigns } from '../state/Matrix/matrixSlice';

const styles = StyleSheet.create({
	test: {
		fontFamily: 'Inter-Bold',
		fontSize: 40,
		color: 'white',
	},
	testView: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',

	},
	wrapper: {

		backgroundColor: 'rgba(0,0,0,0.2)',
		borderRadius: 4,
	},
	header: {
		height:100,
	},
	footer: {
		height: 100,
		alignItems: 'center',
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

	async function changeScreenOrientation() {
		if (orientationIsLandscape) {
			await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
		} else {
			await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
		}
	}

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
		<SafeAreaView style={styles.testView}>
			<LinearGradient
				style={{ ...StyleSheet.absoluteFillObject }}
				colors={['lightblue', 'darkblue', 'darkblue']}
				start={{ x: 0, y: 0 }}
				end={{ x: 4, y: 3 }}
			/>
			<View style={styles.header}></View>
			<View style={styles.wrapper}>
				<DrawingPadGrid
					rows={MATRIX_ROWS}
					columns={MATRIX_COLUMNS}
					pixelColors={pixelColors}
					setPixelColors={setPixelColors}
				/>
			</View>
			<View style={styles.footer}>
				<ColorPalette />
			</View>
		</SafeAreaView>
	);
};

export default NewDesignScreen;