import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

const ColorPalette = ({ onSelectColor }) => {
	// Define the color options
	const colors = [
		'white',
		'gray',
		'brown',
		'red',
		'orange',
		'yellow',
		'green',
		'blue',
		'lightblue',
		'indigo',
		'violet',
		'cyan',
		'magenta',
		'purple',
		'pink',
	];

	// Function to handle color selection
	const handleColorSelect = (color) => {
		onSelectColor(color);
	};

	return (
		<View style={styles.palette}>
			{colors.map((color, index) => (
				<TouchableOpacity
					key={index}
					style={[styles.colorOption, { backgroundColor: color }]}
					onPress={() => handleColorSelect(color)}
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
