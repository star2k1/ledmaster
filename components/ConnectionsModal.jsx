import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import
{
	FlatList,
	SafeAreaView,
	Text,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
	View,
	Modal
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../state/store';
import { startScanning } from '../state/BluetoothLE/bleSlice';
import { connectToDevice, disconnectFromDevice } from '../state/BluetoothLE/listener';
import { Ionicons } from '@expo/vector-icons';
import AlertService from '../services/AlertService';

const ConnectionsModal = ({ visible, onClose }) => {
	const dispatch = useAppDispatch();
	const discoveredDevices = useAppSelector((state) => state.ble.allDevices);
	const bluetoothState = useAppSelector(state => state.ble.bluetoothEnabled);
	const connectedDevice = useAppSelector(state => state.ble.connectedDevice);
	const [isLoading, setIsLoading] = useState(false);
	const { t } = useTranslation();
	const myAlerts = AlertService(t);

	useEffect(() => {
		if (visible) dispatch(startScanning());
	}, [visible]);

	const onDeviceSelected = async(deviceId) => {
		if (!bluetoothState) {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			setIsLoading(true);
  			setTimeout(() => {
    			setIsLoading(false);
    			myAlerts.showBluetoothAlert();
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  			}, 1000);
		} else {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			setIsLoading(true);
			await dispatch(connectToDevice(deviceId));
			setIsLoading(false);
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
			//onClose();
		}
	};

	const onDisconnectButtonTapped = async(device) => {
		await dispatch(disconnectFromDevice(device));
	};

	return (
		<Modal animationType="fade" visible={visible} transparent onRequestClose={onClose} onOrientationChange={'portrait'}>
			<SafeAreaView style={styles.container}>
				<BlurView intensity={20} style={styles.overlay}>
					<TouchableOpacity 
						style={styles.overlay} 
						activeOpacity={1} 
						onPress={onClose} // Close the modal when clicking outside
					/>
				</BlurView>
				<BlurView intensity={40} style={styles.dialogContainer}>
					<Ionicons name="bluetooth" size={30} style={{alignSelf:'center', paddingBottom: 10}} color='white' />
					<Text style={styles.titleText}>{t('devices')}</Text>
					<View style={styles.titleSeparator}></View>
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
									<View>
										<Text style={styles.listItem}>{item.name}</Text>
										<Text style={styles.connectionTxt}>{connectedDevice?.id == item?.id ? t('connected') : (t('not-connected'))}</Text>
									</View> 
									{connectedDevice?.id ? 
										<TouchableOpacity
											style={styles.listButton} onPress={() => onDisconnectButtonTapped(item)}>
											<Text style={styles.disconnectTxt}>{t('disconnect-device')}</Text>
										</TouchableOpacity> : 
										<TouchableOpacity
											style={styles.listButton} onPress={ selectDevice }>
											<View>
												{isLoading ?
													(<ActivityIndicator size={16} color='gray' style={{marginRight: 15}} />)
													: (<Text style={styles.connectTxt}>{t('connect-device')}</Text> )
												}
											</View>
										</TouchableOpacity> }
								</View>
							);
						}}
					/>
					<View style={styles.bottomSeparator}></View>
					{ (bluetoothState && !connectedDevice) ?
						<View style={{flexDirection: 'row', justifyContent: 'center'}}>
							<ActivityIndicator size='small' color='white'/>
							<Text style={{ marginVertical: 15, color: 'rgba(160,160,160,0.9)', fontFamily:'Inter-Light', fontSize: 16}}>
								{t('look-for-devices')}
							</Text>
						</View> : <View><Text style={styles.defaultText}>{t('no-more-devices')}</Text></View>
					}
				</BlurView>
			</SafeAreaView>
		</Modal>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent background
		justifyContent: 'center',
		alignItems: 'center'
	},
	dialogContainer: {
		paddingTop: 15,
		paddingBottom: 5,
		borderRadius: 28,
		width: '85%',
		overflow: 'hidden',
		backgroundColor: 'rgba(0,0,0,0.5)'
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
	},
	flatlistContiner: {
		flexGrow: 1,
	},
	titleText: {
		color: 'white', // Text color
		fontSize: 17,
		alignSelf: 'center',
		textAlign: 'center',
		fontFamily: 'Inter-Medium',
		marginBottom: 15
	},
	tableRow: {
		marginHorizontal: 12,
		marginTop: 6,
		marginBottom: 6,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	listItem: {
		color: 'white', // Text color
		fontSize: 17,
		fontFamily: 'Inter-Regular',
		paddingHorizontal: 10,
	},
	defaultText: {
		color: 'rgba(140,140,140,0.9)',
		marginVertical: 15,
		fontFamily: 'Inter-Light',
		fontSize: 15,
		alignSelf: 'center',
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
	connectionTxt: {
		color: 'gray',
		fontFamily: 'Inter-Regular',
		fontSize: 16,
		paddingHorizontal: 10,
		marginTop: 1
	},
	separator: {
		height: 0.5,
		backgroundColor: 'rgba(255, 255, 255, 0.3)', // Example color
		marginVertical: 6, // Example margin
	},
	titleSeparator: {
		height: 0.3,
		backgroundColor: 'rgba(255, 255, 255, 0.3)', // Example color
	},
	bottomSeparator: {
		height: 0.3,
		backgroundColor: 'rgba(255, 255, 255, 0.3)', // Example color
	},
});
	
export default ConnectionsModal;