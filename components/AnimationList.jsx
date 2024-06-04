import { FlatList, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { sendAnimationToDevice } from '../state/BluetoothLE/listener';
import { setCurrentAnimation } from '../state/Matrix/matrixSlice';
import { useAppSelector } from '../state/store';
import AlertService from '../services/AlertService';
import AnimationPreview from './AnimationPreview';
import AnimationLoadingModal from './AnimationLoadingModal';
import * as Haptics from 'expo-haptics';
import { GestureDetector } from 'react-native-gesture-handler';

export default function AnimationList({ data }) {
	const { t } = useTranslation();
	const myAlerts = AlertService(t);
	const dispatch = useDispatch();
	const bluetoothEnabled = useAppSelector(state => (state.ble.bluetoothEnabled));
	const connectedDevice = useAppSelector(state => (state.ble.connectedDevice));
	const portraitWidth = useAppSelector(state => (state.device.portraitWidth));
	const listItemWidth = portraitWidth / 2.05;
	const [isLoading, setIsLoading] = useState(false);

	const bitmapItem = ({ item }) => (
		<TouchableOpacity onPress={() => sendAnimation(item)}>
			<View style={styles.itemContainer}>
				<AnimationPreview animationData={item} itemWidth={listItemWidth} frameDelay={300}/>
			</View>
		</TouchableOpacity>
	);

	const sendAnimation = async (animation) => {
		if (!bluetoothEnabled) myAlerts.showBluetoothAlert();
		else if (!connectedDevice) myAlerts.showNoDeviceAlert();
		else {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			setIsLoading(true);
			dispatch(sendAnimationToDevice(animation))
				.then(() => {
					dispatch(setCurrentAnimation(animation));
					setIsLoading(false);
				})
				.catch((error) => {
					console.error('Error dispatching animation:', error);
					setIsLoading(false);
				});
		}
	};

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
			<AnimationLoadingModal visible={isLoading}/>
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