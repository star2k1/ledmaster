import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppDispatch } from '../state/store';
import { setCurrentColor } from '../state/Matrix/matrixSlice';

const ColorPalette = () => {
	const dispatch = useAppDispatch();
	const colors = [
		'#000000',	  // black
		'#FFFFFF',    // white
		'#808080',    // gray
		'#A52A2A',    // brown
		'#FF0000',    // red
		'#FFA500',    // orange
		'#FFFF00',    // yellow
		'#008000',    // green
		'#0000FF',    // blue
		'#ADD8E6',    // lightblue
		'#4B0082',    // indigo
		'#EE82EE',    // violet
		'#00FFFF',    // cyan
		'#FF00FF',    // magenta
		'#800080',    // purple
		'#FFC0CB',    // pink
	];

	return (
		<View style={styles.palette}>
			{colors.map((color, index) => (
				<TouchableOpacity
					key={index}
					style={[styles.colorOption, { backgroundColor: color }]}
					onPress={() => dispatch(setCurrentColor(color))}
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
		margin: 4,
		borderRadius: 20,
	},
});

export default ColorPalette;
