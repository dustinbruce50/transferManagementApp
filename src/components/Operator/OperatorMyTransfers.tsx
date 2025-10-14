import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {use, useEffect, useRef, useState} from 'react';
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
import { AutoSizeText, ResizeTextMode } from 'react-native-auto-size-text';


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
  
  useEffect(() => {
    console.log('Setting unit num');
    fetchUnitNum();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      
      fetchOpenTransfers();
    }, [unitNum]),

  );
  

  const renderItem = ({item}: {item: Transfer}) => {
    let cancellable = false;
    let pinColor='white';
    let message = '';
    if (item.type === 'requested') {
      pinColor = '#FF5252';
      message = 'Requested';
    } else if (item.type === 'accepted'){
      pinColor = '#FFC107';
      message = 'Accepted';
    } else if (item.type === 'delivered'){
      pinColor = '#4CAF50';
      message = 'Delivered';
    }
    if (item.type ==='requested' && item.receivingUnit === unitNum){
      cancellable = true;
    }
    return(
    <View style={{flex: 2}}>
      <TransferCard
        item={item}
        buttonColor={cancellable ? "#FF5252" : "#D3D3D3"}
        buttonTitle={cancellable ? "Cancel" : ""}
        onPressButton={() => {
          if (cancellable){
            return(
              openModal(item)
            )
          }
          else {
            return null;
          }
        }}
      >
      </TransferCard>
      <View
        style={{backgroundColor: pinColor, height: 25, width: 80, alignSelf:'flex-start', marginLeft: 25, borderRadius: 10}}
      >
        <Text
          style={{color: 'black', textAlign: 'center', fontSize:14, fontWeight: 'bold' }}
        >
          {message}
        </Text>
      </View>

    </View>
  )};


      


  const openModal = (transfer: Transfer) => {
    setSelectedTransfer(transfer);
    //setAmountSent(transfer.amountReq?.toString() || '0'); // Use requested amount as default
    //setCountTypeSent(transfer.amountReqType || 'EA'); // Use requested type as default
    setModalVisible(true);
    //onCancel();
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  const fetchUnitNum = async () => {  
    const storedUnitNum = await AsyncStorage.getItem('unitNum');
    console.log('Stored unit num: ', storedUnitNum);
    setUnitNum(storedUnitNum);
    console.log('unit num state: ', unitNum);
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
        setInTrans(response.data.filter((t: Transfer) => t.receivingUnit === unitNum && t.type !== 'cancelled'));
        setOutTrans(response.data.filter((t: Transfer) => t.sendingUnit === unitNum && t.type !== 'cancelled'));

      }
      
      //console.log('intrans:', inTrans);
      //console.log('outtrans:', outTrans);
    } catch (error) {
      console.log(error);
      Alert.alert('Error fetching transfers');
    }
    
    
  };

  const onCancel = async () => {
    //if (amountSent == null || amountSent == 0) {
    try {
      const id = selectedTransfer?._id;
      const token = await AsyncStorage.getItem('token');
      const unitNum = await AsyncStorage.getItem('unitNum');
      const response = await axios.put(
        `${SERVER_IP}/transfers/${id}`,
        {
          id,
          status: 'cancelled',
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
      Alert.alert('Error Cancelling Transfer');
    }
  };

  return (
    <View style={{flex: 1}}>
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
      <RNModal
        isVisible={modalVisible}
        onBackdropPress={closeModal}
        style={styles.modal}
        onBackButtonPress={closeModal}
        backdropColor='green'

      >
        <View
          style={{
          backgroundColor: 'lightcoral',
          height: 200,
          width: 200,
          alignSelf: 'center',
          borderRadius: 10,
          
          }}
        >
          <Button title="Cancel Transfer" onPress={onCancel} />
        </View>

      </RNModal>
      
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
