import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { produce } from "immer";

const MAX_BRIGHTNESS = 30;
const MATRIX_ROWS = 8;
const MATRIX_COLUMNS = 32;

interface MatrixState {
    isOn: boolean,
    myDesigns: string[][][],
    myAnimations: string[][][][],
    presets: string[][][],
    currentMatrix: string[][],
    currentAnimation: string[][][],
    noOfFrames: number,
    color: string,
    brightness: number,
    pixelColors: { [key: string]: string },
    animationFrames: { [key: number]: string[][] }
}

const initialState: MatrixState = {
    isOn: true,
    myDesigns: [],
    myAnimations: [],
    presets: [],
    currentMatrix: [],
    currentAnimation: [],
    noOfFrames: 1,
    color: '#FFFFFF',
    brightness: MAX_BRIGHTNESS / 2,
    pixelColors: initializePixelColors(),
    animationFrames: {}
};

function initializePixelColors(): { [key: string]: string } {
    const pixelColors: { [key: string]: string } = {};
    for (let i = 0; i < MATRIX_COLUMNS; i++) {
        for (let j = 0; j < MATRIX_ROWS; j++) {
            pixelColors[`${i},${j}`] = '#000000';
        }
    }
    return pixelColors;
}

function deepCopy(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    const newObj = Array.isArray(obj) ? [] : {};

    for (let key in obj) {
        newObj[key] = deepCopy(obj[key]);
    }

    return newObj;
}

const matrixSlice = createSlice({
    name: "matrix",
    initialState,
    reducers: {
        addToMyDesigns: (state, action: PayloadAction<string[][]>) => {
            state.myDesigns.push(action.payload);
        },
        addToPresets: (state, action: PayloadAction<string[][]>) => {
            state.presets.push(action.payload);
        },
        addToMyAnimations: (state, action: PayloadAction<string[][][]>) => {
            state.myAnimations.push(action.payload);
        },
        removeFromMyDesigns: (state, action: PayloadAction<string[][]>) => {
            state.myDesigns = state.myDesigns.filter(
                design => !(JSON.stringify(design) === JSON.stringify(action.payload)));
        },
        setCurrentDesign: (state, action: PayloadAction<string[][]>) => {
            state.currentMatrix = action.payload;
        },
        setCurrentAnimation: (state, action: PayloadAction<string[][][]>) => {
            state.currentAnimation = action.payload;
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
        },
        setPixelColors: (state, action) => {
           state.pixelColors = action.payload.pixelColors;
        },
        setAnimationFrames: (state, action) => {
            state.animationFrames = deepCopy(action.payload.animationFrames);
        },
        resetAnimationFrames: (state) => {
            state.animationFrames = initialState.animationFrames;
        },
        resetPixelColors: (state) => {
            state.pixelColors = initialState.pixelColors;
        },
        resetState: () => initialState
    },
});

export const { 
    addToMyDesigns,
    addToMyAnimations,
    addToPresets,
    removeFromMyDesigns,
    setCurrentDesign,
    setCurrentAnimation,
    setCurrentFrames,
    setCurrentColor,
    setCurrentState,
    setCurrentBrightness,
    setPixelColors,
    setAnimationFrames,
    resetAnimationFrames,
    resetPixelColors,
    resetState
} = matrixSlice.actions;

export default matrixSlice.reducer;