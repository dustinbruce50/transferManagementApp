import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import React, { useState } from 'react';
import {
	Alert,
	Button,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import { Transfer } from '../types';
import { SERVER_IP } from '@env';

const RequestTransfer = () => {
	const [item, setItem] = useState('');
	const [amountReq, setAmountReq] = useState('');
	const [amountReqType, setAmountReqType] = useState('EA');

	const handleSubmit = async () => {
		try {
			const token = await AsyncStorage.getItem('token');
			const unitNum = await AsyncStorage.getItem('unitNum');
			const response = await axios.post(
				`${SERVER_IP}/transfers/requested`,
				{
					item,
					amountReq,
					amountReqType,
					unitNum,
				},
				{
					headers: {
						'x-access-token': token,
					},
				},
			);
			Alert.alert('Transfer Requested');
		} catch (error) {
			console.log(error);
			Alert.alert('Error Requesting Transfer');
		}
	};

	return (
		<View>
			<TextInput
				style={styles.input}
				placeholder="We need..."
				value={item}
				onChangeText={setItem}
			/>
			<TextInput
				style={styles.input}
				placeholder="We need how many..."
				value={amountReq}
				onChangeText={setAmountReq}
				keyboardType="numeric"
			/>
			<Picker
				mode="dropdown"
				selectedValue={amountReqType}
				onValueChange={itemValue =>
					setAmountReqType(itemValue)
				}
				style={{ height: 50, width: 90 }}
				prompt="CS/Ea..."
			>
				<Picker.Item
					label="Ea"
					value="ea"
				/>
				<Picker.Item
					label="CS"
					value="cs"
				/>
				<Picker.Item
					label="LB"
					value="lb"
				/>
			</Picker>

			<Button
				title="Request Transfer"
				onPress={handleSubmit}
			/>
		</View>
	);
};
const styles = StyleSheet.create({
	input: {},
});
export default RequestTransfer;
