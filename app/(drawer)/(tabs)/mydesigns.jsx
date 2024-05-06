import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import MatrixGrid from '../../../components/CurrentMatrix';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import DesignList from '../../../components/DesignList';
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
	headerContainer: {
		maxHeight: 'auto',
		marginTop: 15
	},
	fab: {
		position: 'absolute',
		right: 25
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
	const handleFabPress = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		router.navigate('newdesign');
	};
	return(
		<ScreenTemplate>
			<View style={[ styles.container, { paddingBottom: bottomTabBarHeight }, ]}>
				<View style={styles.headerContainer}>
					<MatrixGrid/>
				</View>
				<DesignList data={myDesigns}/>
				<FAB
					icon={() => <Ionicons name='add' color='white' size={25}/>}
					color='rgba(0,0,0,0.5)'
					size='large'
					onPress={handleFabPress}
					style={[styles.fab, { bottom: bottomTabBarHeight + 25 }]}
				/>
			</View>
		</ScreenTemplate>
	);
};

export default MyDesignScreen;