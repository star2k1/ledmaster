import React, { useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, View, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MatrixGrid from '../../../components/CurrentMatrix';
import { useAppDispatch, useAppSelector } from '../../../state/store';
import { readDataFromDevice, sendDataToDevice } from '../../../state/BluetoothLE/listener';
import { startListening } from '../../../state/BluetoothLE/slice';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		marginTop: 100,
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
	const sampleData = useAppSelector(state => state.ble.retrievedColor);

	const readRemoteData = () => {
		dispatch(readDataFromDevice());
	};

	const sendEffectOne = () => {
		const randData = '1';
		dispatch(sendDataToDevice(randData));
	};

	// const sendEffectTwo = () => {
	// 	const randData = '2';
	// };

	const sendTurnOff = () => {
		const randData = '0';
		dispatch(sendDataToDevice(randData));
	};

	useEffect(() => {
		dispatch(startListening());
	}, []);



	const rows = 16;
	const columns = 64;
	return(
		<LinearGradient
			style={{...StyleSheet.absoluteFill}}
			colors={['midnightblue','royalblue', 'midnightblue']}
			start={{ x: 0, y: 0 }}
			end={{ x: 0, y: 1 }}
		>
			<SafeAreaView style={[ styles.container, { paddingBottom: bottomTabBarHeight }, ]}>
				<MatrixGrid 
					rows={rows}
					columns={columns}
				/>
				{/* <TouchableOpacity style={styles.btnTest} onPress={readRemoteData}>
					<Text style={styles.textBtn}>Loe andmeid</Text>
				</TouchableOpacity> */}
				<View style={{flexDirection:'row', justifyContent:'space-between'}}>
					<TouchableOpacity style={[styles.btnOn]} onPress={sendEffectOne}>
						<Ionicons name="power-outline" color={'white'} size={24}/>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.btnOff]} onPress={sendTurnOff}>
						<Ionicons name="power-outline" color={'white'} size={24}/>
					</TouchableOpacity>
				</View>
				<Text style={styles.text}>{ sampleData ?? 'Siin on eelloodud disainid' }</Text>
			</SafeAreaView>
		</LinearGradient>
	);
};

export default PresetScreen;