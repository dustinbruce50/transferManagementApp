import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
	Alert,
	Button,
	FlatList,
	InteractionManager,
	//Modal,
	StyleSheet,
	Text,
	TextInput,
	View,
	KeyboardAvoidingView,
	TouchableOpacity,
	Touchable,
	Pressable,
} from 'react-native';
import RNModal from 'react-native-modal';
import { Transfer } from '../types';
import TransferCard from '../TransferCard';
import { useFocusEffect } from '@react-navigation/native';
import { SERVER_IP } from '@env';
import { RawButton } from 'react-native-gesture-handler';
import { Modal } from 'react-native';

const COUNT_TYPES = [
    { label: 'Ea', value: 'EA' },
    { label: 'CS', value: 'CS' },
    { label: 'LB', value: 'LB' },
];

const OperatorOpenTransfers = () => {
	const [transfers, setTransfers] = useState<Transfer[]>(
		[],
	);
	const [amountSent, setAmountSent] = useState<string>('');
	const [countTypeSent, setCountTypeSent] =
		useState<string>('EA');
	const [selectedTransfer, setSelectedTransfer] =
		useState<Transfer | null>(null);
	const [modalVisible, setModalVisible] =
		useState<boolean>(false);
	const isMounted = useRef<boolean>(true);
	const shouldFetchRef = useRef<boolean>(false);
	const [showPicker, setShowPicker] = useState(false);

	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	const renderItem = ({ item }: { item: Transfer }) => (
		<View>
			<TransferCard
				item={item}
				buttonTitle="Accept Transfer"
				onPressButton={() => openModal(item)}
			/>
		</View>
	);

	const openModal = (transfer: Transfer) => {
		console.log('Opening modal for transfer:', transfer);
		setSelectedTransfer(transfer);
		setAmountSent(transfer.amountReq?.toString() || '0'); // Use requested amount as default
		setCountTypeSent(transfer.amountReqType || 'EA'); // Use requested type as default
		setModalVisible(true);
		console.log('Modal visible:', modalVisible);
	};
	const closeModal = () => {
		setModalVisible(false);

	};
	

	useFocusEffect(
		React.useCallback(() => {
			fetchTransfers();
		}, []),
	);
	const fetchTransfers = async () => {
		try {
			const token = await AsyncStorage.getItem('token');
			const response = await axios.get(
				`${SERVER_IP}/transfers/status/requested`,
				{
					headers: {
						'x-access-token': token,
					},
				},
			);
			if (isMounted.current) {
				setTransfers(response.data);
			}
		} catch (error) {
			console.log(error);
			Alert.alert('Error fetching transfers');
		}
	};

	const onAccept = async () => {
		//if (amountSent == null || amountSent == 0) {
		if (
			!amountSent ||
			parseFloat(amountSent) <= 0 ||
			isNaN(parseFloat(amountSent))
		) {
			Alert.alert('Please enter an amount to send');
			return;
		}
		if (!countTypeSent) {
			Alert.alert('Please select a count type');
			return;
		}
		try {
			const id = selectedTransfer?._id;
			const token = await AsyncStorage.getItem('token');
			const unitNum = await AsyncStorage.getItem('unitNum');
			const response = await axios.put(
				`${SERVER_IP}/transfers/${id}`,
				{
					id,
					status: 'accepted',
					amountSent: parseFloat(amountSent),
					amountSentType: countTypeSent,
					sendingUnit: unitNum,
				},
				{
					headers: {
						'x-access-token': token,
					},
				},
			);
			//Alert.alert('Transfer Accepted');
			console.warn('crash test 1');

			console.warn('🟢 CRASH TEST 3');
			shouldFetchRef.current = true;
			closeModal();
			

			console.warn('crash test 2');
			console.warn('crash test 3');

		} catch (error) {
			console.log(error);
			Alert.alert('Error Accepting Transfer');
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<Text>Open Requests</Text>
			<FlatList
				data={transfers}
				renderItem={renderItem}
				keyExtractor={(item: Transfer) => item._id}
			/>

			<RNModal
				isVisible={modalVisible}
				onBackdropPress={closeModal}
				//animation=""
				animationInTiming={100}
				animationOutTiming={100}
				//avoidKeyboard={true}
				hasBackdrop={true}
				backdropColor="black"
				backdropOpacity={0.2}
				backdropTransitionInTiming={1000}
				backdropTransitionOutTiming={1000}
				onBackButtonPress={closeModal}
				onModalHide={() => {
					if(shouldFetchRef.current){
						shouldFetchRef.current = false;
						fetchTransfers();
					}
				}}
			>
				<View style={styles.modalContent}>
					<View style={styles.modalContent2}>
						
		
						<TextInput
							style={styles.input2}
							placeholder="Amount Sent"
							keyboardType="numeric"
							value={amountSent}
							onChangeText={setAmountSent}
							inputMode="numeric"
						/>
						<Pressable
							style={styles.input2}
							onPress={() => setShowPicker(true)}
							//value={countTypeSent}
							onFocus={() => setShowPicker(true)}
						>
							<Text style={{ textAlign: 'center' }}>
								{countTypeSent
									? COUNT_TYPES.find(
											(type) =>
												type.value === countTypeSent,
									  )?.label
									: 'Select Count Type'}
							</Text>
							</Pressable>
						{showPicker && (
							<View style={{ backgroundColor: 'white', padding: 10, borderRadius: 5 }}>
								{COUNT_TYPES.map((type) => (
									<Pressable
										key={type.value}
										onPress={() => {
											setCountTypeSent(type.value);
											setShowPicker(false);
										}}
										style={{ padding: 10 }}
									>
										<Text>{type.label}</Text>
									</Pressable>
								))}
							</View>
						)}
						<Button title="Accept Transfer" onPress={onAccept} />
							
								
					


					
				
					
		
							 
					</View>
				</View>
			</RNModal>
		</View>
	);
};

const styles = StyleSheet.create({
	modalHeader: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 20,
		textAlign: 'center',
	},
	modal: {
		flex: 1,
	},
	/**button: {
    backgroundColor: '#841584',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 8,
  },
  **/
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
		width: '70%',
		marginBottom: 24,
		padding: 8,
	},
	input2: {
		textAlign: 'center',
		borderWidth: 1,
		borderColor: 'black',
		width: '100%',
		marginBottom: 24,
		height: 50,
	},
	modalContent: {
		flex: 1,
		backgroundColor: 'transparent',
		justifyContent: 'flex-end',

		//height: '50%',
		alignItems: 'center',
		//overflow: 'hidden',
		height: 'auto',
	},
	modalContent2: {
		padding: 20,
		backgroundColor: 'white',
		height: '50%',
		width: '100%',
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
	inputModal: {
		borderWidth: 1,
		borderColor: 'black',
		width: '70%',
		marginBottom: 24,
		padding: 8,
		height: 50,
		marginTop: 24,
		marginLeft: 24,
	},
});

export default OperatorOpenTransfers;
