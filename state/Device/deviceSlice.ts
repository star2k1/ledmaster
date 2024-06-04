import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Dimensions } from "react-native";

interface DeviceState {
    orientation: string,
    portraitWidth: number,
    portraitHeight: number
}

const initializeDimensions = () => {
    const { width, height } = Dimensions.get('window');
    let portraitWidth:number, portraitHeight:number;

    if (width < height) {
        portraitWidth = width;
        portraitHeight = height;
    } else {
        portraitWidth = height;
        portraitHeight = width;
    }

    return {
        orientation: 'portrait',
        portraitWidth,
        portraitHeight
    };
};

const initialState: DeviceState = initializeDimensions();

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