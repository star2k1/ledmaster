import React, { useState } from 'react';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { Animated, TouchableOpacity, StyleSheet, View, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import LanguageDialog from '../../components/LanguageModal';
import * as Haptics from 'expo-haptics';
import { sendDataToDevice } from '../../state/BluetoothLE/listener';
import { useAppDispatch, useAppSelector } from '../../state/store';
import { setCurrentBrightness, setCurrentState } from '../../state/Matrix/matrixSlice';
import Slider from '@react-native-community/slider';
import ConnectionsModal from '../../components/ConnectionsModal';
import AlertService from '../../services/AlertService';

const CustomDrawerContent = (props) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const matrixState = useAppSelector(state => (state.matrix.isOn));
	const matrixBrightness = useAppSelector(state => (state.matrix.brightness));
	const connectedDevice = useAppSelector(state => (state.ble.connectedDevice));
	const bluetoothState = useAppSelector(state => (state.ble.bluetoothEnabled));
	const [isLanguageDialogVisible, setIsLanguageDialogVisible] = useState(false);
	const [isConnectionsModalVisible, setIsConnectionsModalVisible] = useState(false);
	const myAlerts = AlertService(t);

	const toggleSwitch = () => {
		dispatch(setCurrentState(!matrixState));
		matrixState ? dispatch(sendDataToDevice('Off')) : dispatch(sendDataToDevice('On'));
	};
	const toggleLanguageDialog = () => {
		setIsLanguageDialogVisible(!isLanguageDialogVisible);
	};
	const toggleConnectionsModal = () => {
		setIsConnectionsModalVisible(!isConnectionsModalVisible);
	};
	const onLanguageItemTapped = () => {
		toggleLanguageDialog(); 
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	};
	const onConnectionsItemTapped = () => {
		bluetoothState ? toggleConnectionsModal() : myAlerts.showBluetoothAlert(); 
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	};
	const onBrightnessChange = (value) => {
		if (value != value.previous) {
			dispatch(sendDataToDevice('B'+ value));
			dispatch(setCurrentBrightness(value));
		}
	};
	const onBrightnessChanged = (value) => {
		dispatch(setCurrentBrightness(value));
	};
	const av = new Animated.Value(0);
	av.addListener(() => {return;});
	return(
		<DrawerContentScrollView {...props}>
			<DrawerItem
				label={''}
				labelStyle={styles.navItemLabel}
				icon={({ size }) => (
					<View style={{ flexDirection: 'row' }}>
						<Ionicons 
							name= {matrixState === true ? 'power' : 'power-outline'}
							color='rgba(255,255,255,0.7)'
							size={size}
							style={{ alignSelf: 'center', marginRight: 20 }}
						/>
						<Switch
							trackColor={{ false: 'rgba(255,0,0,1)', true: 'rgba(0,120,255,1)' }}
							thumbColor={matrixState ? '#ffffff' : '#rgba(255,255,255,0.7)'}
							ios_backgroundColor="#3e3e3e"
							onValueChange={toggleSwitch}
							value={connectedDevice === null ? false : matrixState}
							disabled={connectedDevice === null ? true : false}
						/>
					</View>
				)}
				pressOpacity={1}
			/>
			<DrawerItem
				label={''}
				icon={({ size }) => (
					<View style={{ flexDirection: 'row' }}>
						<Ionicons 
							name={matrixBrightness < 15 ? 'moon' : 'moon-outline'}
							color='rgba(255,255,255,0.7)'
							size={size}
							style={{ alignSelf: 'center', marginRight: 20 }}
						/>
						<Slider
							style={{ width: 150, height: 10 }}
							minimumValue={1}
							maximumValue={30}
							minimumTrackTintColor="rgba(0,120,255,1)"
							step={2}
							disabled={
								(connectedDevice === null ? true : false) ||
								(matrixState === false ? true : false)
							}
							value={matrixBrightness}
							onValueChange={onBrightnessChange}
							onSlidingComplete={onBrightnessChanged}
						/>
						<Ionicons
							name={matrixBrightness > 15 ? 'sunny': 'sunny-outline'}
							color='rgba(255,255,255,0.7)'
							size={size}
							style={{alignSelf:'center', marginLeft: 20}}
						/>
					</View>
				)}
				pressOpacity={1}
			/>
			<DrawerItem 
				style={{ }}
				label= {t('connections')}
				labelStyle={isConnectionsModalVisible ? {...styles.boldItemLabel} :  {...styles.navItemLabel }}
				onPress={onConnectionsItemTapped}
				icon={({ focused, size }) => (
					<Ionicons
						name={ focused ? 'bluetooth' : 'bluetooth-outline'}
						size={size}
						color={ focused ? 'white' : 'rgba(255,255,255,0.7)'}
					/>
				)}
                
			/>
			<DrawerItem
				label={t('language')}
				labelStyle={isLanguageDialogVisible ? [ {...styles.boldItemLabel}] : {...styles.navItemLabel} }
				onPress={onLanguageItemTapped}
				icon={({ focused, size }) => (
					<Ionicons 
						name={focused ? 'language' : 'language-outline'}
						size={size}
						color={focused ? 'white' : 'rgba(255,255,255,0.7)' }
					/>
				)}
                
			/>
			<DrawerItem 
				style={{ }}
				label={t('settings')}
				labelStyle={styles.navItemLabel}
				onPress={() => {
					router.navigate('/(settings)');
				}}
				icon={({ focused, size }) => (
					<Ionicons
						name={ focused ? 'settings' : 'settings-outline'}
						size={size}
						color={ focused ? 'white' : 'rgba(255,255,255,0.7)'}
					/>
				)}
                
			/>
			<DrawerItem 
				style={{ }}
				label={t('about')}
				labelStyle={styles.navItemLabel}
				onPress={() => {
					router.navigate('/');
				}}
				icon={({ size }) => (
					<Ionicons name='information-circle-outline' size={size} color={'rgba(255,255,255,0.7)'} />
				)}
                
			/>
			<LanguageDialog
				visible={isLanguageDialogVisible}
				onClose={toggleLanguageDialog}
			/>
			<ConnectionsModal
				visible={isConnectionsModalVisible}
				onClose={toggleConnectionsModal}
			/>
		</DrawerContentScrollView>
	);
	
};

export default function Layout() {
	const navigation = useNavigation();
	return (
		<Drawer
			screenOptions={{ 
				drawerPosition: 'right', 
				headerLeft: false,
				headerRight: () => (
					<TouchableOpacity 
						style={{paddingRight: 15}}
						onPress={()=> navigation.dispatch(DrawerActions.toggleDrawer())}>
						<View>
							<Ionicons
								style={{ justifyContent: 'center' }} 
								name="menu"
								size={32}
								color="rgba(255,255,255,0.7)"
							/>
						</View>
					</TouchableOpacity>
				),
				overlayColor: 'rgba(5,12,13,0.2)'
			}
			} 
			drawerContent={(props) => <CustomDrawerContent {...props} />}
            
		>
			<Drawer.Screen 
				name= '(tabs)'
				options={{ headerShown: false, unmountOnBlur: true }}
			/>
			
		</Drawer>
	);
}

const styles = StyleSheet.create({
	navItemLabel: {
		textAlign: 'left',
		fontFamily: 'Inter-Regular',
		fontSize: 18,
		marginLeft: -10,
		color: 'rgba(255,255,255,0.8)'
	},
	boldItemLabel: {
		textAlign: 'left',
		fontFamily: 'Inter-Bold',
		fontSize: 18,
		marginLeft: -10,
		color: 'white'
	},
});