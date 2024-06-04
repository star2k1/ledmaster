import React, { useEffect, useState } from 'react';
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
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import LanguageDialog from '../components/LanguageModal';
import { useAppSelector, useAppDispatch } from '../state/store';
import { disconnectFromDevice } from '../state/BluetoothLE/listener';
import { startCheckingState } from '../state/BluetoothLE/bleSlice';
import MaskedView from '@react-native-masked-view/masked-view';
import ConnectionsModal from '../components/ConnectionsModal';
import AlertService from '../services/AlertService';


const styles = StyleSheet.create({
	text: {
		color: 'white',
	},
	container: {
		flex: 1,
	},
	contentContainer: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center'
	},
	titleContainer: {
		alignItems: 'center',
		marginBottom: 50,
	},
	headerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 15,
	},
	footerContainer: {
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	logo: {
		fontSize: 32,
		backgroundColor: 'transparent',
		fontFamily: 'Inter-Black',
	},
	title: {
		fontSize: 42,
		fontFamily: 'Inter-ExtraBold',
		backgroundColor: 'transparent',
		marginBottom: 15,
		textAlign: 'center',
	},
	secondTitle: {
		fontSize: 18,
		color: '#fff',
		marginBottom: 10,
		textAlign: 'center',
		fontFamily: 'Inter-Light',
	},
	normalText: {
		fontSize: 18,
		fontWeight: '500',
		color: '#fff',
		marginTop: 10,
		fontFamily: 'Inter-Regular'
	},
	textBtn: {
		color: '#fff', // Text color can be white
		fontFamily: 'Inter-Regular', // Inter font family
		fontSize: 18,
		textAlign: 'center',
	},
	btnConnect: {
		backgroundColor: 'rgba(0, 0, 255, 0.9)',
		paddingLeft: 25,
		paddingRight: 25,
		paddingTop: 12,
		paddingBottom: 12,
		borderRadius: 20,
		marginTop: 20,
		alignSelf: 'center',
	}
});

const HomeScreen = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const bluetoothState = useAppSelector(state => (state.ble.bluetoothEnabled));
	const myAlerts = AlertService(t);
	useEffect(() => {
		dispatch(startCheckingState());
	}, []);

	const [isLanguageDialogVisible, setIsLanguageDialogVisible] = useState(false);
	const toggleLanguageDialog = () => {
		setIsLanguageDialogVisible(!isLanguageDialogVisible);
	};

	const [isConnectionDialogVisible, setIsConnectionDialogVisible] = useState(false);
	const toggleConnectionDialog = () => {
		setIsConnectionDialogVisible(!isConnectionDialogVisible);
	};

	const theme = useColorScheme();
	const statusBarStyle = theme === 'dark' ? 'light-content' : 'dark-content';

	const connectedDevice = useAppSelector(state => state.ble.connectedDevice);

	const onWithoutConnectButtonTapped = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		router.push('/(tabs)/presets');
	};

	const onDisconnectButtonTapped = async() => {
		dispatch(disconnectFromDevice(connectedDevice));
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
	};

	const onConnectButtonTapped = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		bluetoothState ? toggleConnectionDialog() : myAlerts.showBluetoothAlert();
	};

	const handleConnectionModalClose = () => {
		if (connectedDevice) {
			toggleConnectionDialog();
			router.push('/(tabs)/presets');
		} else {
			toggleConnectionDialog();
		}
	};

	const onLanguageButtonTapped = () => {
		toggleLanguageDialog(); 
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	};
	
	return (
		<SafeAreaView style={ styles.container }>
			<LinearGradient
				style={{ ...StyleSheet.absoluteFillObject }}
				colors={['rgba(0,0,30,1)','midnightblue','navy','rgba(0,0,50,1)']}
			/>
			<View style={styles.headerContainer}>
				<MaskedView 
					maskElement={<Text style={styles.logo}>BTLED</Text>}>
					<LinearGradient
						start={{x: 0, y: 0}}
						end={{x: 0.9, y: 0.5}}
						colors={['#6a61ff', '#0000ff','#00d4ff']}
					>
						<Text style={{...styles.logo, opacity: 0}}>BTLED</Text>
					</LinearGradient>
				</MaskedView>
				<TouchableOpacity onPress={onLanguageButtonTapped}>
					<Ionicons name="language" size={30} color="white" />
				</TouchableOpacity>
			</View>
			<View style = {styles.contentContainer}>
				<View style={styles.titleContainer}>
					<MaskedView maskElement={<Text style={styles.title}>{ t('welcome') }</Text>}>
						<LinearGradient
							start={{x: 0, y: 0}}
							end={{x: 1, y: 1}}
							colors={['#fc00ff','#00dbde']}
						>
							<Text style={{...styles.title, opacity: 0}}>{ t('welcome') }</Text>
						</LinearGradient>
					</MaskedView>
					<View>
						<Text style={styles.secondTitle}>
							{ connectedDevice?.id ? '' : t('begin') }</Text>
					</View>
				</View>
				<View>
					{/* <Text style={styles.secondTitle}>{ t('begin') }</Text> */}
					<View>
						{connectedDevice?.id ? (
							<TouchableOpacity onPress={onDisconnectButtonTapped}>
								<LinearGradient
									style={ styles.btnConnect }
									colors={['#7b4397','#dc2430']}
									start={{ x:0, y: 0 }}
									end={{ x:0.7, y: 0 }}
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
									colors={['#2b32b2', '#1488cc']}
									start={{ x: 0, y:0 }}
									end={{ x:1, y: 0 }}
								>
									<Text style={styles.textBtn}>{t('search-device')}
										<Text>  </Text>
										<FontAwesome style={[styles.icon, { marginLeft: 20 }]} name='bluetooth-b' size={18} color='white'/>
									</Text>
						
								</LinearGradient>
							</TouchableOpacity>
						)}
					</View>
				</View>
			</View>
			<View style={styles.footerContainer}>
				<View><Text style={styles.secondTitle}>{ t('or') }</Text></View>
				<View style={{ marginBottom: 20, alignItems: 'center' }}>
					<TouchableOpacity onPress={onWithoutConnectButtonTapped}>
						<Text style={styles.normalText}>{ 
							connectedDevice?.id ? t('continue-to-app') : t('continue-without') }
						</Text>
					</TouchableOpacity>
				</View>
			</View>
			<StatusBar barStyle={statusBarStyle} />
			<LanguageDialog
				visible={isLanguageDialogVisible}
				onClose={toggleLanguageDialog}
			/>
			<ConnectionsModal
				visible={isConnectionDialogVisible}
				onClose={handleConnectionModalClose}
			/>
		</SafeAreaView>
	);
};

export default HomeScreen;