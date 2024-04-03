import { BleError, BleManager, Characteristic, Device } from 'react-native-ble-plx';
import { atob, btoa } from 'react-native-quick-base64';

export interface DeviceReference {
	name?: string | null;
	id?: string;
}

const SERVICE_UUID = '1848';
const CHARACTERISTIC_NOTIFY_UUID = '2BE2';
const CHARACTERISTIC_WRITE_UUID = '2BFD';

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
				CHARACTERISTIC_NOTIFY_UUID
			);
			return atob(rawData.value!);
		} catch (e) {
			console.log(e);
		}
	};

	sendData = async (data: string) => {
		const eData = btoa(data);
		try {
			await this.bleManager.writeCharacteristicWithResponseForDevice(
				this.device?.id ?? "",
				SERVICE_UUID,
				CHARACTERISTIC_WRITE_UUID,
				eData
			);
		} catch (e) {
			console.log(e);
		}
	};

	onDataReceived = (
		error: BleError | null,
		characteristic: Characteristic | null,
		emitter: (bleValue: {payload: string | BleError}) => void
	) => {
		if (error) {
			console.log("ERROR", error);
			emitter({ payload: '0' });
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
				CHARACTERISTIC_NOTIFY_UUID,
				(error, characteristic) => {
					this.onDataReceived(error, characteristic, emitter);
				}
			);
		}
	};

}

const manager = new BluetoothLeManager();

export default manager;