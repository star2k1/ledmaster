import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import BitmapImage from './DesignPreview';
import { useAppSelector } from '../state/store';

const MatrixGrid = () => {
	const currentDesign = useAppSelector(state => (state.matrix.currentMatrix));
	const portraitWidth = useAppSelector(state => (state.device.portraitWidth));
	const margin = 24;
	const itemWidth = portraitWidth-margin;

	return (
		<TouchableOpacity>
			<View style={styles.container}>
				<BitmapImage bitmapData={currentDesign} itemWidth={itemWidth}/>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'black',
		borderRadius: 4,
		padding: 8,
		shadowColor: 'cyan', // Set shadow color to white
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.5,
		shadowRadius: 5, // Adjust the shadow radius for the desired glow effect
		flexShrink: 1,
	},
	gridContainer: {
		flexDirection: 'column', // Arrange rows vertically
	},
	row: {
		flexDirection: 'row', // Arrange cells horizontally
	},
	cell: {
		borderWidth: 0.2,
		borderColor: 'rgba(255, 255, 255, 0.1)',
		backgroundColor: 'black'
	},
});

export default MatrixGrid;
