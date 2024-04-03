import { View, StyleSheet, Dimensions } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useTouchHandler } from '@shopify/react-native-skia';
import { RoundedItem } from './RoundedItem';

export default function DrawingPadGrid({ rows, columns, brushColor }) {
	const {width: portraitWidth, height: portraitHeight} = Dimensions.get('window');

	const SCREEN_WIDTH = Math.max(portraitWidth, portraitHeight);

	const N_PIXEL_HORIZONTAL = columns;
	const N_PIXEL_VERTICAL = rows;
	const SAFE_AREA_PADDING_VERT = 120;
	const CONTAINER_SIZE = (SCREEN_WIDTH-SAFE_AREA_PADDING_VERT) / N_PIXEL_HORIZONTAL;
	const PADDING = 3;
	const SQUARE_SIZE = CONTAINER_SIZE - PADDING;

	const CANVAS_WIDTH = SCREEN_WIDTH - SAFE_AREA_PADDING_VERT;
	const CANVAS_HEIGHT = N_PIXEL_VERTICAL * CONTAINER_SIZE;

	const [pixelColors, setPixelColors] = useState(
    	new Array(N_PIXEL_HORIZONTAL).fill(0).map(() => new Array(N_PIXEL_VERTICAL).fill('rgba(0,0,0,0.8)'))
  	);
	const brushColorRef = useRef(brushColor);

	useEffect(() => {
		brushColorRef.current = brushColor;
	}, [brushColor]);
	
	const touchHandler = useTouchHandler({
		onStart: (event) => {
			drawPixel(event);
		},
		onActive: (event) => {
			drawPixel(event);
		},
		onEnd: (event) => {},
	});

	const drawPixel = (event) => {
		const i = Math.floor(event.x / CONTAINER_SIZE);
		const j = Math.floor(event.y / CONTAINER_SIZE);

		if(i >= 0 && i < N_PIXEL_HORIZONTAL && j >= 0 && j < N_PIXEL_VERTICAL) {
			const i = Math.floor(event.x / CONTAINER_SIZE);
            const j = Math.floor(event.y / CONTAINER_SIZE);
            if (i >= 0 && i < N_PIXEL_HORIZONTAL && j >= 0 && j < N_PIXEL_VERTICAL) {
     			const newPixelColors = [...pixelColors];
				newPixelColors[i][j] = brushColorRef.current;
				setPixelColors(newPixelColors);
    		}
		}
	}

	return ( 
		<Canvas
			style={{
				width: CANVAS_WIDTH,
				height: CANVAS_HEIGHT,
			}}
			onTouch={touchHandler}
		>
			{new Array(N_PIXEL_HORIZONTAL).fill(0).map((_, i) => {
				return new Array(N_PIXEL_VERTICAL).fill(0).map((_, j) => {
					return (
						<RoundedItem
							key={`i${i}-j${j}`}
							x={i * CONTAINER_SIZE + PADDING / 2}
							y={j * CONTAINER_SIZE + PADDING / 2}
							width={SQUARE_SIZE}
							height={SQUARE_SIZE}
							color={pixelColors[i][j]}
						/>
					);
				});
			})}
		</Canvas>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
	},
});