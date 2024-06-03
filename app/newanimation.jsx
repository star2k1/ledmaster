import { StyleSheet, TouchableOpacity, Text, View, FlatList, Button, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useFocusEffect } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import DrawingPadGrid from '../components/DrawingPadGrid';
import ColorPalette from '../components/ColorPalette';
import { useAppDispatch } from '../state/store';
import { useNavigation, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { addToMyAnimations } from '../state/Matrix/matrixSlice';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import ColorPickerModalSmall from '../components/ColorPickerModalSmall';
import { setCurrentColor } from '../state/Matrix/matrixSlice';
import * as Haptics from 'expo-haptics';
import ScreenTemplate from '../components/ScreenTemplate';
import BitmapImage from '../components/DesignPreview';


const styles = StyleSheet.create({
	test: {
		fontFamily: 'Inter-Bold',
		fontSize: 40,
		color: 'white',
	},
	testView: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		verticalAlign: 'center'
	},
	wrapper: {
		backgroundColor: 'rgba(0,0,0,0.2)',
		borderRadius: 4,
	},
	scrollBackround: {
		flex: 1,
		width: '100%',
		backgroundColor: 'rgba(0,0,0,0.8)',
		marginBottom: 20,
		paddingLeft: 20
	},	
	scrollContainer: {
		alignItems: 'center',
	},	
	listItem: {
		textAlign: 'center',
		flexDirection: 'column',
		marginHorizontal: 5,
		padding: 2
	},
	listItemSelected: {
		borderColor: 'dodgerblue',
		borderWidth: 1
	},
	listFrame: {
		marginTop: 5
	},
	footer: {
		height: 35,
		marginTop: 15,
		marginBottom: 25,
		alignItems: 'center',
		flexDirection: 'row'
	},
	frameNumber: {
		fontFamily: 'Inter-Regular',
		fontSize: 12,
		textAlign: 'center',
		color: 'white',
		paddingTop: 2,
	}
});

