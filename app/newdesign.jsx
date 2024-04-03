import { StyleSheet, SafeAreaView, View } from 'react-native';
import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import DrawingPadGrid from '../components/DrawingPadGrid';
import LinearGradient from 'react-native-linear-gradient';
import ColorPalette from '../components/ColorPalette';

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
	}
});


const NewDesignScreen = () => {

	const [orientationIsLandscape, setOrientation] = useState(true);
	const [currentColor, setCurrentColor] = useState('rgba(255,255,255,1)');

	async function changeScreenOrientation() {
		if (orientationIsLandscape) {
			await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
		} else {
			await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
		}
	}

	const toggleOrientation = () => {
		setOrientation(!orientationIsLandscape);
		changeScreenOrientation();
	};
	
	useFocusEffect(
		React.useCallback(() => {
			toggleOrientation();
			return async () => {
				await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
			};
		}, [])
	);

	const handleColorSelect = (color) => {
		setCurrentColor(color);
	};

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
				<DrawingPadGrid rows={8} columns={32} brushColor={currentColor}/>
			</View>
			<View style={styles.footer}>
				<ColorPalette onSelectColor={handleColorSelect} />
			</View>
		</SafeAreaView>
	);
};

export default NewDesignScreen;