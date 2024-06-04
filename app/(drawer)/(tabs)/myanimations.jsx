import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MatrixGrid from '../../../components/CurrentMatrix';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import AnimationList from '../../../components/AnimationList';
import { useAppDispatch, useAppSelector } from '../../../state/store';
import { FAB } from '@rneui/themed';
import { router } from 'expo-router';
import ScreenTemplate from '../../../components/ScreenTemplate';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useFocusEffect } from 'expo-router';
import { resetState } from '../../../state/Matrix/matrixSlice';

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
	const [isVisible, setIsVisible] = useState(true);
	const dispatch = useAppDispatch();
	useFocusEffect(
		useCallback(() => {
			setIsVisible(true);
		}, [])
	);

	const handleFabPress = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		setIsVisible(false);
		//dispatch(resetState());
		router.navigate('newanimation');
	};
	return(
		<ScreenTemplate>
			{isVisible && <View style={[ styles.container ]}>
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
			</View>}
		</ScreenTemplate>
	);
};

export default MyAnimationScreen;