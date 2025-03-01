import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../components/Login';

import DriverScreen from './Driver/DriverScreen.tsx';
import RegisterScreen from './RegisterScreen.tsx';
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    /*
    //<NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="OperatorScreen" component={OperatorScreen} />
      <Stack.Screen name="DriverScreen" component={DriverScreen} />
    </Stack.Navigator>
    //</NavigationContainer>
    */
    console.log()
  );
};

export default AppNavigator;
