import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import
{
	FlatList,
	Modal,
	SafeAreaView,
	Text,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const DeviceModalListItem = (props) => {
	const { item, connectToPeripheral, closeModal } = props;
	const [isLoading, setIsLoading] = useState(false);
	const connectAndCloseModal = useCallback(async () => {
		setIsLoading(true);
		try {
			await connectToPeripheral(item.item);
			router.push('/(tabs)/presets');
		} catch (error) {
			console.error('Error connecting to peripheral:', error);
		} finally {
			closeModal();
			setIsLoading(false); // Reset loading state
		}
	}, [closeModal, connectToPeripheral, item.item]);

	return (
		<TouchableOpacity
			onPress={ () => { connectAndCloseModal(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
		>
			<LinearGradient
				style={ modalStyle.ctaButton }
				colors={['#0052D4','#4364F7', '#6FB1FC']}
				start={{ x: 0, y: 0 }}
				end={{ x:1.4, y: 0 }}
			>
				{isLoading ? ( <ActivityIndicator color='white' /> ) 
					: (<Text style={modalStyle.ctaButtonText}>{item.item.name}</Text>)}
				
			</LinearGradient>
		</TouchableOpacity>
	);
};

const DeviceModal = (props) => {
	const { devices, visible, connectToPeripheral, closeModal } = props;
	const { t } = useTranslation();
	const renderDeviceModalListItem = useCallback(
		(item) => {
			return (
				<DeviceModalListItem
					item={item}
					connectToPeripheral={connectToPeripheral}
					closeModal={closeModal}
				/>
			);
		},
		[closeModal, connectToPeripheral]
	);

	return (
		<Modal
			style={modalStyle.modalContainer}
			animationType="slide"
			transparent={false}
			visible={visible}
		>
			<LinearGradient
				style={modalStyle.modalContainer}
				colors={['darkblue', 'darkblue', 'black']}
				start={{ x: 0, y: 0 }}
				end={{ x: 0, y: 1 }}
			>
				<SafeAreaView style={modalStyle.modalTitle}>
					<Text style={modalStyle.modalTitleText}>
						{t('choose-device')}
					</Text>
					<FlatList
						contentContainerStyle={modalStyle.modalFlatlistContiner}
						data={devices}
						renderItem={renderDeviceModalListItem}
					/>
				</SafeAreaView>
			</LinearGradient>
		</Modal>
	);
};

const modalStyle = StyleSheet.create({
	modalContainer: {
		flex: 1,
	},
	modalFlatlistContiner: {
		flex: 1,
		marginTop: 60,
	},
	modalCellOutline: {
		borderWidth: 1,
		borderColor: 'black',
		alignItems: 'center',
		marginHorizontal: 20,
		paddingVertical: 15,
		borderRadius: 8,
	},
	modalTitle: {
		flex: 1,
	},
	modalTitleText: {
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

export default DeviceModal;