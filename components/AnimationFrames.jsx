/* eslint-disable react/prop-types */
import { View, StyleSheet } from 'react-native';
import React from 'react';
import { ScrollView } from 'react-native';
import BitmapImage from './DesignPreview';

const AnimationFrames = ({ frames }) => {
	//const [animationFrames, setAnimationFrames] = useEffect(['#000000']);
	return (
		<View>
			<ScrollView
				horizontal={true}
				contentContainerStyle={styles.scrollContainer}
				content
			>
				<BitmapImage frame={frames[0]} />
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