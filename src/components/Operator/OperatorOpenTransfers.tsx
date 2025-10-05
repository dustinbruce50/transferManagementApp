import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Transfer} from "../types"
import TransferCard from '../TransferCard';
import {Picker} from '@react-native-picker/picker';

const OperatorOpenTransfers = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [amountSent, setAmountSent] = useState<Number>();
  const [countTypeSent, setCountTypeSent] = useState();
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const renderItem = ({item}: {item: Transfer}) => (
    <View>
      <TransferCard
        item={item}
        buttonTitle="Accept Transfer"
        onPressButton={() => openModal(item)}
      />
    </View>
  );

  const openModal = (transfer: Transfer) => {
    setSelectedTransfer(transfer);
    setModalVisible(true);
  };
  const closeModal = () => {
    setSelectedTransfer(null);
    setModalVisible(false);
  };

  useEffect(() => {
    fetchTransfers();
  }, []);
  const fetchTransfers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        'http://10.0.2.2:3000/transfers/requested',
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

  const onAccept = async () => {
    if (amountSent == null || amountSent == 0) {
      Alert.alert('Please enter an amount to send');
      return;
    }
    if (countTypeSent == null) {
      Alert.alert('Please select a count type');
      return;
    }
    try {
      const id = selectedTransfer?._id;
      const token = await AsyncStorage.getItem('token');
      const unitNum = await AsyncStorage.getItem('unitNum');
      const response = await axios.put(
        `http://10.0.2.2:3000/transfers/${id}`,
        {
          id,
          status: 'accepted',
          amountSent: amountSent,
          amountSentType: countTypeSent,
          sendingUnit: unitNum,
          
        },
        {
          headers: {
            'x-access-token': token,
          },
        },
      );
      Alert.alert('Transfer Accepted');
    } catch (error) {
      console.log(error);
      Alert.alert('Error Accepting Transfer');
    }
  };

  return (
    <View>
      <Text>Open Requests</Text>
      <FlatList
        data={transfers}
        renderItem={renderItem}
        keyExtractor={(item: Transfer) => item._id}
      />
      <View
        style={{
          backgroundColor: 'rgba(0,0,0,.5)',
        }}>
        <Modal
          animationType="slide"
          visible={modalVisible}
          onRequestClose={closeModal}
          style={styles.modal}
          transparent={true}>
          <View style={styles.modalContent}>
            <View style={styles.modalContent2}>
              <TextInput
                style={styles.inputModal}
                placeholder="Amount to send"
                keyboardType="numeric"
                onChangeText={text => setAmountSent(parseFloat(text))}
              />
              <Picker
                mode="dropdown"
                selectedValue={countTypeSent}
                onValueChange={itemValue => setCountTypeSent(itemValue)}
                style={{height: 50, width: 90}}
                prompt="CS/Ea...">
                <Picker.Item label="Ea" value="EA" />
                <Picker.Item label="CS" value="CS" />
                <Picker.Item label="LB" value="Lb" />
              </Picker>
              <Button title="Accept Transfer" onPress={onAccept} />
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
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
    width: '70%',
    marginBottom: 24,
    padding: 8,
  },
  input2: {
    borderWidth: 1,
    borderColor: 'black',
    width: 200,
    marginBottom: 24,
    padding: 8,
    height: 50,
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,.9)',
    //backgroundColor: 'purple',
    justifyContent: 'flex-end',
    //height: '50%',
    alignItems: 'center',
    //overflow: 'hidden',
  },
  modalContent2: {
    backgroundColor: 'green',
    height: '50%',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
