import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import React from 'react';
import { Stack } from 'expo-router';

export default function _layout() {
	return (
		<ThemeProvider value={DarkTheme}>
			<Stack>
				<Stack.Screen name="index" options={{
					headerShown: false
				}}/>
				<Stack.Screen name="(tabs)" options={{
					headerShown: false,
					gestureEnabled: false
					
				}} />
				<Stack.Screen name="(settings)/connections" options={{
					headerTransparent: true
				}} />
			</Stack>
		</ThemeProvider>
	);
}