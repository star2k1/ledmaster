import React, { useState } from 'react';
import { 
	View,
	SafeAreaView,
	useColorScheme,
	StyleSheet,
	Text,
	TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import LinearGradient from 'react-native-linear-gradient';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
//import DeviceModal from '../components/DeviceConnectionModal';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import LanguageDialog from '../components/LanguageModal';
import { useAppSelector, useAppDispatch } from '../state/store';
import { disconnectFromDevice } from '../state/BluetoothLE/listener';

const styles = StyleSheet.create({
	text: {
		color: 'white',
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 34,
		fontWeight: '900',
		color: '#fff', // Title color can be white
		//fontFamily: 'Inter', // Inter font family
		textAlign: 'left'
	},
	normalText: {
		fontSize: 18,
		fontWeight: '400',
		color: '#fff',
		marginTop: 10,
	},
	textBtn: {
		color: '#fff', // Text color can be white
		fontFamily: 'Inter', // Inter font family
		fontSize: 18,
		textAlign: 'center',
		fontWeight: '400',
	},
	btnConnect: {
		backgroundColor: 'rgba(0, 0, 255, 0.9)',
		paddingLeft: 25,
		paddingRight: 25,
		paddingTop: 12,
		paddingBottom: 12,
		borderRadius: 20,
	}
});

const HomeScreen = () => {
	
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const [isDialogVisible, setIsDialogVisible] = useState(false);
	const toggleDialog = () => {
		setIsDialogVisible(!isDialogVisible);
	};

	const theme = useColorScheme();
	const statusBarStyle = theme === 'dark' ? 'light-content' : 'dark-content';

	const onWithoutConnectButtonTapped = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		router.push('/(tabs)/presets');
	};

	const onDisconnectButtonTapped = () => {
		dispatch(disconnectFromDevice(connectedDevice));
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
	};

	const onConnectButtonTapped = () => {
		router.push('/(settings)/connections');
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
	};

	const onLanguageButtonTapped = () => {
		toggleDialog(); 
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	};
	
	const connectedDevice = useAppSelector(state => state.ble.connectedDevice);
	return (
		<LinearGradient
			style={ styles.container }
			colors={['black', 'darkblue', 'darkblue']}
			start={{ x: 0, y: 0 }}
			end={{ x: 4, y: 3 }}
		>
			<SafeAreaView style={styles.container}>
				<View style={{ flex: 1, flexDirection: 'row'}}>
					
					<View>
						<Text style={styles.title}>LEDMASTER</Text>
					</View>
					<View>
						<Text>GANGGANGGAN</Text>
					</View>
					<View>
						<TouchableOpacity onPress={onLanguageButtonTapped}>
							<Ionicons style={{ justifyContent: 'center' }} name="language" size={30} color="white" />
						</TouchableOpacity>
					</View>
				</View>
				<View style= {{ flex: 1 }}>
					{connectedDevice?.id ? (
						<TouchableOpacity onPress={onDisconnectButtonTapped}>
							<LinearGradient
								style={ styles.btnConnect }
								colors={['#0052D4','#4364F7', '#6FB1FC']}
								start={{ x: 0, y: 0 }}
								end={{ x:1.4, y: 0 }}
							>
								<Text style={styles.textBtn}>{t('disconnect-device')}
									<Text>  </Text>
									<FontAwesome style={[styles.icon, { marginLeft: 20 }]} name='bluetooth-b' size={18} color='white'/>
								</Text>
							</LinearGradient>
						</TouchableOpacity>
					) : (
						<TouchableOpacity onPress={onConnectButtonTapped}>
							<LinearGradient
								style={ styles.btnConnect }
								colors={['#0052D4','#4364F7', '#6FB1FC']}
								start={{ x: 0, y: 0 }}
								end={{ x:1.4, y: 0 }}
							>
								<Text style={styles.textBtn}>{t('search-device')}
									<Text>  </Text>
									<FontAwesome style={[styles.icon, { marginLeft: 20 }]} name='bluetooth-b' size={18} color='white'/>
								</Text>
						
							</LinearGradient>
						</TouchableOpacity>
					)}
				</View>
				<View style={{ marginBottom: 20, alignItems: 'center' }}>
					<TouchableOpacity onPress={onWithoutConnectButtonTapped}>
						<Text style={styles.normalText}>{ t('continue-without') }</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
			<StatusBar barStyle={statusBarStyle} />
			<LanguageDialog
				visible={isDialogVisible}
				onClose={toggleDialog}
			/>
		</LinearGradient>
	);
};

export default HomeScreen;
