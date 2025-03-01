import React from 'react';
import {Button, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {HomeScreenNavigationProp} from './types';

type Props = {
  navigation: HomeScreenNavigationProp;
};

const Home = ({navigation}: Props) => {
  return (
    <View>
      <Button
        title="Operator Screen"
        onPress={() => navigation.navigate('OperatorTabs')}
      />
      <Button
        title="Driver Screen"
        onPress={() => navigation.navigate('DriverTabs')}
      />
    </View>
  );
};

export default Home;
