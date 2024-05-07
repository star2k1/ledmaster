import { View, StyleSheet } from 'react-native';
import React from 'react';
import { ScrollView } from 'react-native';
import BitmapImage from './DesignPreview';

const AnimationFrames = ({frames}) => {
	//const [animationFrames, setAnimationFrames] = useEffect(['#000000']);
	const MATRIX_ROWS = 8;
	const MATRIX_COLUMNS = 32;
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
	//console.log(toArray(frames[0]));
	return (
		<View>
			<ScrollView
				horizontal={true}
				contentContainerStyle={styles.scrollContainer}
			>
				{frames ?? frames.map((frame, index) => (
					<BitmapImage key={index} frame={frame} />
				))}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	scrollContainer: {
		flex: 1,
		width: '100%',
		alignItems: 'center',
		verticalAlign: 'middle',
		textAlign: 'center'
	}
});

export default AnimationFrames;