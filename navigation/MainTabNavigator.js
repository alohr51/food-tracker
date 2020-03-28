import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ViewScreen from '../screens/ViewScreen';
import AddScreen from '../screens/AddScreen';

const config = Platform.select({
	web: { headerMode: 'screen' },
	default: {},
});

const HomeStack = createStackNavigator(
	{
		Home: HomeScreen,
	},
	config
);

HomeStack.navigationOptions = {
	tabBarLabel: 'Home',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon
			focused={focused}
			name={
				Platform.OS === 'ios'
					? `ios-information-circle${focused ? '' : '-outline'}`
					: 'md-information-circle'
			}
		/>
	),
};

HomeStack.path = '';

const ViewStack = createStackNavigator(
	{
		View: ViewScreen,
	},
	config
);

ViewStack.navigationOptions = {
	tabBarLabel: 'View',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon focused={focused} name={Platform.OS === 'ios-list' ? 'ios-list' : 'md-list'} />
	),
};

ViewStack.path = '';

const AddStack = createStackNavigator(
	{
		Add: AddScreen,
	},
	config
);

AddStack.navigationOptions = {
	tabBarLabel: 'Add',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-add' : 'md-add'} />
	),
};

AddStack.path = '';

const tabNavigator = createBottomTabNavigator({
	HomeStack,
	ViewStack,
	AddStack,
});

tabNavigator.path = '';

export default tabNavigator;
