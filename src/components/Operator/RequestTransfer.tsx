import AsyncStorage from '@react-native-async-storage/async-storage';
//import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import React, { useState } from 'react';
import {
	Alert,
	Button,
	StyleSheet,
	Text,
	TextInput,
	View,
	TouchableOpacity,
	Pressable
} from 'react-native';
import { Transfer } from '../types';
import { SERVER_IP } from '@env';

const COUNT_TYPES = [
    { label: 'Ea', value: 'EA' },
    { label: 'CS', value: 'CS' },
    { label: 'LB', value: 'LB' },
];

const RequestTransfer = () => {
	const [item, setItem] = useState('');
	const [amountReq, setAmountReq] = useState('');
	const [amountReqType, setAmountReqType] = useState('EA');
	const [pickVisible, setPickVisible] = useState(false);

	const handleSubmit = async () => {
		try {
			const token = await AsyncStorage.getItem('token');
			const unitNum = await AsyncStorage.getItem('unitNum');
			const response = await axios.post(
				`${SERVER_IP}/transfers/requested`,
				{
					item,
					amountReq,
					amountReqType: amountReqType || 'EA',
					unitNum,
				},
				{
					headers: {
						'x-access-token': token,
					},
				},
			);
			console.log('before alert')
			
			Alert.alert('Transfer Requested')
			
			console.log('after alert')
		} catch (error) {
			console.log(error);
			Alert.alert('Error Requesting Transfer');
		}
	};

	return (
		<View>
			<TextInput
				style={styles.input}
				placeholder="Item Requested"
				value={item}
				onChangeText={setItem}
			/>
			<TextInput
				style={styles.input}
				placeholder="Number of Units"
				value={amountReq}
				onChangeText={setAmountReq}
				keyboardType="numeric"
			/>
			<TouchableOpacity
			style={{ marginTop: 20, padding: 10, backgroundColor: '#eee', borderRadius: 5, bottom: 10 }}>
				<Pressable
					onPress={() =>
						setPickVisible(!pickVisible)
					}
				>
					<Text>{amountReqType}</Text>
				</Pressable>
				 {pickVisible && 
					<View style={{ backgroundColor: 'white', padding: 10, borderRadius: 5, width: '20%', left: 0, top: 10, zIndex: 1 }}>
						{COUNT_TYPES.map((type) => (
							<Pressable
							style={{ padding: 5, borderColor: 'black', borderWidth: 1, marginBottom: 5 }}
								key={type.value}
								onPress={() => {
									setAmountReqType(type.value);
									setPickVisible(false);
								}}
							>
								<Text>{type.label}</Text>
							</Pressable>
						))}	
					</View>
				}
				
			</TouchableOpacity>

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
