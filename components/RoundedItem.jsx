import React from 'react';
import { RoundedRect } from '@shopify/react-native-skia';

const RoundedItem = React.memo(
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
RoundedItem.displayName = 'RoundedItem';

export { RoundedItem };
