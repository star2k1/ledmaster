import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DeviceReference } from './BluetoothLeManager';

interface BluetoothState {
    allDevices: DeviceReference[];
    currentData: string[];
    connectedDevice: DeviceReference | null;
    retrievedData?: string | null;
    bluetoothEnabled: boolean | null;
}

const initialState: BluetoothState = {
    allDevices: [],
    currentData: [],
    connectedDevice: null,
    retrievedData: undefined,
    bluetoothEnabled: null,
};

const isDuplicateDevice = (
    devices: DeviceReference[],
    nextDevice: DeviceReference
) => devices.findIndex((device) => nextDevice.id === device.id) > -1;

export type DevicesAction = PayloadAction<DeviceReference>;

export const startScanning = createAction('bleState/startScanning');
export const startListening = createAction('bleState/startListening');
export const startCheckingState = createAction('bleState/startCheckingState');

const bleState = createSlice({
    name: 'bleState',
    initialState,
    reducers: {
        setDevice: (state, action: DevicesAction) => {
            if (!isDuplicateDevice(state.allDevices, action.payload)) {
                state.allDevices = [...state.allDevices, action.payload];
            }
        },
        setConnectedDevice: (state, action: PayloadAction<DeviceReference>) => {
            state.connectedDevice = action.payload;
        },
        setRetrievedData: (state, action: PayloadAction<string | null | undefined>) => {
            state.retrievedData = action.payload;
        },
        setBluetoothState: (state, action: PayloadAction<boolean | null>) => {
            state.bluetoothEnabled = action.payload;
        },
    },
});

export const { setDevice, setConnectedDevice, setRetrievedData, setBluetoothState } = bleState.actions;

export default bleState.reducer;