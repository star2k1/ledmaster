import React from 'react';
import { View, SafeAreaView, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MatrixGrid from '../../components/CurrentMatrix';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	text: {
		color: 'white',
		marginTop: 225,
		fontSize: 25,
		fontWeight: '600'
	},
	gridContainer: {
		flex: 1
	}
});

const DesignScreen = () => {
	const rows = 16;
	const columns = 64;
	return(
		<LinearGradient
			style={ styles.container }
			colors={['darkblue', 'black', 'black']}
			start={{ x: 0, y: 0.3 }}
			end={{ x: 0.2, y: 1 }}
		>

		
			<SafeAreaView style={ styles.container }>
				<View>

                
					<MatrixGrid 
						rows={rows}
						columns={columns}
					/>
				</View>
				<Text style={styles.text}>Loo uus</Text>
			</SafeAreaView>
		</LinearGradient>
	);
};

export default DesignScreen;