import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import BitmapImage from './DesignPreview';
import { useTranslation } from 'react-i18next';
import { hexArrayToString } from '../services/hexToBitmap';
import { useDispatch } from 'react-redux';
import { sendDesignToDevice } from '../state/BluetoothLE/listener';
import { setCurrentDesign } from '../state/Matrix/matrixSlice';
import { useAppSelector } from '../state/store';
import AlertService from '../services/AlertService';

export default function DesignList({ data }) {
	const { t } = useTranslation();
	const myAlerts = AlertService(t);
	const dispatch = useDispatch();
	const bluetoothEnabled = useAppSelector(state => (state.ble.bluetoothEnabled));
	const connectedDevice = useAppSelector(state => (state.ble.connectedDevice));
	const listItemWidth = useAppSelector(state => (state.device.screenWidth)) / 2;

	const bitmapItem = ({ item }) => (
		<TouchableOpacity onPress={() => sendPixels(item)}>
			<View style={styles.itemContainer}>
				<BitmapImage bitmapData={item} itemWidth={listItemWidth} />
			</View>
		</TouchableOpacity>
	);

	const padInteger = (number) => {
		return number <= 100 ? String(number).padStart(3, '0') : '001';
	};

	const sendPixels = (pixelColors) => {
		//console.log(hexArrayToString(pixelColors));
		if (!bluetoothEnabled) myAlerts.showBluetoothAlert();
		else if (!connectedDevice) console.log('No device!');
		else {
			dispatch(sendDesignToDevice(padInteger(1) + hexArrayToString(pixelColors)));
			dispatch(setCurrentDesign(pixelColors));
		}
		// dispatch(sendDataToDevice(hexArrayToBitmap(pixelColors).toString()));
		// console.log('Value sent', hexArrayToBitmap(pixelColors));
	};
	const bottomTabBarHeight = useBottomTabBarHeight();
	return (
		<View style={[styles.container, {paddingBottom: bottomTabBarHeight}]}>
			{ data.length === 0 ? (
				<View style={{flex: 1}}>
					<Text style={styles.title}>{t('my-designs.missing')}</Text>
				</View>
			) : (
				<FlatList 
					data={data}
					renderItem={bitmapItem}
					keyExtractor={(item, index) => index.toString()}
					numColumns={2}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		//alignItems: 'center',
		justifyContent: 'flex-start',
		marginVertical: 20,
		//marginLeft: 20,
		//marginRight: 20
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
		borderRadius: 2,
		backgroundColor: 'rgba(0,0,0,0.8)',
		marginHorizontal: 9,
		marginVertical: 5
	}
});