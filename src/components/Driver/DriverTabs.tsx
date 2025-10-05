import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import DriverScreen from './DriverScreen';
import DriverRecentlyDelivered from './DriverRecentlyDelivered';
import DriverInTransit from './DriverInTransit';

const Tab = createBottomTabNavigator();

const DriverTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Ready to Pickup"
        component={DriverScreen}
        options={{title: 'Ready To Pickup', headerShown: false}}
      />
      <Tab.Screen
        name="In Transit"
        component={DriverInTransit}
        options={{title: 'In Transit', headerShown: false}}
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
