import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const MatrixGrid = ({ rows, columns }) => {
	// Calculate the total width and height of the grid

	const screenWidth = Dimensions.get('window').width;
	const gridWidth = screenWidth - 60;
	const cellWidth = gridWidth / columns;
	const gridHeight = rows * cellWidth;

	// Create an array of row indices
	const rowIndices = Array.from({ length: rows }, (_, index) => index);

	// Create an array of column indices
	const columnIndices = Array.from({ length: columns }, (_, index) => index);

	return (
		<View style={styles.container}>
			<View style={[styles.gridContainer, { width: gridWidth, height: gridHeight }]}>
				{/* Map through row indices to create rows */}
				{rowIndices.map(row => (
					<View key={row} style={styles.row}>
						{/* Map through column indices to create columns */}
						{columnIndices.map(column => (
							<View key={column} style={[styles.cell, { width: cellWidth, height: cellWidth }]} />
						))}
					</View>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'black',
		borderRadius: 6,
		padding: 12,
		shadowColor: 'cyan', // Set shadow color to white
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 1,
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
