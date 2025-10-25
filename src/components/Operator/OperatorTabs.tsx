import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import DriverScreen from '../Driver/DriverScreen';
import OperatorDelivered from './Delivered';
import RequestTransfer from './RequestTransfer';
import OperatorOpenTransfers from './OperatorOpenTransfers';
import { Transfer } from '../types';
import OperatorMyTransfers from './OperatorMyTransfers';

const Tab = createBottomTabNavigator();

const OperatorTabs = () => {
	return (
		<Tab.Navigator>
			<Tab.Screen
				name="Request"
				component={RequestTransfer}
				options={{ title: 'Request', headerShown: false }}
			/>
			<Tab.Screen
				name="Open Transfers"
				component={OperatorOpenTransfers}
				options={{
					title: 'Open Transfers',
					headerShown: false,
				}}
			/>
			<Tab.Screen
				name="My Transfers"
				component={OperatorMyTransfers}
				options={{
					title: 'My Transfers',
					headerShown: false,
				}}
			/>
		</Tab.Navigator>
	);
};

export default OperatorTabs;
