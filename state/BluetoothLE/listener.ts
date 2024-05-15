import { createAsyncThunk, createListenerMiddleware } from '@reduxjs/toolkit';
import {
    setConnectedDevice,
    setDevice,
    startScanning,
    setRetrievedData,
    startListening,
    startCheckingState,
    setBluetoothState,
} from './bleSlice';
import { setCurrentState } from '../Matrix/matrixSlice';
import AlertService from '../../services/AlertService';

import bluetoothLeManager, { DeviceReference } from './BluetoothLeManager';
import { blue } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

export const bleMiddleware = createListenerMiddleware();

export const connectToDevice = createAsyncThunk(
    "bleThunk/connectToDevice",
    async (ref: DeviceReference, thunkApi) => {
        if (ref.id) {
            await bluetoothLeManager.connectToPeripheral(ref.id);
            thunkApi.dispatch(setConnectedDevice(ref));
            bluetoothLeManager.stopScanningForPeripherals();
            thunkApi.dispatch(setCurrentState(true));
            const subscription = bluetoothLeManager.device.onDisconnected(
                (error, device) => {
                    if (!error) {
                        thunkApi.dispatch(setConnectedDevice(null));
                    } else {
                        console.error('Device disconnected...', error);
                    }
                    AlertService().showDisconnectAlert(device.name ? device.name : 'Device');
                    subscription.remove();
                });
        }
    }
);

export const disconnectFromDevice = createAsyncThunk(
    "bleThunk/disconnectFromDevice",
    async (ref: DeviceReference, thunkApi) => {
        if(ref.id) {
            await bluetoothLeManager.disconnectFromPeripheral(ref.id);
            thunkApi.dispatch(setConnectedDevice(null));
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

export const sendAnimationToDevice = createAsyncThunk(
    'bleThunk/sendAnimationToDevice',
    async (animation: string[][][], _) => {
        await bluetoothLeManager.sendAnimation(animation);
    }
);

export const sendDesignToDevice = createAsyncThunk(
    'bleThunk/sendDesignToDevice',
    async (design: string, _) => {
        await bluetoothLeManager.sendDesign(design);
    }
);

export const sendDataToDevice = createAsyncThunk(
    'bleThunk/sendDataToDevice',
    async (data: string, _) => {
        await bluetoothLeManager.sendData(data);
    }
);

export const sendTextToDevice = createAsyncThunk(
    'bleThunk/sendTextToDevice',
    async (text: string, _) => {
        await bluetoothLeManager.sendText(text);
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