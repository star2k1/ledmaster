import React, { useState, useEffect } from 'react';
import { View} from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { hexArrayToBitmap } from '../services/hexToBitmap';

const AnimationPreview = ({ animationData, itemWidth, frameDelay }) => {

	const height = 8;
	const width = 32;
	const pixelSize = Math.floor((itemWidth) / (width));
    
	const [frameIdx, setFrameIdx] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setFrameIdx((prevIdx) => (prevIdx + 1) % animationData.length);
		}, frameDelay);

		return () => clearInterval(interval);
	}, [animationData.length, frameDelay]);

	const currentFrame = hexArrayToBitmap(animationData[frameIdx]);

	return (
		<View>
			<Svg width={width * pixelSize} height={height * pixelSize}>
				{currentFrame.map((colorValue, index) => {
					const x = Math.floor(index / height);
					const y = index % height;
					const red = (colorValue >> 11) & 0x1F;
					const green = (colorValue >> 5) & 0x3F;
					const blue = colorValue & 0x1F;
					const rgbColor = `rgb(${red * 8},${green * 4},${blue * 8})`;
					return (
						<Rect
							key={index}
							x={x * pixelSize}
							y={y * pixelSize}
							width={pixelSize}
							height={pixelSize}
							fill={rgbColor}
						/>
					);
				})}
			</Svg>
		</View>
	);
};

export default AnimationPreview;
