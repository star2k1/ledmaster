import { FlatList, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import React from 'react';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import BitmapImage from './DesignPreview';
import { useTranslation } from 'react-i18next';
import { hexArrayToString } from '../services/hexToBitmap';
import { useDispatch } from 'react-redux';
import { sendAnimationToDevice } from '../state/BluetoothLE/listener';
import { setCurrentAnimation } from '../state/Matrix/matrixSlice';
import { useAppSelector } from '../state/store';
import AlertService from '../services/AlertService';
import AnimationPreview from './AnimationPreview';

export default function AnimationList({ data }) {
	const { t } = useTranslation();
	const myAlerts = AlertService(t);
	const dispatch = useDispatch();
	const bluetoothEnabled = useAppSelector(state => (state.ble.bluetoothEnabled));
	const connectedDevice = useAppSelector(state => (state.ble.connectedDevice));
	const listItemWidth = Dimensions.get('window').width / 2.05;

	const bitmapItem = ({ item }) => (
		// <TouchableOpacity onPress={() => sendPixels(item)}>
		// 	<View style={styles.itemContainer}>
		// 		<AnimationPreview animationData={item} itemWidth={listItemWidth} frameDelay={500}/>
		// 	</View>
		// </TouchableOpacity>
		<TouchableOpacity onPress={() => sendAnimation(item)}>
			<View style={styles.itemContainer}>
				<AnimationPreview animationData={item} itemWidth={listItemWidth} frameDelay={300}/>
			</View>
		</TouchableOpacity>
	);

	// const padInteger = (number) => {
	// 	return (number !== 0 && number <= 100) ? String(number).padStart(3, '0') : '001';
	// };
	const sendAnimation = (animation) => {
		if (!bluetoothEnabled) myAlerts.showBluetoothAlert();
		else if (!connectedDevice) console.log('No device!');
		else {
			dispatch(sendAnimationToDevice(animation));
			dispatch(setCurrentAnimation(animation));
		}
	};

	// const sendPixels = (pixelColors) => {
	// 	console.log(hexArrayToString(pixelColors));
	// 	if (!bluetoothEnabled) myAlerts.showBluetoothAlert();
	// 	else if (!connectedDevice) console.log('No device!');
	// 	else {
	// 		dispatch(sendDesignToDevice(padInteger(1) + hexArrayToString(pixelColors)));
	// 		dispatch(setCurrentDesign(pixelColors));
	// 	}
	// 	dispatch(sendDataToDevice(hexArrayToBitmap(pixelColors).toString()));
	// 	console.log('Value sent', hexArrayToBitmap(pixelColors));
	// };
	const bottomTabBarHeight = useBottomTabBarHeight();
	return (
		<View style={[styles.container, {paddingBottom: bottomTabBarHeight}]}>
			{ (!data || data.length === 0) ? (
				<View style={{flex: 1}}>
					<Text style={styles.title}>{t('my-designs.missing')}</Text>
				</View>
			) : (
				<FlatList 
					data={data}
					renderItem={bitmapItem}
					keyExtractor={(_, index) => index.toString()}
					numColumns={2}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		marginTop: 20,
	},
	title: {
		marginTop: 120,
		fontFamily: 'Inter-Bold',
		fontSize: 22,
		textAlign: 'center',
		textAlignVertical: 'center',
		padding: 20,
		color: '#rgba(255,255,255,0.9)'
	},
	itemContainer: {
		padding: 1,
		borderRadius: 4,
		backgroundColor: 'rgba(0,0,0,0.8)',
		marginHorizontal: 9,
		marginVertical: 7,
		overflow: 'hidden'
	}
});