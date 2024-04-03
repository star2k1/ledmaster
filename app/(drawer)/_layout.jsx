import React, { useState } from 'react';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { router, useNavigation, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import LanguageDialog from '../../components/LanguageModal';
import * as Haptics from 'expo-haptics';

const CustomDrawerContent = (props) => {
	const navigation = useNavigation();
	const pathname = usePathname();
	const { t } = useTranslation();
	const [isDialogVisible, setIsDialogVisible] = useState(false);
	const toggleDialog = () => {
		setIsDialogVisible(!isDialogVisible);
	};
	const onLanguageButtonTapped = () => {
		toggleDialog(); 
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	};
	return(
		<DrawerContentScrollView {...props}>
			<DrawerItem 
				style={{ }}
				label= {t('devices')}
				labelStyle={pathname == '/connections' ? {...styles.boldItemLabel} :  {...styles.navItemLabel }}
				onPress={() => { pathname == '/connections' ? navigation.dispatch(DrawerActions.toggleDrawer()) : 
					router.push('/(settings)/connections');
				console.log(pathname);
				}}
				icon={({ color, size }) => (
					<Ionicons
						name={ pathname == '/connections' ? 'hardware-chip' : 'hardware-chip-outline'}
						size={size}
						color={ pathname == '/connections' ? 'white' : color} />
				)}
                
			/>
			<DrawerItem 
				style={{ }}
				label={t('language')}
				labelStyle={isDialogVisible ? [ {...styles.boldItemLabel}] : {...styles.navItemLabel} }
				onPress={onLanguageButtonTapped}
				icon={({ color, size }) => (
					<Ionicons 
						name={isDialogVisible ? 'language' : 'language-outline'}
						size={size}
						color={isDialogVisible ? 'white' : color }
					/>
				)}
                
			/>
			<DrawerItem 
				style={{ }}
				label={t('about')}
				labelStyle={styles.navItemLabel}
				onPress={() => {
					router.navigate('/');
				}}
				icon={({ color, size }) => (
					<Ionicons name='information-circle-outline' size={size} color={color} />
				)}
                
			/>
			<LanguageDialog
				visible={isDialogVisible}
				onClose={toggleDialog}
			/>
		</DrawerContentScrollView>
	);
	
};

export default function Layout() {
	const navigation = useNavigation();
	return (
		<Drawer
			screenOptions={{ 
				drawerPosition: 'right', 
				headerLeft: false,
				headerRight: () => (
					<TouchableOpacity 
						style={{paddingRight: 15}}
						onPress={()=> navigation.dispatch(DrawerActions.toggleDrawer())}>
						<View>
							<Ionicons
								style={{ justifyContent: 'center' }} 
								name="menu"
								size={32}
								color="rgba(255,255,255,0.7)"
							/>
						</View>
					</TouchableOpacity>
				),
			}
			} 
			drawerContent={(props) => <CustomDrawerContent {...props} />}
            
		>
			<Drawer.Screen 
				name = '(settings)/connections'
				options = {{ headerTransparent: true, headerTitle: '' }}>
				
			</Drawer.Screen>
			<Drawer.Screen 
				name= '(tabs)'
				options={{ headerShown: false }}
			/>
			
		</Drawer>
	);
}

const styles = StyleSheet.create({
	navItemLabel: {
		textAlign: 'left',
		fontFamily: 'Inter-Regular',
		fontSize: 18,
		marginLeft: -20
	},
	boldItemLabel: {
		textAlign: 'left',
		fontFamily: 'Inter-Bold',
		fontSize: 18,
		marginLeft: -20,
		color: 'white',
	},
});