import { createAsyncThunk, createListenerMiddleware } from '@reduxjs/toolkit';
import {
    setConnectedDevice,
    setDevice,
    startScanning,
    setRetrievedData,
    startListening,
    startCheckingState,
    setBluetoothState
} from './slice';

import bluetoothLeManager, { DeviceReference } from './BluetoothLeManager';

export const bleMiddleware = createListenerMiddleware();

export const connectToDevice = createAsyncThunk(
    "bleThunk/connectToDevice",
    async (ref: DeviceReference, thunkApi) => {
        if (ref.id) {
            await bluetoothLeManager.connectToPeripheral(ref.id);
            thunkApi.dispatch(setConnectedDevice(ref));
            bluetoothLeManager.stopScanningForPeripherals();
        }
    }
);

export const disconnectFromDevice = createAsyncThunk(
    "bleThunk/disconnectFromDevice",
    async (ref: DeviceReference, thunkApi) => {
        if(ref.id) {
            const closedDevice = await bluetoothLeManager.disconnectFromPeripheral(ref.id);
            thunkApi.dispatch(setConnectedDevice(null));
            return closedDevice;
        }
    }
);

export const readDataFromDevice = createAsyncThunk(
    'bleThunk/readDataFromDevice',
    async (_, thunkApi) => {
        const data = await bluetoothLeManager.readData();
        thunkApi.dispatch(setRetrievedData(data));
    }
);

export const sendDataToDevice = createAsyncThunk(
    'bleThunk/sendDataToDevice',
    async (data: string, _) => {
        await bluetoothLeManager.sendData(data);
    }
);

bleMiddleware.startListening({
    actionCreator: startCheckingState,
    effect: (_, listenerApi) => {
        bluetoothLeManager.getBluetoothState((state) => {
            if (state === 'PoweredOn'){
                listenerApi.dispatch(setBluetoothState(true));
            } else {
                listenerApi.dispatch(setBluetoothState(false));
            }
        });
    },
});

bleMiddleware.startListening({
    actionCreator: startScanning,
    effect: (_, listenerApi) => {
        bluetoothLeManager.scanForPeripherals((device) => {
            if(device.name && device.name.includes('ESP')){
                listenerApi.dispatch(setDevice(device));
            } 
        });
    },
});

bleMiddleware.startListening({
    actionCreator: startListening,
    effect: (_, listenerApi) => {
        bluetoothLeManager.startStreamingData(({payload}) => {
            if (typeof payload == 'string') {
                listenerApi.dispatch(setRetrievedData(payload));
            }
        });
    },
});