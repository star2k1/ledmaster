import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import MatrixGrid from '../../../components/CurrentMatrix';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import DesignList from '../../../components/DesignList';
import { useAppSelector } from '../../../state/store';
import FAB from 'react-native-animated-fab';
import { router } from 'expo-router';
import ScreenTemplate from '../../../components/ScreenTemplate';

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
	text: {
		color: 'white',
		marginTop: 225,
		fontSize: 25,
		fontFamily: 'Inter-Bold',
	}
});

const MyAnimationScreen = () => {
	const bottomTabBarHeight = useBottomTabBarHeight();
	const myDesigns = useAppSelector((state) => state.matrix.myDesigns);
	return(
		<ScreenTemplate>
			<SafeAreaView style={[ styles.container, { paddingBottom: bottomTabBarHeight }, ]}>
				<View style={styles.headerContainer}>
					<MatrixGrid/>
				</View>
				<DesignList data={myDesigns}/>
				<FAB
					renderSize={60}
					borderRadius={30}
					draggable={false}
					bottomOffset={120}
					rightOffset={30}
					idleOpacity={0.4}
					onPress={() => router.navigate('newanimation')}
				/>
			</SafeAreaView>
		</ScreenTemplate>
	);
};

export default MyAnimationScreen;