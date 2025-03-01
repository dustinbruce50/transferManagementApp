import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {Alert, Button, FlatList, StyleSheet, Text, View} from 'react-native';
import TransferCard from '../TransferCard';
import {Transfer} from "../types"


const renderItem = ({item}: {item: Transfer}) => (
  <View>
    <TransferCard item={item}/>

  </View>
);


const Delivered = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);

  useEffect(() => {
    fetchTransfers();
  }, []);
  const fetchTransfers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        'http://10.0.2.2:3000/transfers/delivered',
        {
          headers: {
            'x-auth-token': token,
          },
        },
      );
      setTransfers(response.data);
    } catch (error) {
      console.log(error);
      Alert.alert('Error fetching transfers');
    }
  };

  return (
    <View>
      <Text>Delivered</Text>
      <FlatList
              data={transfers}
              renderItem={renderItem}
              keyExtractor={(item: Transfer) => item._id}
            />
    </View>
  );
};
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#841584',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {},
  item: {
    backgroundColor: '#f9c2ff',
    padding: 4,
    marginVertical: 8,
    marginHorizontal: 4,
    minWidth: '80%',
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    width: '80%',
    marginBottom: 24,
    padding: 8,
  },
});

export default Delivered;
