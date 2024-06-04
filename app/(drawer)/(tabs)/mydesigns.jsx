import React, { useState, useCallback } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import MatrixGrid from '../../../components/CurrentMatrix';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import DesignList from '../../../components/DesignList';
import { useAppSelector } from '../../../state/store';
import { FAB } from '@rneui/themed';
import ScreenTemplate from '../../../components/ScreenTemplate';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useFocusEffect, useNavigation, router, useGlobalSearchParams } from 'expo-router';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	headerContainer: {
		maxHeight: 'auto',
		marginTop: 15
	},
	fab: {
		position: 'absolute',
		right: 25,
		elevation: 10,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.34,
		shadowRadius: 6.27,
	},
	text: {
		color: 'white',
		marginTop: 225,
		fontSize: 25,
		fontFamily: 'Inter-Bold',
	}
});

const MyDesignScreen = () => {
	const bottomTabBarHeight = useBottomTabBarHeight();
	const myDesigns = useAppSelector((state) => state.matrix.myDesigns);
	const [isVisible, setIsVisible] = useState(true);


	const handleFabPress = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		setIsVisible(false);
		router.navigate('newdesign');
	};

	useFocusEffect(
		useCallback(() => {
			setIsVisible(true);
		}, [])
	);
	
	return(
		<ScreenTemplate>
			{isVisible && <View style={[ styles.container, { paddingBottom: bottomTabBarHeight }, ]}>
				<View style={styles.headerContainer}>
					<MatrixGrid/>
				</View>
				<DesignList data={myDesigns}/>
				<FAB
					icon={() => <Ionicons name='add' color='black' size={25}/>}
					color='rgb(255,255,255)'
					size='large'
					onPress={handleFabPress}
					style={[styles.fab, { bottom: bottomTabBarHeight + 25 }]}
				/>
			</View>}
		</ScreenTemplate>
	);
};

export default MyDesignScreen;