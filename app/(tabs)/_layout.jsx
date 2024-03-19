import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import DesignScreen from './createdesign';
import MyDesignScreen from './mydesigns';
import PresetScreen from './presets';

const Tabs = createBottomTabNavigator();

const TabsLayout = () => {
	const { t } = useTranslation();
	return <Tabs.Navigator>
		<Tabs.Screen 
			name="presets"
			component={PresetScreen}
			options={{
				headerShown: false,
				title: t('designs'),
            
			}}/>
		<Tabs.Screen 
			name="createdesign"
			component={DesignScreen}
			orientation= 'landscape'
			options={{
				headerShown:false,
				title: t('create-design')
			}} />
		<Tabs.Screen 
			name="mydesigns"
			component={MyDesignScreen}
			options={{
				headerShown:false,
				title: t('my-designs')
			}} />
	</Tabs.Navigator>;
};

export default TabsLayout;