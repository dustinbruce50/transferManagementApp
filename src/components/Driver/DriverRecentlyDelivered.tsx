import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect } from 'react';
import { Alert, FlatList, Text, View } from 'react-native';
import { Transfer } from '../types';
import TransferCard from '../TransferCard';
import { useFocusEffect } from '@react-navigation/native';
import { SERVER_IP } from '@env';

const DriverRecentlyDelivered = () => {
	const [transfers, setTransfers] = React.useState<
		Transfer[]
	>([]);

	const fetchRecentTransfers = async () => {
		try {
			const token = await AsyncStorage.getItem('token');
			const response = await axios.get(
				`${SERVER_IP}/transfers/status/delivered`,
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

	useFocusEffect(
		React.useCallback(() => {
			fetchRecentTransfers();
		}, []),
	);

	const renderItem = ({ item }: { item: Transfer }) => (
		<View>
			<TransferCard
				item={item}
				//buttonTitle="Mark Delivered"
				//onPressButton={() => handleSubmit(item._id)}
			/>
		</View>
	);

	return (
		<View>
			<Text>Recently Delivered Transfers</Text>
			<FlatList
				data={transfers}
				renderItem={renderItem}
				keyExtractor={(item: Transfer) => item._id}
			/>
		</View>
	);
};

export default DriverRecentlyDelivered;

function handleSubmit(_id: string): void {
	throw new Error('Function not implemented.');
}
