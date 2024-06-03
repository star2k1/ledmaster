import React, { useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import MatrixGrid from '../../../components/CurrentMatrix';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import AnimationList from '../../../components/AnimationList';
import { useAppSelector } from '../../../state/store';
import { FAB } from '@rneui/themed';
import { router } from 'expo-router';
import ScreenTemplate from '../../../components/ScreenTemplate';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
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
	headerContainer: {
		maxHeight: 'auto',
		marginTop: 15
	},
	text: {
		color: 'white',
		marginTop: 225,
		fontSize: 25,
		fontFamily: 'Inter-Bold',
	}
});

const MyAnimationScreen = () => {
	const bottomTabBarHeight = useBottomTabBarHeight();
	const myAnimations = useAppSelector((state) => state.matrix.myAnimations);

	const handleFabPress = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		router.navigate('newanimation');
	};
	return(
		<ScreenTemplate>
			<View style={[ styles.container ]}>
				<View style={styles.headerContainer}>
					<MatrixGrid/>
				</View>
				<AnimationList data={myAnimations}/>
				<FAB
					icon={() => <Ionicons name='add' color='black' size={25}/>}
					color='rgb(255,255,255)'
					size='large'
					onPress={handleFabPress}
					style={[styles.fab, { bottom: bottomTabBarHeight + 25 }]}
				/>
			</View>
		</ScreenTemplate>
	);
};

export default MyAnimationScreen;