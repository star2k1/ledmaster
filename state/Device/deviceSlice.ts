import { createSlice } from "@reduxjs/toolkit";
import { Dimensions } from "react-native";

interface DeviceState {
    orientation: string,
    screenWidth: number,
    screenHeight: number
}

const initialState: DeviceState = {
    orientation: 'PORTRAIT_UP',
    screenWidth: Dimensions.get('window').width,
    screenHeight: Dimensions.get('window').height
}

const deviceSlice = createSlice({
    name: "device",
    initialState,
    reducers: {
    },
});

export default deviceSlice.reducer;