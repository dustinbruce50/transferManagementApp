import React, {useEffect, useRef} from 'react';
import {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LoginScreenNavigationProp} from './types';

type Props = {
  navigation: LoginScreenNavigationProp;
};

const Login = ({navigation}: Props) => {
  const isMounted = useRef(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const passwordInputRef = useRef<TextInput>(null);

  const handleSubmit = async () => {
    console.log('Username: ', username);
    try {
      const response = await axios.post('http://10.0.2.2:3000/login', {
        username,
        password,
      });
      console.log('Response: ', response);
      const {token, userType, id} = response.data;
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userType', userType);
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('userId', id.toString());
      console.log('Token: ', token);
      console.log('UserType: ', userType);
      if (response.status === 200) {
        console.log('You have successfully logged in');

        Alert.alert('Success', 'You have successfully logged in');
      }
      navigation.navigate('Home');
      /*
      if (userType === 'operator') {
        navigation.navigate('OperatorScreen');
      } else if (userType === 'driver') {
        navigation.navigate('DriverScreen');
      }
      */
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error(Error): ', error);

        if (isMounted.current) {
          Alert.alert('Error', error.message);
        }
      } else {
        console.log('An error occured that wasnt an isntance of error');
        Alert.alert('Error', 'An error occured');
      }
    }
  };
  const navigateToRegister = () => {
    navigation.navigate('RegisterScreen');
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior="height"
        style={styles.keyboardAvoidingView}>
        <View style={styles.container}>
          <Image
            source={require('../../assets/truck.png')}
            style={styles.icon}
          />
          <Text style={styles.sectionTitle}>Transfer Management App</Text>

          <Text style={styles.title}>Login</Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            onSubmitEditing={() => {
              passwordInputRef.current?.focus();
            }}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            ref={passwordInputRef}
          />

          <Button title="Login" onPress={handleSubmit} />
          <Button title="register" onPress={navigateToRegister} />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  form: {
    width: '80%',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    width: 200,
    height: 200,
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
export default Login;
