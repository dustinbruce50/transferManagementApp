import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react';
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
  SectionList,
} from 'react-native';
import RNModal from 'react-native-modal';
import {Transfer} from '../types';
import TransferCard from '../TransferCard';
import {Picker} from '@react-native-picker/picker';
import {useFocusEffect} from '@react-navigation/native';
import { SERVER_IP } from '@env';

const OperatorMyTransfers = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [amountSent, setAmountSent] = useState<string>('');
  const [countTypeSent, setCountTypeSent] = useState<string>('EA');
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(
    null,
  );
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const isMounted = useRef<boolean>(true);
  const [outTrans, setOutTrans] = useState<Transfer[]>([]);
  const [inTrans, setInTrans] = useState<Transfer[]>([]);
  const [unitNum, setUnitNum] = useState<string | null>(null);
 
  

  const fetchAbort = useRef<AbortController | null>(null);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  

  useFocusEffect(
    React.useCallback(() => {
      fetchUnitNum();
      fetchOpenTransfers();
    }, []),
  );
  

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
    setAmountSent(transfer.amountReq?.toString() || '0'); // Use requested amount as default
    setCountTypeSent(transfer.amountReqType || 'EA'); // Use requested type as default
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  const fetchUnitNum = async () => {  
    const storedUnitNum = await AsyncStorage.getItem('unitNum');
    setUnitNum(storedUnitNum);
  };

  const fetchOpenTransfers = async () => {

    try {
      
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `${SERVER_IP}/transfers/unit/${unitNum}`,
        {
          headers: {
            'x-access-token': token,
          },
        },
      );
      if (isMounted.current) {
        //setTransfers(response.data);
      }
      if (isMounted.current) {
        setInTrans(response.data.filter((t: Transfer) => t.receivingUnit === unitNum));
        setOutTrans(response.data.filter((t: Transfer) => t.sendingUnit === unitNum));
        
      }
      
      //console.log('intrans:', inTrans);
      //console.log('outtrans:', outTrans);
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
      //await fetchTransfers();
      closeModal();

      console.warn('crash test 2');
      console.warn('crash test 3');
    } catch (error) {
      console.log(error);
      Alert.alert('Error Accepting Transfer');
    }
  };

  return (
    <View style={{flex: 1}}>
      {/**
      <Text>My In Transfers</Text>
      <FlatList
        data={inTrans}
        renderItem={renderItem}
        keyExtractor={(item: Transfer) => item._id}
      />
      
      
      <Text>My Out Transfers</Text>
      <FlatList
        data={outTrans}
        renderItem={renderItem}
        keyExtractor={(item: Transfer) => item._id}
      />
       */}
      <SectionList
        sections={[
          {title: 'My In Transfers', data: inTrans},
          {title: 'My Out Transfers', data: outTrans},
        ]}
        renderItem={renderItem}
        keyExtractor={(item: Transfer) => item._id}
        renderSectionHeader={({section: {title}}) => (
          <Text style={{textAlign: 'center',fontSize: 18, fontWeight: 'bold', marginTop: 16}}>
            {title}
          </Text>
        )}
      >

      </SectionList>
      
    </View>
  );
};

const styles = StyleSheet.create({
  transferBox: {
  
  },
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

export default OperatorMyTransfers;
