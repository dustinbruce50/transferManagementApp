/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './src/components/Login';

import DriverScreen from './src/components/Driver/DriverScreen';
import RegisterScreen from './src/components/RegisterScreen';
import Home from './src/components/Home';
import 'react-native-gesture-handler';
import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import {RootStackParamList} from './src/components/types';
import OperatorTabs from './src/components/Operator/OperatorTabs';
import DriverTabs from './src/components/Driver/DriverTabs';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="OperatorTabs" component={OperatorTabs} />
          <Stack.Screen name="DriverTabs" component={DriverTabs} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    //alignItems: 'center',
  },
});
export default App;
