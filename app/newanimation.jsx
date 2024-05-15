import { StyleSheet, TouchableOpacity, Text, View, FlatList, Button, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
		marginBottom: 10,
		backgroundColor: 'rgba(0,0,0,0.8)',
		paddingTop: 10,
	},	
	scrollContainer: {
		alignItems: 'center',
	},	
	listItem: {
		textAlign: 'center',
		flexDirection: 'column',
		marginHorizontal: 5
	},
	footer: {
		height: 40,
		marginTop: 15,
		marginBottom: 30,
		alignItems: 'center',
		flexDirection: 'row'
	},
	frameNumber: {
		fontFamily: 'Inter-Regular',
		fontSize: 13,
		textAlign: 'center',
		color: 'white',
		paddingTop: 2,
		paddingBottom: 10
	}

});

const NewAnimationScreen = () => {
	const MATRIX_ROWS = 8;
	const MATRIX_COLUMNS = 32;

	const dispatch = useAppDispatch();
	const navigation = useNavigation();
	const { t } = useTranslation();
	const [orientation, setOrientation] = useState(null);
	const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const toggleColorPicker = () => {
		setIsColorPickerVisible(!isColorPickerVisible);
	};

	async function changeScreenOrientation() {
		if (orientationIsLandscape) {
			await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
		} else {
			await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
		}
		setIsLoading(false);
	}
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

	const [animationFrames, setAnimationFrames] = useState([]);

	const handleAddFrame = () => {
		const isNotBlank = Object.values(pixelColors).some(color => color !== '#000000');
		if (!isNotBlank) return;
		setAnimationFrames([...animationFrames, toArray(pixelColors)]);
		setTimeout(() => {
			flatListRef.current?.scrollToEnd({ animated: true });
		}, 10);
		setPixelColors(() => {
			let newPixelColors = {};
			for (let i = 0; i < MATRIX_COLUMNS; i++) {
				for (let j = 0; j < MATRIX_ROWS; j++) {
					newPixelColors[`${i},${j}`] = '#000000';
				}
			}
			return newPixelColors;
		});
	};

	const onSave = (pixelColors) => {
		if (animationFrames.length > 1) {
			dispatch(addToMyAnimations(animationFrames));
			router.back();
		} else {
			Alert.alert(t('new-animation.not-enough-frames'));
		}
	};

	const toggleOrientation = () => {
		setOrientation(!orientationIsLandscape);
		changeScreenOrientation();
	};

	useEffect(() => {
		checkOrientation();
		const subscription = ScreenOrientation.addOrientationChangeListener(
			handleOrientationChange
		);
		navigation.setOptions({
			headerRight: () => (
				<Button
					title= {t('save')}
					color= {'#007AFF'}
					onPress={() => onSave(pixelColors)}
				/>
			),
		});
		return () => {
			ScreenOrientation.removeOrientationChangeListeners(subscription);
		};
	}), [];

	 const checkOrientation = async () => {
		const orientation = await ScreenOrientation.getOrientationAsync();
		setOrientation(orientation);
	};
	const changeOrientation = async (newOrientation) => {
		console.log('newOrientation: ', newOrientation);
		await ScreenOrientation.lockAsync(newOrientation);
		setIsLoading(false);
	};
	const handleOrientationChange = (o) => {
		setOrientation(o.orientationInfo.orientation);
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
		<View style={styles.listItem} key={index}>
			<BitmapImage 
				bitmapData={item ? item : []}
				itemWidth={210}
			/>
			<Text style={styles.frameNumber}>{index+1}</Text>
		</View>
	);
	const keyExtractor = (item, index) => index.toString();

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
									<Ionicons name='add' size={30} color='white' style={{marginHorizontal: 10}} />
								</TouchableOpacity>
							}
						/>
					</View>
					<View style={styles.wrapper}>
						<DrawingPadGrid
							rows={MATRIX_ROWS}
							columns={MATRIX_COLUMNS}
							pixelColors={pixelColors}
							setPixelColors={setPixelColors}
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