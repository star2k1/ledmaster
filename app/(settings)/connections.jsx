import React, { useState, useEffect } from 'react';
import { View, Alert, Platform, Linking, AppRegistry } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { router, useFocusEffect } from 'expo-router';
import
{
	FlatList,
	SafeAreaView,
	Text,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppDispatch, useAppSelector } from '../../state/store';
import { startCheckingState, startScanning } from '../../state/BluetoothLE/slice';
import { connectToDevice } from '../../state/BluetoothLE/listener';

const ConnectionScreen = () => {
	const dispatch = useAppDispatch();
	const discoveredDevices = useAppSelector((state) => state.ble.allDevices);
	const bluetoothState = useAppSelector(state => state.ble.bluetoothEnabled);

	// useEffect(() => {
	// 	if(!bluetoothState) createAlert();
	// }, [bluetoothState]);

	useFocusEffect(
		React.useCallback(() => {
			if(!bluetoothState) createAlert();
		}, [bluetoothState])
	);

	useEffect(() => {
		dispatch(startCheckingState());
		dispatch(startScanning());
	}, []);

	// useFocusEffect(
	// 	React.useCallback(() => {
	// 		console.log('Screen refocused');
	// 		enableBluetoothOrScan();
	// 		return () => {
	// 			console.log('Screen unfocused');
	// 		};
	// 	}, [])
	// );

	// const enableBluetoothOrScan = () => {
	// 	if (bluetoothState) {
	// 		console.log(bluetoothState);
	// 		dispatch(startScanning());
	// 	} else {
	// 		createAlert();
	// 	}
	// };

	const onDeviceSelected = (deviceId) => {
		dispatch(connectToDevice(deviceId));
		router.push('/(tabs)/presets');
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	};

	const { t } = useTranslation();

	const goToSettings = () =>
		Platform.OS === 'ios'
			? Linking.openURL('App-Prefs:Bluetooth')
			: console.log('Failed to open settings');

	const createAlert = () => {
		Alert.alert(t('bluetooth-error-title'), t('bluetooth-error-msg'), [
			{
				text: t('settings'),
				onPress: () => { goToSettings(); router.push('/'); }
			},
			{
				text: t('cancel'),
				style: 'cancel',
				onPress: () => { router.push('/'); }
			},
						
		]);
	};

	return (
		<View style={styles.container}>
			<LinearGradient
				style={styles.container}
				colors={['darkblue', 'darkblue', 'black']}
				start={{ x: 0, y: 0 }}
				end={{ x: 0, y: 1 }}
			>
				<SafeAreaView style={styles.title}>
					<Text style={styles.titleText}>
						{t('choose-device')}
					</Text>
					{
						bluetoothState ? (
							<FlatList
								contentContainerStyle={styles.flatlistContiner}
								data={discoveredDevices}
								renderItem={({ item }) => {
									const selectDevice = () => {
										onDeviceSelected(item);
									};
									return (
										<TouchableOpacity onPress={ selectDevice }>
											<LinearGradient
												style={ styles.ctaButton }
												colors={['white','#4364F7', '#6FB1FC']}
												start={{ x: 0, y: 0 }}
												end={{ x:1.4, y: 0 }}
											>
												<Text style={styles.ctaButtonText}>{item.name}</Text>
											</LinearGradient>
										</TouchableOpacity>
									);
								}
								}/>
						) : (
							<View style={{ marginTop: 50}}>
								<ActivityIndicator size='large' color='white' />
							</View>
						)
					}
					
				</SafeAreaView>
			</LinearGradient>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	flatlistContiner: {
		flex: 1,
		marginTop: 60,
	},
	cellOutline: {
		borderWidth: 1,
		borderColor: 'black',
		alignItems: 'center',
		marginHorizontal: 20,
		paddingVertical: 15,
		borderRadius: 8,
	},
	title: {
		flex: 1,
	},
	titleText: {
		marginTop: 40,
		fontSize: 28,
		fontWeight: 'bold',
		marginHorizontal: 20,
		textAlign: 'center',
		color: 'white',
	},
	ctaButton: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 50,
		marginHorizontal: 20,
		marginBottom: 5,
		borderRadius: 12,
	},
	ctaButtonText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: 'white',
	},
});

export default ConnectionScreen;