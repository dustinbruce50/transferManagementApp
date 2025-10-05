import React, {useState} from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  Button,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {StyleSheet} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RegisterScreenNavigationProp} from './types';
import {Picker} from '@react-native-picker/picker';

type Props = {
  navigation: RegisterScreenNavigationProp;
};

const RegisterScreen = ({navigation}: Props) => {
  const [username, setUsername] = useState('');
  const [unitNum, setUnitNum] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('operator');
  const [email, setEmail] = useState('');

  const onSubmit = async () => {
    console.log('Username: ', username);

    try {
      const response = await axios.post('http://10.0.2.2:3000/register', {
        username,
        unitNum,
        password,
        userType,
        email,
      });
      console.log('Response: ', response);

      if (response.status === 200) {
        console.log('You have successfully registered');

        Alert.alert('Success', 'You have successfully registered');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error(Error): ', error);
      } else {
        console.log('An error occured that wasnt an isntance of error');
        Alert.alert('Error', 'An error occured');
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image source={require('../../assets/truck.png')} style={styles.icon} />

        <KeyboardAvoidingView behavior="height">
          <View style={styles.form}>
            <Text style={styles.title}>Register</Text>
            <Picker
              selectedValue={userType}
              onValueChange={(itemValue, itemIndex) => setUserType(itemValue)}
              mode="dropdown"
              style={{width: 200}}>
              <Picker.Item label="Operator" value="operator" />
              <Picker.Item label="Driver" value="driver" />
            </Picker>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              onChange={() => setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Unit Number"
              value={unitNum}
              onChangeText={setUnitNum}
              onChange={() => setUnitNum}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />

            <Button title="Register" onPress={onSubmit} />
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  form: {
    width: '80%',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: 200,
    height: 40,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
    alignItems: 'center',
  },
  inner: {
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
export default RegisterScreen;
