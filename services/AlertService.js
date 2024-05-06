import { Alert, Platform, Linking } from 'react-native';
import * as Haptics from 'expo-haptics';

const AlertService = (t = null) => {

	const showBluetoothAlert = () => {
		const goToSettings = () => {
			if (Platform.OS === 'ios') {
				Linking.openURL('App-Prefs:Bluetooth');
			} else {
				console.log('Failed to open settings');
			}
		};
		Alert.alert(
			t ? t('bluetooth-error-title'): 'BTLED Uses Bluetooth',
			t ? t('bluetooth-error-msg') : 'Please Enable Bluetooth and Allow New Connections',
			[
				{
					text: t ? t('settings') : 'Settings',
					onPress: () => { goToSettings(); }
				},
				{
					text: t ? t('cancel') : 'Cancel',
					style: 'cancel'
				},
			]
		);
	};

	const showDisconnectAlert = (deviceName) => {
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
		const message = t ? (deviceName + t('device-disconnected')) : (deviceName + ' has been disconnected');
		return Alert.alert(
			message,
			null,
			null
		);
	};

	return {
		showBluetoothAlert,
		showDisconnectAlert
	};
};

export default AlertService;
