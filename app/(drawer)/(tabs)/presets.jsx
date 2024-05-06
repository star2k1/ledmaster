import React, { useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, View, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MatrixGrid from '../../../components/CurrentMatrix';
import { useAppDispatch, useAppSelector } from '../../../state/store';
import { readDataFromDevice, sendDataToDevice } from '../../../state/BluetoothLE/listener';
import { startListening } from '../../../state/BluetoothLE/bleSlice';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
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

const PresetScreen = () => {
	const bottomTabBarHeight = useBottomTabBarHeight();
	const dispatch = useAppDispatch();
	const designs = null;

	const readRemoteData = () => {
		dispatch(readDataFromDevice());
	};

	useEffect(() => {
		dispatch(startListening());
	}, []);

	return(
		<ScreenTemplate>
			<View style={[ styles.container, { paddingBottom: bottomTabBarHeight }, ]}>
				<View style={styles.headerContainer}>
					<MatrixGrid />
				</View>
				<Text style={styles.text}>{ designs ?? 'Siin on eelloodud disainid' }</Text>
			</View>
		</ScreenTemplate>
	);
};

export default PresetScreen;