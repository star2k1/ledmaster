import { BleError, BleManager, Characteristic, Device } from 'react-native-ble-plx';
import { atob, btoa } from 'react-native-quick-base64';
import { hexArrayToString } from '../../services/hexToBitmap';

export interface DeviceReference {
	name?: string | null;
	id?: string;
}

const SERVICE_UUID = '1848';
const SETUP_CHARACTERISTIC_UUID = '6cf32036-9765-4a72-9bb7-74555500b000';
const TEXT_CHARACTERISTIC_UUID = '6cf32036-9765-4a72-9bb7-74555500b001';
const DESIGN_CHARACTERISTIC_UUID = '6cf32036-9765-4a72-9bb7-74555500b002';

class BluetoothLeManager {
	bleManager: BleManager;
	device: Device | null;
	isListening = false;

	constructor() {
		this.bleManager = new BleManager();
		this.device = null;
	}

	getBluetoothState(callback: (state: string) => void) {
		this.bleManager.onStateChange((state) => {
			callback(state);
		}, true);
	};

	

	scanForPeripherals = (onDeviceFound: (deviceSummary: DeviceReference) => void) => {
		this.bleManager.startDeviceScan(null, null, (_, scannedDevice) => {
			onDeviceFound({
				id: scannedDevice?.id,
				name: scannedDevice?.localName ?? scannedDevice?.name,
			});
		});
	};

	stopScanningForPeripherals = () => {
		this.bleManager.stopDeviceScan();
	};

	connectToPeripheral = async (identifier: string) => {
		this.device = await this.bleManager.connectToDevice(identifier);
		await this.device?.discoverAllServicesAndCharacteristics();
	};

	disconnectFromPeripheral = async (identifier: string) => {
		this.device = await this.bleManager.cancelDeviceConnection(identifier);
	};

	readData = async () => {
		try {
			const rawData = await this.bleManager.readCharacteristicForDevice(
				this.device?.id ?? "",
				SERVICE_UUID,
				DESIGN_CHARACTERISTIC_UUID
			);
			return atob(rawData.value!);
		} catch (e) {
			console.log(e);
		}
	};

	// sendData = async (data: string) => {
    // // Convert the data to bytes
    // const dataBytes = Buffer.from(data);

    // // Split the data into 100-byte chunks
    // const chunkSize = 100;
	// const chunks = [];
	// for (let i = 0; i < dataBytes.length; i += chunkSize) {
    // 	chunks.push(dataBytes.subarray(i, i + chunkSize));
	// }

    // // Send each chunk
    // try {
    //     for (const chunk of chunks) {
    //         const eData = btoa(chunk.toString());
    //         await this.bleManager.writeCharacteristicWithResponseForDevice(
    //             this.device?.id ?? "",
    //             SERVICE_UUID,
    //             DESIGN_CHARACTERISTIC_UUID,
    //             eData
    //         );
    //     }
    // } catch (e) {
    //     console.log(e);
    // }
	// };

	sendAnimation = async (data: string[][][]) => {
		try {
			const len = String(data.length).padStart(3, '0');
			for (const frame of data) {
				let frameString = hexArrayToString(frame);
				frameString = len + frameString;
				const eData = btoa(frameString);
				await this.bleManager.writeCharacteristicWithResponseForDevice(
					this.device?.id ?? "",
					SERVICE_UUID,
					DESIGN_CHARACTERISTIC_UUID,
					eData
				);
			}
		} catch (e) {
			console.log("Error when sending animation: ", e);
		}
	};

	sendDesign = async (data: string) => {
		//console.log(data);
		const eData = btoa(data);
		try {
			await this.bleManager.writeCharacteristicWithResponseForDevice(
				this.device?.id ?? "",
				SERVICE_UUID,
				DESIGN_CHARACTERISTIC_UUID,
				eData
			);
		} catch (e) {
			console.log("Error when sending design: ", e);
		}
	};

	sendData = async (data: string) => {
		const eData = btoa(data);
		try {
			await this.bleManager.writeCharacteristicWithResponseForDevice(
				this.device?.id ?? "",
				SERVICE_UUID,
				SETUP_CHARACTERISTIC_UUID,
				eData
			);
		} catch (e) {
			console.log("Error when sending data: ", e);
		}
	};

	sendText = async (data: string) => {
		const eData = btoa(data);
		try {
			await this.bleManager.writeCharacteristicWithResponseForDevice(
				this.device?.id ?? "",
				SERVICE_UUID,
				TEXT_CHARACTERISTIC_UUID,
				eData
			);
		} catch (e) {
			console.log("Error when sending text: ", e);
		}
	};

	onDataReceived = (
		error: BleError | null,
		characteristic: Characteristic | null,
		emitter: (bleValue: {payload: string | BleError}) => void
	) => {
		if (error || !characteristic || !characteristic.value) {
			console.log("ERROR", error);
			emitter({ payload: '0' });
			return;
		}
		const num = atob(characteristic?.value!);
		emitter({ payload: num });
	};


	startStreamingData = async (
		emitter: (bleValue: {payload: string | BleError}) => void
	) => {
		if (!this.isListening) {
			this.isListening = true;
			this.device?.monitorCharacteristicForService(
				SERVICE_UUID,
				DESIGN_CHARACTERISTIC_UUID,
				(error, characteristic) => {
					this.onDataReceived(error, characteristic, emitter);
				}
			);
		}
	};

}

const manager = new BluetoothLeManager();

export default manager;