export function hexArrayToBitmap(hexArray) {
	const bitmapArray = [];

	for (let i = 0; i < hexArray.length; i++) {
		const row = hexArray[i];
		for (let j = 0; j < row.length; j++) {
			const hexColor = row[j];
			// Extracting red, green, and blue components
			const red = parseInt(hexColor.slice(1, 3), 16);
			const green = parseInt(hexColor.slice(3, 5), 16);
			const blue = parseInt(hexColor.slice(5, 7), 16);

			// Convert 24-bit RGB values to 16-bit RGB values
			const red5 = (red >> 3) & 0x1F; // 5 bits
			const green6 = (green >> 2) & 0x3F; // 6 bits
			const blue5 = (blue >> 3) & 0x1F; // 5 bits

			// Combine red, green, and blue components into a single 16-bit value
			const colorValue = (red5 << 11) | (green6 << 5) | blue5;

			bitmapArray.push(colorValue);
		}
	}
	return bitmapArray;
}

export function hexArrayToString(pixelColors) {
	const numRows = pixelColors.length;
	const numCols = pixelColors[0].length;
	let result = '';

	for (let col = 0; col < numCols; col++) {
		for (let row = 0; row < numRows; row++) {
			const color = pixelColors[row][col];
			const hex = color.substring(1);
			const r = parseInt(hex.substring(0, 2), 16);
			const g = parseInt(hex.substring(2, 4), 16);
			const b = parseInt(hex.substring(4, 6), 16);
			result +=
                r.toString(16).padStart(2, '0').charAt(0) +
                g.toString(16).padStart(2, '0').charAt(0) +
                b.toString(16).padStart(2, '0').charAt(0);
		}
	}
	return result;
}



