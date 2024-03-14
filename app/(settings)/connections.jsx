import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import
{
	FlatList,
	SafeAreaView,
	Text,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import useBLE from '../../components/useBLE';

const ConnectionScreenListItem = ({ item, connectToPeripheral }) => {
	const [isLoading, setIsLoading] = useState(false);

	const connectAndCloseTab = useCallback(async () => {
		setIsLoading(true);
		try {
			await connectToPeripheral(item.item);
			router.push('/(tabs)/presets');
		} catch (error) {
			console.error('Error connecting to peripheral:', error);
		} finally {
			setIsLoading(false); // Reset loading state
		}
	}, [connectToPeripheral, item.item]);

	return (
		<TouchableOpacity
			onPress={ () => {
				connectAndCloseTab();
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			}}
		>
			<LinearGradient
				style={ styles.ctaButton }
				colors={['white','#4364F7', '#6FB1FC']}
				start={{ x: 0, y: 0 }}
				end={{ x:1.4, y: 0 }}
			>
				{isLoading ? (
					<ActivityIndicator color='white' />
				) : (
					<Text style={styles.ctaButtonText}>{item.item.name}</Text>
				)}
			</LinearGradient>
		</TouchableOpacity>
	);
};

const ConnectionScreen = () => {
	const { allDevices, connectToDevice } = useBLE();
	const { t } = useTranslation();
	const renderConnectionScreenListItem = useCallback(
		(item) => {
			return (
				<ConnectionScreenListItem
					item={item}
					connectToPeripheral={connectToDevice}
				/>
			);
		},
		[connectToDevice]
	);

	return (
		<View style={styles.container}>
			<LinearGradient
				style={styles.container}
				colors={['darkblue', 'darkblue', 'black']}
				start={{ x: 0, y: 0 }}
				end={{ x: 0, y: 1 }}
			>
				<SafeAreaView style={styles.title}>
					<Text style={styles.titleText}>
						{t('choose-device')}
					</Text>
					<FlatList
						contentContainerStyle={styles.flatlistContiner}
						data={allDevices}
						renderItem={renderConnectionScreenListItem}
					/>
				</SafeAreaView>
			</LinearGradient>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	flatlistContiner: {
		flex: 1,
		marginTop: 60,
	},
	cellOutline: {
		borderWidth: 1,
		borderColor: 'black',
		alignItems: 'center',
		marginHorizontal: 20,
		paddingVertical: 15,
		borderRadius: 8,
	},
	title: {
		flex: 1,
	},
	titleText: {
		marginTop: 40,
		fontSize: 28,
		fontWeight: 'bold',
		marginHorizontal: 20,
		textAlign: 'center',
		color: 'white',
	},
	ctaButton: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 50,
		marginHorizontal: 20,
		marginBottom: 5,
		borderRadius: 12,
	},
	ctaButtonText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: 'white',
	},
});

export default ConnectionScreen;