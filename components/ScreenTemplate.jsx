import React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const ScreenTemplate = ({ children}) => {
	return (
		<LinearGradient
			style={{flex: 1}}
			colors={['midnightblue','#4159d1', 'midnightblue']}
			start={{ x: 0, y: 0 }}
			end={{ x: 0, y: 1 }}
		>
			{children}
		</LinearGradient>
	);
};

export default ScreenTemplate;