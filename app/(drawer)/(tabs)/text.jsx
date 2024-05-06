import React, { useState } from 'react';
import { View, TouchableWithoutFeedback, Keyboard, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAppDispatch, useAppSelector } from '../../../state/store';
import { sendTextToDevice } from '../../../state/BluetoothLE/listener';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import ColorPalette from '../../../components/ColorPalette';
import ScreenTemplate from '../../../components/ScreenTemplate';
import ColorPickerModal from '../../../components/ColorPickerModal';
import { setCurrentColor } from '../../../state/Matrix/matrixSlice';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		color: 'white',
		marginTop: 225,
		fontFamily: 'Inter-Bold',
		fontSize: 25,
	},
	textInputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '85%'
	},
	colorList: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	sendButton: {
		backgroundColor: 'transparent',
		position: 'absolute',
		right: 0,
		bottom: 0,
		paddingHorizontal: 12,
		paddingVertical: 18
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
		dispatch(setCurrentColor(hex));
	};
	const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
	const toggleColorPicker = () => {
		setIsColorPickerVisible(!isColorPickerVisible);
	};
	
	return(
		<ScreenTemplate>
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<View style={[ styles.container, { paddingBottom: bottomTabBarHeight }, ]}>
					<View style={styles.headerContainer}></View>
						
					<View style={styles.textInputContainer}>
						<TextInput
							style={{
								backgroundColor: 'rgba(0,0,0,0.6)',
								borderRadius: 14,
								paddingVertical: 11,
								paddingHorizontal: 12,
								fontFamily: 'Inter-Regular',
								color: textColor,
								fontSize: 16,
								marginBottom: 10,
								flex: 1
							}}
							placeholder={t('sample-message')}
							onChangeText={onChangeText}
							value={text}
						/>
						<View style={styles.sendButton}>
							<TouchableOpacity
								disabled={!text}
								onPress={() => handleButtonPress()}
							>
								<Ionicons
									name='send'
									size={25}
									color={ !text ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255, 0.9)'}
								/>
							</TouchableOpacity>
						</View>
					</View>
					<View style={styles.colorList}>
						<TouchableOpacity
							onPress={toggleColorPicker}
							style={{marginRight: 10}}
						>
							<Ionicons
								name={'color-palette'}
								size={36}
								color='white'
							/>
						</TouchableOpacity>
						<ColorPalette />
					</View>
				</View>
			</TouchableWithoutFeedback>
			<ColorPickerModal
				visible={isColorPickerVisible}
				onSelectColor={onSelectColor}
				onClose={() => toggleColorPicker()}
			/>
		</ScreenTemplate>
	);
};

export default TextScreen;