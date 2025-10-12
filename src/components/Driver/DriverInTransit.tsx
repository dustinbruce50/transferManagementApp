import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useEffect} from 'react';
import {Alert, FlatList, Text, View} from 'react-native';
import {Transfer} from '../types';
import TransferCard from '../TransferCard';
import {useFocusEffect} from '@react-navigation/native';

const DriverInTransit = () => {
  const [transfers, setTransfers] = React.useState<Transfer[]>([]);

  const fetchInTransit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('React Fetch Transit Function');
      const response = await axios.get(
        'http://10.0.2.2:3000/transfers/status/in-transit',
        {
          headers: {
            'x-auth-token': token,
          },
        },
      );
      setTransfers(response.data);
    } catch (error) {
      console.log(error);
      Alert.alert('Error fetching In Transit transfers');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchInTransit();
    }, []),
  );

  const handleSubmit = async (id: String) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.put(
        `http://10.0.2.2:3000/transfers/${id}`,
        {
          id,
          status: 'delivered',
        },
        {
          headers: {
            'x-access-token': token,
          },
        },
      );
      Alert.alert('Transfer Marked as Delivered');
    } catch (error) {
      console.log(error);
      Alert.alert('Error Posting Delivered Transfer');
    }
    fetchInTransit();
  };

  const renderItem = ({item}: {item: Transfer}) => (
    <View>
      <TransferCard
        item={item}
        buttonTitle="Mark Delivered"
        onPressButton={() => handleSubmit(item._id)}
      />
    </View>
  );

  return (
    <View>
      <Text>In Transit</Text>
      <FlatList
        data={transfers}
        renderItem={renderItem}
        keyExtractor={(item: Transfer) => item._id}
      />
    </View>
  );
};

export default DriverInTransit;
