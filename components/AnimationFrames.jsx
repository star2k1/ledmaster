import { View, StyleSheet } from 'react-native';
import React from 'react';
import { ScrollView } from 'react-native';
import BitmapImage from './DesignPreview';
import { hexArrayToBitmap } from '../services/hexToBitmap';
import { useAppSelector } from '../state/store';
import { Ionicons } from '@expo/vector-icons';

const AnimationFrames = () => {
	//const [animationFrames, setAnimationFrames] = useEffect(['#000000']);
	const currentDesign = useAppSelector((state) => state.matrix.currentMatrix);
	return (
		<View>
			<ScrollView
				horizontal={true}
				contentContainerStyle={styles.scrollContainer}
			>
				<View style={{width: 200, height: 60, backgroundColor: 'black', marginHorizontal: 10 }}>
				</View>
				<View style={{width: 200, height: 60, backgroundColor: 'black', marginHorizontal: 10}}>

				</View>
				<View>
					<Ionicons name='add' size={40} style={{marginTop: 13}} color='white' />
				</View>
				<BitmapImage
					bitmapData={hexArrayToBitmap(currentDesign)}
					itemWidth={100} 
				/>
				
				<BitmapImage
					bitmapData={hexArrayToBitmap(currentDesign)}
					itemWidth={100} 
				/>
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