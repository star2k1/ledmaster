import { PayloadAction, createSlice } from "@reduxjs/toolkit"

const MAX_BRIGHTNESS = 30;

interface MatrixState {
    isOn: boolean,
    myDesigns: string[][][],
    presets: string[][][],
    currentMatrix: string[][],
    noOfFrames: number,
    color: string,
    brightness: number
}

const initialState: MatrixState = {
    isOn: true,
    myDesigns: [],
    presets: [],
    currentMatrix: [],
    noOfFrames: 1,
    color: '#FFFFFF',
    brightness: MAX_BRIGHTNESS / 2
};

const matrixSlice = createSlice({
    name: "matrix",
    initialState,
    reducers: {
        addToMyDesigns: (state, action: PayloadAction<string[][]>) => {
            state.myDesigns.push(action.payload);
        },
        setCurrentDesign: (state, action: PayloadAction<string[][]>) => {
            state.currentMatrix = action.payload;
        },
        setCurrentFrames: (state, action: PayloadAction<number>) => {
            state.noOfFrames = action.payload;
        },
        setCurrentColor: (state, action: PayloadAction<string>) => {
            state.color = action.payload;
        },
        setCurrentState: (state, action: PayloadAction<boolean>) => {
            state.isOn = action.payload;
        },
        setCurrentBrightness: (state, action: PayloadAction<number>) => {
            state.brightness = action.payload;
        }
    },
});

export const { 
    addToMyDesigns,
    setCurrentDesign,
    setCurrentFrames,
    setCurrentColor,
    setCurrentState,
    setCurrentBrightness
} = matrixSlice.actions;

export default matrixSlice.reducer;