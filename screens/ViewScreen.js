import React, {
	useState,
	useEffect
} from 'react';
import {
	Platform,
	Animated,
	Dimensions,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableHighlight,
	RefreshControl,
	ScrollView,
	SafeAreaView,
	View,
	AsyncStorage
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import Constants from '../constants/Constants.js';

export default function ViewScreen() {
	const [refreshing, setRefreshing] = React.useState(false);
	const [listData, setListData] = useState([]);
	const [rowSwipeAnimatedValues, setRowSwipeAnimatedValues] = useState({})

	useEffect(() => {
		this.loadFoodFromStorage();
	}, []);

	loadFoodFromStorage = async () => {
		let animatedValues = {};
		let keys = await AsyncStorage.getAllKeys();
		let stores = await AsyncStorage.multiGet(keys);

		let newListData = stores.map((result, i, store) => {
			let key = store[i][0];
			let value = JSON.parse(store[i][1]);

			animatedValues[`${key}`] = new Animated.Value(0);
			return { key, text: `${value.name} (${value.quantity})` };
		});

		if (newListData.length > 0) {
			setRowSwipeAnimatedValues(animatedValues);
			setListData(newListData);
		}
	}

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);

		this.loadFoodFromStorage().then(() => setRefreshing(false));
	}, [refreshing]);

	closeRow = (rowMap, rowKey) => {
		if (rowMap[rowKey]) {
			rowMap[rowKey].closeRow();
		}
	}

	deleteRow = (rowMap, rowKey) => {
		this.closeRow(rowMap, rowKey);
		const newData = [...listData];
		const prevIndex = listData.findIndex(
			item => item.key === rowKey
		);
		newData.splice(prevIndex, 1);
		setListData(newData);

		// Remove from storage too
		AsyncStorage.removeItem(rowKey);
	}

	onRowDidOpen = rowKey => {
		console.log('This row opened', rowKey);
	};

	onSwipeValueChange = swipeData => {
		const { key, value } = swipeData;
		rowSwipeAnimatedValues[key].setValue(Math.abs(value));
	};

	return (
		<SwipeListView
			data={listData}
			refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
			renderItem={data => (
				<TouchableHighlight
					onPress={() => console.log('You touched me')}
					style={styles.rowFront}
					underlayColor={'#BDBEC2'}
				>
					<View>
						<Text>
							{data.item.text}
						</Text>
					</View>
				</TouchableHighlight>
			)}
			renderHiddenItem={(data, rowMap) => (
				<View style={styles.rowBack}>
					<TouchableOpacity
						style={[
							styles.backRightBtn,
							styles.backRightBtnLeft,
						]}
						onPress={() =>
							this.closeRow(rowMap, data.item.key)
						}
					>
						<Text style={styles.backTextWhite}>
							Close
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[
							styles.backRightBtn,
							styles.backRightBtnRight,
						]}
						onPress={() =>
							this.deleteRow(rowMap, data.item.key)
						}
					>
						<Animated.View
							style={[
								styles.trash,
								{
									transform: [
										{
											scale: rowSwipeAnimatedValues[
												data.item.key
											].interpolate({
												inputRange: [
													45,
													90,
												],
												outputRange: [0, 1],
												extrapolate:
													'clamp',
											}),
										},
									],
								},
							]}
						>
							<Ionicons name={Platform.OS === 'ios' ? 'ios-trash' : 'md-trash'} style={styles.trashIcon}></Ionicons>
						</Animated.View>
					</TouchableOpacity>
				</View>
			)}
			leftOpenValue={75}
			rightOpenValue={-150}
			disableRightSwipe={true}
			previewRowKey={'0'}
			previewOpenValue={-40}
			previewOpenDelay={3000}
			onRowDidOpen={this.onRowDidOpen}
			onSwipeValueChange={this.onSwipeValueChange}
		/>
	)
}

ViewScreen.navigationOptions = {
	title: 'Food Inventory',
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		flex: 1,
	},
	standalone: {
		marginTop: 30,
		marginBottom: 30,
	},
	standaloneRowFront: {
		alignItems: 'center',
		backgroundColor: '#CCC',
		justifyContent: 'center',
		height: 50,
	},
	standaloneRowBack: {
		alignItems: 'center',
		backgroundColor: '#8BC645',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 15,
	},
	backTextWhite: {
		color: '#FFF',
	},
	rowFront: {
		alignItems: 'center',
		backgroundColor: '#CCC',
		borderBottomColor: 'black',
		borderBottomWidth: 1,
		justifyContent: 'center',
		height: 50,
	},
	rowBack: {
		alignItems: 'center',
		backgroundColor: '#DDD',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft: 15,
	},
	backRightBtn: {
		alignItems: 'center',
		bottom: 0,
		justifyContent: 'center',
		position: 'absolute',
		top: 0,
		width: 75,
	},
	backRightBtnLeft: {
		backgroundColor: '#007AFF',
		right: 75,
	},
	backRightBtnRight: {
		backgroundColor: '#FF3A2D',
		right: 0,
	},
	controls: {
		alignItems: 'center',
		marginBottom: 30,
	},
	switchContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginBottom: 5,
	},
	switch: {
		alignItems: 'center',
		borderWidth: 1,
		borderColor: 'black',
		paddingVertical: 10,
		width: Dimensions.get('window').width / 4,
	},
	trash: {
		width: 25,
		height: 25
	},
	trashIcon: {
		fontSize: 24,
		color: 'white'
	}
});