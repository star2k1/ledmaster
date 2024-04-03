import React from 'react';
import { View, SafeAreaView, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		marginTop: 10,
	},
	text: {
		color: 'white',
		marginTop: 225,
		fontFamily: 'Inter-Bold',
		fontSize: 25,
	},
	gridContainer: {
		flex: 1
	}
});

const TextScreen = () => {
	const bottomTabBarHeight = useBottomTabBarHeight();
	
	return(
		<LinearGradient
			style={{...StyleSheet.absoluteFill}}
			colors={['midnightblue','royalblue', 'midnightblue']}
		>
			<SafeAreaView style={[ styles.container, { paddingBottom: bottomTabBarHeight }, ]}>
				<View>
				</View>
				<Text style={styles.text}>Tekst</Text>
			</SafeAreaView>
		</LinearGradient>
	);
};

export default TextScreen;