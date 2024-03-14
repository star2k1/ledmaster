import React from 'react';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

const TabsLayout = () => {
	const { t } = useTranslation();
	return <Tabs>
		<Tabs.Screen name="presets" options={{
			headerShown: false,
			title: t('designs'),
            
		}}/>
		<Tabs.Screen name="createdesign" options={{
			headerShown:false,
			title: t('create-design')
		}} />
		<Tabs.Screen name="mydesigns" options={{
			headerShown:false,
			title: t('my-designs')
		}} />
	</Tabs>;
};

export default TabsLayout;