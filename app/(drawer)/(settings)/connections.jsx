import React, { useEffect } from 'react';
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
	View,
	Alert,
	Platform,
	Linking
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppDispatch, useAppSelector } from '../../../state/store';
import { startScanning } from '../../../state/BluetoothLE/slice';
import { connectToDevice, disconnectFromDevice } from '../../../state/BluetoothLE/listener';
import { Ionicons } from '@expo/vector-icons';


const ConnectionScreen = () => {
	const dispatch = useAppDispatch();
	const discoveredDevices = useAppSelector((state) => state.ble.allDevices);
	const bluetoothState = useAppSelector(state => state.ble.bluetoothEnabled);
	const connectedDevice = useAppSelector(state => state.ble.connectedDevice);

	useFocusEffect(
		React.useCallback(() => {
			if(!bluetoothState) createAlert();
		}, [bluetoothState])
	);

	useEffect(() => {
		dispatch(startScanning());
	}, []);

	const onDeviceSelected = (deviceId) => {
		dispatch(connectToDevice(deviceId));
		router.push('/(tabs)/presets');
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	};

	const onDisconnectButtonTapped = (device) => {
		dispatch(disconnectFromDevice(device));
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
				onPress: () => { goToSettings(); router.back(); }
			},
			{
				text: t('cancel'),
				style: 'cancel',
				onPress: () => { router.back(); }
			},
						
		]);
	};

	return (
		<View style={styles.container}>
			<LinearGradient
				style={{...StyleSheet.absoluteFillObject}}
				colors={['#2c3e50', '#3498db']}
				start={{ x: 0, y: 0 }}
				end={{ x: 0, y: 1 }}
			>
				<SafeAreaView style={{ flex: 1 }}>
					<Text style={styles.titleText}>
						{t('choose-device')}
					</Text>
					<View style={styles.title}>
						{
							bluetoothState || !discoveredDevices ? (
								<FlatList
									contentContainerStyle={styles.flatlistContiner}
									data={discoveredDevices}
									ItemSeparatorComponent={() => (
										<View style={styles.separator} />
									)} 
									renderItem={({ item }) => {
										const selectDevice = () => {
											onDeviceSelected(item);
										};
										return (
											<View style={styles.tableRow}> 
												<Text style={styles.listItem}>{item.name}</Text>
												{connectedDevice?.id ? 
													<TouchableOpacity
														style={styles.listButton} onPress={() => onDisconnectButtonTapped(item)}>
														<Text style={styles.disconnectTxt}>{t('disconnect-device')}</Text>
													</TouchableOpacity> : 
													<TouchableOpacity
														style={styles.listButton} onPress={ selectDevice }>
														<Text style={styles.connectTxt}>{t('connect-device')}</Text>
													</TouchableOpacity> }
											</View>
										);
									}
									
									}/>
							) : (
								<View style={{ marginVertical: 30 }}>
									<ActivityIndicator size={24} color='gray' />
								</View>
							)
						}
					</View>
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
		flexGrow: 1,
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
		marginTop: 30,
		marginBottom: 20,
		marginHorizontal: 20,
		borderRadius: 20,
		backgroundColor: 'rgba(30, 30, 30, 0.5)', // Semi-transparent background
	},
	titleText: {
		marginTop: 40,
		fontSize: 28,
		fontFamily: 'Inter-Bold',
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
	tableRow: {
		marginHorizontal: 15,
		marginTop: 5,
		marginBottom: 5,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	listItem: {
		color: 'white', // Text color
		fontSize: 17,
		fontFamily: 'Inter-Regular',
		paddingVertical: 15,
		paddingHorizontal: 10,
	},
	disconnectTxt: {
		color: 'red',
		fontFamily: 'Inter-Medium',
		fontSize: 16,
		paddingHorizontal:7,
	},
	connectTxt: {
		color: 'white',
		fontFamily: 'Inter-Medium',
		fontSize: 16,
		paddingHorizontal: 7,
	},
	separator: {
		height: 0.5,
		backgroundColor: 'rgba(255, 255, 255, 0.3)', // Example color
		marginVertical: 6, // Example margin
	},
});

export default ConnectionScreen;