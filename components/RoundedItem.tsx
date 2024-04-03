import React from 'react';
import { Color, RoundedRect } from '@shopify/react-native-skia';
import { SharedValue,  } from 'react-native-reanimated';

type RoundedItemProps = {
	x: number;
	y: number;
	width: number;
	height: number;
	color: Color;
};

const RoundedItem: React.FC<RoundedItemProps> = React.memo(
	({ ...squareProps }) => {
		const { x,y, width, ...otherProps } = squareProps;
		
		return (
				<RoundedRect
					{...squareProps}
					r={3}
				/>
		);
	}
);

export { RoundedItem };
