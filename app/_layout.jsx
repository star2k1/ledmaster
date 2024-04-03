import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import React from 'react';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../state/store';

export default function _layout() {
	return (
		<Provider store={ store }>
			<ThemeProvider value={DarkTheme}>
				<Stack>
					<Stack.Screen name="index" options={{
						title: 'Home',
						headerShown: false,
						animation: 'fade'
					}}/>
					<Stack.Screen name="(drawer)" options={{
						headerShown: false,
						gestureEnabled: false
					}} />
				</Stack>
			</ThemeProvider>
		</Provider>
	);
}