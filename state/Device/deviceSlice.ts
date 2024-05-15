import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Dimensions } from "react-native";

interface DeviceState {
    orientation: string,
}

const initialState: DeviceState = {
    orientation: 'portrait',
}

const deviceSlice = createSlice({
    name: "device",
    initialState,
    reducers: {
        setOrientation: (state, action: PayloadAction<string>) => {
            state.orientation = action.payload;
        }
    },
});

export const { setOrientation } = deviceSlice.actions;

export default deviceSlice.reducer;