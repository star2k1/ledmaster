import { Dimensions } from 'react-native';
import React, { useRef, useCallback, useState, useMemo } from 'react';
import { Canvas } from '@shopify/react-native-skia';
import { RoundedItem } from './RoundedItem';
import { useAppSelector } from '../state/store';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';

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
	const [tempPixelColors, setTempPixelColors] = useState({});

	const drawPixel = useCallback((x, y) => {
		const i = Math.floor(x / CONTAINER_SIZE);
		const j = Math.floor(y / CONTAINER_SIZE);
		const pixelKey = `${i},${j}`;
		if (i >= 0 && i < N_PIXEL_HORIZONTAL && j >= 0 && j < N_PIXEL_VERTICAL) {
			setTempPixelColors(prevTempPixelColors => ({
				...prevTempPixelColors,
				[pixelKey]: brushColorRef.current,
			}));
		}
	}, [N_PIXEL_HORIZONTAL, N_PIXEL_VERTICAL, CONTAINER_SIZE]);

	const applyChanges = useCallback(() => {
		const updatedPixelColors = {
			...pixelColors, // Include existing pixel colors
			...tempPixelColors, // Include updated pixels
		};
		for (let i = 0; i < N_PIXEL_HORIZONTAL; i++) {
			for (let j = 0; j < N_PIXEL_VERTICAL; j++) {
				const pixelKey = `${i},${j}`;
				if (!(pixelKey in updatedPixelColors)) {
					updatedPixelColors[pixelKey] = '#000000'; // Set to initial color if not present
				}
			}
		}

		onPixelColorsChange(updatedPixelColors); 
	}, [tempPixelColors, onPixelColorsChange]);

	const gesture = useMemo(() =>
		Gesture.Simultaneous(
			Gesture.Pan()
				.minDistance(1)
				.runOnJS(true)
				.onUpdate((e) => {
					drawPixel(e.x, e.y);
				})
				.onEnd(() => {
					applyChanges();
				}),
			Gesture.Tap()
				.runOnJS(true)
				.onEnd((e) => {
					drawPixel(e.x, e.y);
					applyChanges();
				})
		), [drawPixel, applyChanges]);

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