const NewAnimationScreen = () => {
	const MATRIX_ROWS = 8;
	const MATRIX_COLUMNS = 32;

	const dispatch = useAppDispatch();
	const navigation = useNavigation();
	const { t } = useTranslation();
	const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedFrameIndex, setSelectedFrameIndex] = useState(0);
	const toggleColorPicker = () => {
		setIsColorPickerVisible(!isColorPickerVisible);
	};

	const onSelectColor = ({ hex }) => {
		dispatch(setCurrentColor(hex));
	};

	const toArray = (pixelColors) => {
		const pixelColorsArray = [];
		for (let i = 0; i < MATRIX_COLUMNS; i++) {
  			pixelColorsArray.push([]);
  			for (let j = 0; j < MATRIX_ROWS; j++) {
				pixelColorsArray[i].push(pixelColors[`${i},${j}`]);
  			}
		}
		return pixelColorsArray;
	};
	
	const [pixelColors, setPixelColors] = useState(() => {
  		let initialPixelColors = {};
  		for (let i = 0; i < MATRIX_COLUMNS; i++) {
    		for (let j = 0; j < MATRIX_ROWS; j++) {
      			initialPixelColors[`${i},${j}`] = '#000000';
    		}
  		}
  		return initialPixelColors;
	});

	const [animationFrames, setAnimationFrames] = useState([toArray(pixelColors)]);

	const handleAddFrame = () => {
		const isNotBlank = Object.values(pixelColors).some(color => color !== '#000000');
		if (!isNotBlank) return;

		const newFrame = Array.from({ length: MATRIX_COLUMNS }, () => Array(MATRIX_ROWS).fill('#000000'));

		setAnimationFrames(prevFrames => {
			const updatedFrames = [...prevFrames];
			updatedFrames[selectedFrameIndex] = toArray(pixelColors);
			return [...updatedFrames, newFrame];
		});
		setSelectedFrameIndex(animationFrames.length);
		setPixelColors(() => {
			let newPixelColors = {};
			for (let i = 0; i < MATRIX_COLUMNS; i++) {
				for (let j = 0; j < MATRIX_ROWS; j++) {
					newPixelColors[`${i},${j}`] = '#000000';
				}
			}
			return newPixelColors;
		});

		setTimeout(() => {
			flatListRef.current?.scrollToEnd({ animated: true });
		}, 10);
	};

	const onSave = () => {
		const isNotBlank = Object.values(pixelColors).some(color => color !== '#000000');
		if (!isNotBlank) Alert.alert(t('new-design.empty-canvas-message'));
		else if (animationFrames.length > 1) {
			dispatch(addToMyAnimations(animationFrames));
			router.back();
		} else {
			Alert.alert(t('new-animation.not-enough-frames'));
		}
	};

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<Button
					title= {t('save')}
					color= {'#007AFF'}
					onPress={() => onSave(pixelColors)}
				/>
			),
		});
	}), [];

	const changeOrientation = async (newOrientation) => {
		console.log('newOrientation: ', newOrientation);
		await ScreenOrientation.lockAsync(newOrientation);
		setIsLoading(false);
	};
	
	useFocusEffect(
		React.useCallback(() => {
			setIsLoading(true);
			changeOrientation(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
			return async () => {
				await changeOrientation(ScreenOrientation.OrientationLock.PORTRAIT_UP);
			};
		}, [])
	);

	const handleEraser = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		dispatch(setCurrentColor('#000000'));
	};

	const flatListRef = useRef(null);

	const renderItem = ({ item, index }) => (
		<View style={styles.listFrame}>
			<TouchableOpacity onPress={() => handleFrameSelect(index)}>
				<View style={[styles.listItem, selectedFrameIndex == index && styles.listItemSelected]} key={index}>
					<BitmapImage 
						bitmapData={item ? item : []}
						itemWidth={155}
					/>
				</View>
				<Text style={styles.frameNumber}>{index+1}</Text>
			</TouchableOpacity>
		</View>
	);
	const keyExtractor = (item, index) => index.toString();

	const handleFrameSelect = (index) => {
		setAnimationFrames(prevFrames => {
			const updatedFrames = [...prevFrames];
			updatedFrames[selectedFrameIndex] = toArray(pixelColors);
			return updatedFrames;
		});
		setSelectedFrameIndex(index);
		setPixelColors(() => {
			const framePixelColors = animationFrames[index];
			let newPixelColors = {};
			for (let i = 0; i < MATRIX_COLUMNS; i++) {
				for (let j = 0; j < MATRIX_ROWS; j++) {
					newPixelColors[`${i},${j}`] = framePixelColors[i][j];
				}
			}
			return newPixelColors;
		});
	};

	 const handlePixelColorsChange = (updatedPixelColors) => {
		setPixelColors(prevPixelColors => ({
			...prevPixelColors,
			...updatedPixelColors
		}));
	};

	return (
		<ScreenTemplate>
			{isLoading ? (<View><ActivityIndicator size={'large'}/></View>) : (
				<View style={styles.testView}>
					<View style={styles.scrollBackround}>
						<FlatList
							ref={flatListRef}
							contentContainerStyle={styles.scrollContainer}
							horizontal
							data={animationFrames}
							renderItem={renderItem}
							keyExtractor={keyExtractor}
							showsHorizontalScrollIndicator={false}
							ListFooterComponent={
								<TouchableOpacity onPress={handleAddFrame}>
									<Ionicons name='add' size={28} color='white' style={{marginHorizontal: 10}} />
								</TouchableOpacity>
							}
						/>
					</View>
					<View style={styles.wrapper}>
						<DrawingPadGrid
							rows={MATRIX_ROWS}
							columns={MATRIX_COLUMNS}
							pixelColors={pixelColors}
							onPixelColorsChange={handlePixelColorsChange}
						/>
					</View>
					<View style={styles.footer}>
						<TouchableOpacity
							onPress={handleEraser}
							style={{marginRight: 10}}
						>
							<FontAwesome6
								name='eraser'
								size={35}
								color='rgba(0,0,0,0.9)'
							/>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={toggleColorPicker}
							style={{marginRight: 10}}
						>
							<Ionicons
								name={'color-palette'}
								size={35}
								color='white'
							/>
						</TouchableOpacity>
						<ColorPalette />
					</View>
					<ColorPickerModalSmall
						visible={isColorPickerVisible}
						onSelectColor={onSelectColor}
						onClose={() => toggleColorPicker()}
					/>
				</View> )}
		</ScreenTemplate>
	);
};

export default NewAnimationScreen;