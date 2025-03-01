import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import DriverScreen from './DriverScreen';
import DriverRecentlyDelivered from './DriverRecentlyDelivered';

const Tab = createBottomTabNavigator();

const DriverTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Ready to Deliver"
        component={DriverScreen}
        options={{title: 'Ready To Deliver', headerShown: false}}
      />
      <Tab.Screen
        name="Recently Delivered"
        component={DriverRecentlyDelivered}
        options={{title: 'Recently Delivered', headerShown: false}}
      />
    </Tab.Navigator>
  );
};

export default DriverTabs;
