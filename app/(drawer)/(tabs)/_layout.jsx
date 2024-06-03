import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DrawerActions } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import TextScreen from './text';
import MyDesignScreen from './mydesigns';
import PresetScreen from './presets';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MyAnimationScreen from './myanimations';
import AnimationScreen from './animations';

const TopTabs = createMaterialTopTabNavigator();

const MyTopTabsLayout = () => {
	const { t } = useTranslation();
	return (
		<TopTabs.Navigator
			initialRouteName='myanimations'
			screenOptions={{
				tabBarLabelStyle: {
					fontFamily: 'Inter-Regular'
				},
				tabBarStyle: {
					height: 45,
					backgroundColor: 'transparent',
				},
				tabBarIndicatorStyle: {
					backgroundColor: 'dodgerblue'
				}
			}}
		>
			<TopTabs.Screen
				name= 'animations'
				component={MyAnimationScreen}
				options = {{ 
					headerStyle: { backgroundColor: 'transparent' },
					tabBarLabel: t('animations'),
					unmountOnBlur: true
				}}
			/>
			<TopTabs.Screen
				name= 'designs' 
				component={MyDesignScreen}
				options = {{ tabBarLabel: t('visuals'), unmountOnBlur: true}}
			/>
		</TopTabs.Navigator>
	);
};

const TopTabsLayout = () => {
	const { t } = useTranslation();
	return (
		<TopTabs.Navigator
			initialRouteName='animations'
			screenOptions={{
				tabBarLabelStyle: {
					fontFamily: 'Inter-Regular'
				},
				tabBarStyle: {
					backgroundColor: 'transparent',
					height: 45,
					position: 'relative',
					top: 0
				},
				tabBarIndicatorStyle: {
					backgroundColor: 'dodgerblue'
				},
			}}
		>
			<TopTabs.Screen
				name= 'animations'
				component={AnimationScreen}
				options = {{ tabBarLabel: t('animations'), unmountOnBlur: true}}
			/>
			<TopTabs.Screen
				name= 'designs' 
				component={PresetScreen}
				options = {{ tabBarLabel: t('visuals'), unmountOnBlur: true}}
			/>
		</TopTabs.Navigator>
	);
};

const Tabs = createBottomTabNavigator();

const TabsLayout = () => {
	const { t } = useTranslation();
	const navigation = useNavigation();

	return (
		<Tabs.Navigator 
			screenOptions={{
				freezeOnBlur: true,
				tabBarHideOnKeyboard: true,
				tabBarStyle: {
					position: 'absolute',
					borderTopLeftRadius: 20,
					borderTopRightRadius: 20,
					height: 90,
					backgroundColor: 'rgba(12,13,21,0.6)',
					borderTopColor: 'transparent',
					borderTopWidth: 0,
					overflow: 'hidden'
				},
				tabBarShowLabel: false,
				tabBarBackground: () => (
					<View style={{
						borderTopLeftRadius: 20,
						borderTopRightRadius: 20,
						overflow: 'hidden',
						elevation: 0,
					}}>
						<BlurView
							intensity={15}
							style={[ StyleSheet.absoluteFill] }
						/>
					</View>
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
				headerStyle : {
					backgroundColor: 'transparent',
					height: 90,
					shadowOpacity: 0				},
				headerTitleStyle: {fontFamily:'Inter-Regular'},
			}}
		>		
			<Tabs.Screen 
				name="presets"
				component={TopTabsLayout}
				options={{
					title: t('designs'),
					tabBarIcon: ({focused, color}) => (
						<Ionicons name={ focused ? 'albums' : 'albums-outline'} size={32} color={color} />
					),
					tabBarActiveTintColor: 'dodgerblue',
					unmountOnBlur: true
				}}/>
			<Tabs.Screen 
				name="text"
				component={TextScreen}
				options={{
					title: t('text'),
					tabBarIcon: ({ focused, color }) => (
						<Ionicons name={ focused ? 'text' : 'text-outline'} size={30} color={color} />
					),
					tabBarActiveTintColor: 'dodgerblue',
					unmountOnBlur: true
				}} />
			<Tabs.Screen 
				name="mydesigns"
				component={MyTopTabsLayout}
				options={{
					title: t('my-designs.title'),
					tabBarIcon: ({focused, color}) => (
						<Ionicons name={ focused ? 'flame' : 'flame-outline'} size={32} color={color}/>
					),
					tabBarActiveTintColor: 'dodgerblue',
					unmountOnBlur: true
				}} />
		</Tabs.Navigator>
	);
};

export default TabsLayout;