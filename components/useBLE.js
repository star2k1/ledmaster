import { useMemo, useState, useEffect } from 'react';
import { BleManager } from 'react-native-ble-plx';


function useBLE()
{
	const bleManager = useMemo(() => new BleManager(), []);
	const [allDevices, setAllDevices] = useState([]);
	const [connectedDevice, setConnectedDevice] = useState(null);

	const checkBluetoothEnabled = () => {
		return new Promise((resolve, reject) => {
			try {
				bleManager.onStateChange((state) => {
					if (state === 'PoweredOn') {
						resolve(true); // Bluetooth is enabled
					} else {
						resolve(false); // Bluetooth is disabled or other state
					}
				}, true);
			} catch (error) {
				console.error('Error checking Bluetooth state:', error);
				reject(error); // Reject the promise if an error occurs
			}
		});
	};


	const isDuplicateDevice = (devices, nextDevice) =>
		devices.findIndex((device) => nextDevice.id === device.id) > -1;

	const scanForPeripherals = () => {
		bleManager.startDeviceScan(null, null, (error, device) => {
			if (error) { console.log(error); }
			if(device && device.name?.includes('ESP'))
			{
				setAllDevices((prevState) => {
					if(!isDuplicateDevice(prevState, device)) {
						return [...prevState, device];
					}
					return prevState;
				});
			}
		});
	};


	const connectToDevice = async (device) => {
		try {
			const deviceConnection = await bleManager.connectToDevice(device.id);
			setConnectedDevice(deviceConnection);
			await deviceConnection.discoverAllServicesAndCharacteristics();
			bleManager.stopDeviceScan();
		}
		catch (e) 
		{
			console.log('ERROR IN CONNECTION', e);
		}
	};

	const disconnectFromDevice = () => {
		if (connectedDevice) {
			bleManager.cancelDeviceConnection(connectedDevice.id);
			setConnectedDevice(null);
		}
	};

	return {
		scanForPeripherals,
		allDevices,
		connectToDevice,
		connectedDevice,
		disconnectFromDevice,
		checkBluetoothEnabled,
	};
}

export default useBLE;