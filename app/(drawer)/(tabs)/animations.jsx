import React, { useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet View } from 'react-native';
import MatrixGrid from '../../../components/CurrentMatrix';
import { useAppDispatch, useAppSelector } from '../../../state/store';
import { startListening } from '../../../state/BluetoothLE/bleSlice';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import ScreenTemplate from '../../../components/ScreenTemplate';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	headerContainer: {
		maxHeight: 'auto',
		marginTop: 15
	},
	text: {
		color: 'white',
		marginTop: 100,
		fontSize: 25,
		fontFamily: 'Inter-Bold',
	}, 
	textBtn: {
		color: '#fff', // Text color can be white
		fontFamily: 'Inter-Regular', // Inter font family
		fontSize: 18,
		textAlign: 'center',
	},
	btnOff: {
		backgroundColor: 'red',
		paddingLeft: 25,
		paddingRight: 25,
		paddingTop: 12,
		paddingBottom: 12,
		borderRadius: 20,
		marginTop: 20,
		marginHorizontal: 10,
	},
	btnOn: {
		backgroundColor: 'rgb(0,215,0)',
		paddingLeft: 25,
		paddingRight: 25,
		paddingTop: 12,
		paddingBottom: 12,
		borderRadius: 20,
		marginTop: 20,
		marginHorizontal:10,
	},
});

const AnimationScreen = () => {
	const bottomTabBarHeight = useBottomTabBarHeight();
	const dispatch = useAppDispatch();
	const designs = null;

	useEffect(() => {
		dispatch(startListening());
	}, []);

	return(
		<ScreenTemplate>
			<SafeAreaView style={[ styles.container, { paddingBottom: bottomTabBarHeight }, ]}>
				<View style={styles.headerContainer}>
					<MatrixGrid />
				</View>
				<Text style={styles.text}>{ designs ?? 'Siin on eelloodud disainid' }</Text>
			</SafeAreaView>
		</ScreenTemplate>
	);
};

export default AnimationScreen;