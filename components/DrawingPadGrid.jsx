import { Dimensions } from 'react-native';
import React, { useRef, useCallback, useState } from 'react';
import { Canvas } from '@shopify/react-native-skia';
import { RoundedItem } from './RoundedItem';
import { useAppSelector } from '../state/store';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

const DrawingPadGrid = ({ rows, columns, pixelColors, onPixelColorsChange }) => {
	const { width: portraitWidth, height: portraitHeight } = Dimensions.get('window');
	const SCREEN_WIDTH = Math.max(portraitWidth, portraitHeight);

	const N_PIXEL_HORIZONTAL = columns;
	const N_PIXEL_VERTICAL = rows;
	const SAFE_AREA_PADDING_VERT = 120;
	const CONTAINER_SIZE = (SCREEN_WIDTH - SAFE_AREA_PADDING_VERT) / N_PIXEL_HORIZONTAL;
	const PADDING = 3;
	const SQUARE_SIZE = CONTAINER_SIZE - PADDING;

	const CANVAS_WIDTH = SCREEN_WIDTH - SAFE_AREA_PADDING_VERT;
	const CANVAS_HEIGHT = N_PIXEL_VERTICAL * CONTAINER_SIZE;

	const brushColor = useAppSelector(state => state.matrix.color);
	const brushColorRef = useRef(brushColor);
	brushColorRef.current = brushColor;
	const lastPixel = useRef(null);

	const [tempPixelColors, setTempPixelColors] = useState({});

	const drawPixel = useCallback((x, y) => {
		const i = Math.floor(x / CONTAINER_SIZE);
		const j = Math.floor(y / CONTAINER_SIZE);
		const pixelKey = `${i},${j}`;
		if (i >= 0 && i < N_PIXEL_HORIZONTAL && j >= 0 && j < N_PIXEL_VERTICAL && lastPixel.current !== pixelKey) {
			setTempPixelColors(prevTempPixelColors => ({
				...prevTempPixelColors,
				[pixelKey]: brushColorRef.current,
			}));
			lastPixel.current = pixelKey;
		}
	}, [N_PIXEL_HORIZONTAL, N_PIXEL_VERTICAL, CONTAINER_SIZE]);

	const applyChanges = useCallback(() => {
		onPixelColorsChange(tempPixelColors);
		//setTempPixelColors({}); // Reset tempPixelColors after applying changes
		lastPixel.current = null;
	}, [tempPixelColors, onPixelColorsChange]);

	const gesture = Gesture.Race(Gesture.Pan()
		.onStart((e) => {
			runOnJS(drawPixel)(e.x, e.y);
		})
		.onUpdate((e) => {
			runOnJS(drawPixel)(e.x, e.y);
		})
		.onEnd(() => {
			runOnJS(applyChanges)();
		}),
	Gesture.Tap()
		.onStart((e) => {
			runOnJS(drawPixel)(e.x, e.y);
			runOnJS(applyChanges)();
		})
	);

	return (
		<GestureHandlerRootView>
			<GestureDetector gesture={gesture}>
				<Canvas
					style={{
						width: CANVAS_WIDTH,
						height: CANVAS_HEIGHT,
					}}
				>
					{Array.from({ length: N_PIXEL_HORIZONTAL }, (_, i) => (
						Array.from({ length: N_PIXEL_VERTICAL }, (_, j) => (
							<RoundedItem
								key={`i${i}-j${j}`}
								x={i * CONTAINER_SIZE + PADDING / 2}
								y={j * CONTAINER_SIZE + PADDING / 2}
								width={SQUARE_SIZE}
								height={SQUARE_SIZE}
								color={tempPixelColors[`${i},${j}`] || pixelColors[`${i},${j}`]}
							/>
						))
					))}
				</Canvas>
			</GestureDetector>
		</GestureHandlerRootView>
	);
};

export default DrawingPadGrid;
