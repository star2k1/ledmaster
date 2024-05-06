import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppDispatch } from '../state/store';
import { setCurrentColor } from '../state/Matrix/matrixSlice';
import { useAppSelector } from '../state/store';

const ColorPalette = () => {
	const dispatch = useAppDispatch();
	const currentColor = useAppSelector(state => state.matrix.color);
	const [recentColors, setRecentColors] = useState(['#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFF000']);

	const handleColorPress = (color) => {
		dispatch(setCurrentColor(color));
	};

	useEffect(() => {
		if (currentColor &&
			!recentColors.some(recentColor => recentColor.toLowerCase() === currentColor.toLowerCase()) &&
			currentColor != '#000000') {
			let updatedColors = [currentColor, ...recentColors];
			while (updatedColors.length > 5) {
				updatedColors.pop();
			}
			setRecentColors(updatedColors);
		}
	}, [currentColor]);
	
	return (
		<View style={styles.palette}>
			{recentColors.map((color, index) => (
				<TouchableOpacity
					key={index}
					style={[styles.colorOption, { backgroundColor: color }]}
					onPress={() => handleColorPress(color)}
				/>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	palette: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	colorOption: {
		width: 35,
		height: 35,
		margin: 5,
		borderRadius: 20,
	},
});

export default ColorPalette;
