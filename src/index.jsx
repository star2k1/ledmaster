import React, { useState } from 'react';
import { SafeAreaView, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import useBLE from '../useBLE';
import DeviceModal from '../DeviceConnectionModal';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		position: 'absolute',
		top: 50,
		right: 5,
		fontSize: 40,
		fontWeight: '900',
		color: '#fff', // Title color can be white
		fontFamily: 'Inter', // Inter font family
		marginBottom: 100,
	},
	normalText: {
		fontSize: 20,
		fontWeight: '400',
		color: '#fff',
		marginTop: 10,
	},
	button: {
		backgroundColor: 'rgba(0, 0, 255, 0.9)',
		paddingLeft: 25,
		paddingRight: 25,
		paddingTop: 12,
		paddingBottom: 12,
		borderRadius: 20,
	},
	buttonText: {
		color: '#fff', // Text color can be white
		fontFamily: 'Inter', // Inter font family
		fontSize: 18,
	},
});

export default function App() {
	const { 
		scanForPeripherals,
		allDevices,
		connectToDevice,
		connectedDevice,
		disconnectFromDevice,
	} = useBLE();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const scanForDevices = scanForPeripherals;

	const theme = useColorScheme();
	const statusBarStyle = theme === 'dark' ? 'light-content' : 'dark-content';

	const hideModal = () => {
		setIsModalVisible(false);
	};

	const openModal = async () => {
		scanForDevices();
		setIsModalVisible(true);
	};

	return (
		<LinearGradient
			style={ styles.container }
			colors={['black', 'darkblue', 'darkblue']}
			start={{ x: 0, y: 0 }}
			end={{ x: 4, y: 3 }}
		>
			<SafeAreaView style={ styles.container }>
				<Text style={styles.title}>LEDMASTER</Text>
				{/* {connectedDevice ? (
					<>
						<Text style={styles.normalText}>LED ON ÜHENDATUD</Text>
					</>
				) : (
					<Text style={styles.normalText}>LEDMASTER</Text>
				)} */}
				<TouchableOpacity onPress={connectedDevice ? disconnectFromDevice : openModal}>
					<LinearGradient
						style={ styles.button }
						colors={['#0052D4','#4364F7', '#6FB1FC']}
						start={{ x: 0, y: 0 }}
						end={{ x:1.4, y: 0 }}
					>
						<Text style={styles.buttonText}>{connectedDevice ? 'Ühenda lahti  ' : 'Otsi seadet  '}
							<FontAwesome style={styles.icon} name='bluetooth-b' size={18} color='white'/></Text>
						
					</LinearGradient>
				</TouchableOpacity>
				<DeviceModal
					closeModal={hideModal}
					visible={isModalVisible}
					connectToPeripheral={connectToDevice}
					devices={allDevices}
				/>
				<StatusBar barStyle={statusBarStyle} />
			</SafeAreaView>
		</LinearGradient>
	);
}
