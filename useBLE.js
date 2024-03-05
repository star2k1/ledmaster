import { useMemo, useState } from 'react';
import { BleManager, Device } from 'react-native-ble-plx';


function useBLE()
{
	const bleManager = useMemo(() => new BleManager(), []);
	const [allDevices, setAllDevices] = useState([]);
	const [connectedDevice, setConnectedDevice] = useState(null);

	const isDuplicateDevice = (devices, nextDevice) =>
		devices.findIndex((device) => nextDevice.id === device.id) > -1;

	const scanForPeripherals = () => {
		bleManager.startDeviceScan(null, null, (error, device) => {
			if (error) { console.log(error); }
			if(device && device.name?.includes('LED'))
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
	};
}

export default useBLE;