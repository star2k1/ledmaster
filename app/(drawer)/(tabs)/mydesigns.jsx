import React from 'react';
import { SafeAreaView, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MatrixGrid from '../../../components/CurrentMatrix';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	headerContainer: {
		height: 56,
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
	const rows = 16;
	const columns = 64;
	return(
		<LinearGradient
			style={{...StyleSheet.absoluteFill}}
			colors={['midnightblue','#4159d1', 'midnightblue']}
			start={{ x: 0, y: 0 }}
			end={{ x: 0, y: 1 }}
		>

		
			<SafeAreaView style={[ styles.container, { paddingBottom: bottomTabBarHeight }, ]}>
				<View style={styles.headerContainer}>
				</View>
				<MatrixGrid
					rows={rows}
					columns={columns}
				/>
				<Text style={styles.text}>Siin on minu disainid</Text>
			</SafeAreaView>
		</LinearGradient>
	);
};

export default MyDesignScreen;