import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DrawerActions } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import TextScreen from './text';
import MyDesignScreen from './mydesigns';
import PresetScreen from './presets';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, usePathname, router } from 'expo-router';

const Tabs = createBottomTabNavigator();

const TabsLayout = () => {
	const { t } = useTranslation();
	const pathname = usePathname();
	const navigation = useNavigation();

	return (
		<Tabs.Navigator 
			screenOptions={{
				tabBarStyle: {
					position: 'absolute',
					borderTopLeftRadius: 20,
					borderTopRightRadius: 20,
					height: 90,
				},
				tabBarShowLabel: false,
				tabBarBackground: () => (
					<BlurView
						intensity={80}
						style={{
							...StyleSheet.absoluteFillObject,
							borderTopLeftRadius: 20,
							borderTopRightRadius: 20,
							overflow: 'hidden',
							backgroundColor: 'rgba(20, 23, 26, 0.8)',
						}}
					/>
				),
				tabBarActiveTintColor: 'rgba(255,255,255,0.9)',
				headerRight: () => (
					<TouchableOpacity 
						style={{paddingRight: 15}}
						onPress={()=> navigation.dispatch(DrawerActions.toggleDrawer())}>
						<View>
							<Ionicons
								style={{ justifyContent: 'center' }} 
								name="menu"
								size={34}
								color="rgba(255,255,255,0.7)"
							/>
						</View>
					</TouchableOpacity>
				),
				headerStyle : { height: 95 },
				headerTitleStyle: {fontFamily:'Inter-Regular'},
				headerTransparent: true,
			}}
		>		
			<Tabs.Screen 
				name="presets"
				component={PresetScreen}
				options={{
					title: t('designs'),
					tabBarIcon: ({color}) => (
						<Ionicons name={ pathname == '/presets' ? 'albums' : 'albums-outline'} size={32} color={color} />
					),
				}}/>
			<Tabs.Screen 
				name="text"
				component={TextScreen}
				options={{
					title: t('text'),
					tabBarIcon: ({ color }) => (
						<Ionicons name={ pathname == '/text' ? 'text' : 'text-outline'} size={30} color={color} />
					),
				}} />
			<Tabs.Screen 
				name="mydesigns"
				component={MyDesignScreen}
				options={{
					title: t('my-designs'),
					tabBarIcon: ({color}) => (
						<Ionicons name={ pathname == '/mydesigns' ? 'flame' : 'flame-outline'} size={32} color={color}/>
					),
					headerLeft: () => (
						<TouchableOpacity
							style={{paddingLeft: 15}}
							onPress={() => router.navigate('newdesign')}
						>
							<View>
								<Ionicons
									style={{ justifyContent: 'center'}}
									name= "add"
									size={36}
									color= "rgba(255,255,255,0.7)"
								/>
							</View>
						</TouchableOpacity>
					),
				}} />
		</Tabs.Navigator>
	);
};

export default TabsLayout;