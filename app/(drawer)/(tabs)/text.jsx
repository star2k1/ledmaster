import React, { useState } from 'react';
import { View, Modal, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAppDispatch, useAppSelector } from '../../../state/store';
import { sendTextToDevice } from '../../../state/BluetoothLE/listener';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import ColorPalette from '../../../components/ColorPalette';
import ScreenTemplate from '../../../components/ScreenTemplate';
import ColorPickerModal from '../../../components/ColorPickerModal';

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
		fontFamily: 'Inter-Bold',
		fontSize: 25,
	},
	headerContainer: {
		height: 56,
	},
	gridContainer: {
		flex: 1
	}
});

const TextScreen = () => {
	const { t } = useTranslation();
	const bottomTabBarHeight = useBottomTabBarHeight();
	const screenWidth = useAppSelector(state => (state.device.screenWidth));
	const [text, setText] = useState('');
	const [showModal, setShowModal] = useState(false);
	const textColor = useAppSelector(state => (state.matrix.color));
	const dispatch = useAppDispatch();
	const onChangeText = (inputText) => {
		setText(inputText);
	};
	const handleButtonPress = () => {
		const textToSend = textColor.substring(1) + text;
		dispatch(sendTextToDevice(textToSend));
		console.log('Input value:', textToSend);
	};
	const onSelectColor = ({ hex }) => {
		console.log(hex);
	};
	const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
	const toggleColorPicker = () => {
		setIsColorPickerVisible(!isColorPickerVisible);
	};
	
	return(
		<ScreenTemplate>
			<View style={[ styles.container, { paddingBottom: bottomTabBarHeight }, ]}>
				<View style={styles.headerContainer}></View>
				<View style={{justifyContent:'center', marginTop: 250, flexDirection: 'column', alignItems: 'center'}}>
					<TextInput
						style={{
							backgroundColor: 'rgba(0,0,0,0.6)',
							borderRadius: 14,
							padding: 10,
							width: screenWidth - screenWidth/4,
							fontFamily: 'Inter-Regular',
							color: textColor,
							fontSize: 16,
							marginBottom: 10
						}}
						placeholder={t('sample-message')}
						onChangeText={onChangeText}
						value={text}
					/>
					<TouchableOpacity
						onPress={() => toggleColorPicker()}
					>
						<Ionicons
							name={'color-palette'}
							size={30}
							color='white'
						/>
					</TouchableOpacity>
					<ColorPalette />
					<TouchableOpacity
						style={{
							backgroundColor: 'rgba(0,0,0,0.6)',
							borderRadius: 14,
							marginTop: 15,
							paddingHorizontal: 10,
							paddingVertical: 5,
							flexDirection: 'row'
						}}
						onPress={() => handleButtonPress()}>
						<Text
							style={{
								fontSize: 16, 
								color: 'rgba(255,255,255,0.8)', 
								alignSelf:'center', 
								padding: 5,
								marginRight: 5, 
								fontFamily: 'Inter-Bold'
							}}>
							{t('send')}
						</Text>
						<Ionicons
							name='send-outline'
							size={22}
							color={'cyan'}
							style={{alignSelf: 'center'}}
						/>
					</TouchableOpacity>
				</View>
				<ColorPickerModal
					onSelectColor={onSelectColor}
					onClose={() => toggleColorPicker()}
				/>
			</View>
		</ScreenTemplate>
	);
};

export default TextScreen;