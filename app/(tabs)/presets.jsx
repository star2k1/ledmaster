import React, { useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MatrixGrid from '../../components/CurrentMatrix';
import { useAppDispatch, useAppSelector } from '../../state/store';
import { readDataFromDevice, sendDataToDevice } from '../../state/BluetoothLE/listener';
import { startListening } from '../../state/BluetoothLE/slice';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	text: {
		color: 'white',
		marginTop: 225,
		fontSize: 25,
		fontWeight: '600'
	}, 
	textBtn: {
		color: '#fff', // Text color can be white
		fontFamily: 'Inter', // Inter font family
		fontSize: 18,
		textAlign: 'center',
		fontWeight: '400',
	},
	btnTest: {
		backgroundColor: 'rgba(0, 0, 255, 0.9)',
		paddingLeft: 25,
		paddingRight: 25,
		paddingTop: 12,
		paddingBottom: 12,
		borderRadius: 20,
		marginTop: 20,
	}
});

const PresetScreen = () => {
	const dispatch = useAppDispatch();
	const sampleData = useAppSelector(state => state.ble.retrievedColor);

	const readRemoteData = () => {
		dispatch(readDataFromDevice());
	};

	const sendDataNow = () => {
		const randData = '1';
		dispatch(sendDataToDevice(randData));
	};

	useEffect(() => {
		dispatch(startListening());
	}, []);

	const rows = 16;
	const columns = 64;
	return(
		<LinearGradient
			style={ styles.container }
			colors={['darkblue', 'black', 'black']}
			start={{ x: 0, y: 0.3 }}
			end={{ x: 0.2, y: 1 }}
		>

		
			<SafeAreaView style={ styles.container }>
				<MatrixGrid 
					rows={rows}
					columns={columns}
				/>
				<TouchableOpacity style={styles.btnTest} onPress={readRemoteData}>
					<Text style={styles.textBtn}>Loe andmeid</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.btnTest} onPress={sendDataNow}>
					<Text style={styles.textBtn}>Saada 1!</Text>
				</TouchableOpacity>
				<View style={styles.btnTest}>
					<Text style={styles.textBtn}>{sampleData}</Text>
				</View>
				<Text style={styles.text}>{ sampleData ?? 'Siin on eelloodud disainid' }</Text>
			</SafeAreaView>
		</LinearGradient>
	);
};

export default PresetScreen;