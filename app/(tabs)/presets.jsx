import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
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
	}
});

const PresetScreen = () => {
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
				<MatrixGrid 
					rows={rows}
					columns={columns}
				/>
				<Text style={styles.text}>Siin on eelloodud disainid</Text>
			</SafeAreaView>
		</LinearGradient>
	);
};

export default PresetScreen;