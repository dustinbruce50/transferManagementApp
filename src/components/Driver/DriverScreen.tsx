import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import React, { useEffect } from 'react';
import {
	Alert,
	Button,
	FlatList,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import TransferCard from '../TransferCard';
import { Transfer } from '../types';
import { useFocusEffect } from '@react-navigation/native';
import { SERVER_IP } from '@env';

const DriverScreen = () => {
	const [transfers, setTransfers] = React.useState<
		Transfer[]
	>([]);

	const fetchTransfers = async () => {
		try {
			const token = await AsyncStorage.getItem('token');
			const response = await axios.get(
				`${SERVER_IP}/transfers/status/accepted`,
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
	/** 
  useEffect(() => {
    fetchTransfers();
  }, []);
  */
	useFocusEffect(
		React.useCallback(() => {
			fetchTransfers();
		}, []),
	);
	const renderItem = ({ item }: { item: Transfer }) => (
		<View>
			<TransferCard
				item={item}
				buttonTitle="Mark as In Transit"
				onPressButton={() => handleSubmit(item._id)}
			/>
		</View>
	);

	const handleSubmit = async (id: String) => {
		try {
			const token = await AsyncStorage.getItem('token');
			const response = await axios.put(
				`${SERVER_IP}/transfers/${id}`,
				{
					id,
					status: 'in-transit',
				},
				{
					headers: {
						'x-access-token': token,
					},
				},
			);
			Alert.alert('Transfer Marked as In Transit');
		} catch (error) {
			console.log(error);
			Alert.alert('Error Posting In Transit Transfer');
		}
		fetchTransfers();
	};

	return (
		<View>
			<Text>Driver Screen</Text>
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
export default DriverScreen;
