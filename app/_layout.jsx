import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import React from 'react';
import { Button } from 'react-native';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { persistor, store } from '../state/store';
import { useTranslation } from 'react-i18next';
import { PersistGate } from 'redux-persist/integration/react';

export default function _layout() {
	const { t } = useTranslation();
	return (
		<Provider store={ store }>
			<PersistGate loading={null} persistor={persistor}>
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
						<Stack.Screen name="newdesign" options={{
							headerBackTitle: t('back'),
							headerTitle: t('create-design'),
							gestureEnabled: false,
							headerRight: () => (
								<Button
									title= {t('save')}
									color='#007AFF'
								/>
							),
						}} />
						<Stack.Screen name="newanimation" options={{
							headerBackTitle: t('back'),
							headerTitle: t('create-design'),
							gestureEnabled: false,
							headerRight: () => (
								<Button
									title= {t('save')}
									color='#007AFF'
								/>
							),
						}} />
					</Stack>
				</ThemeProvider>
			</PersistGate>
		</Provider>
	);
}