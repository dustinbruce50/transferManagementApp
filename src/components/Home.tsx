import React, { useEffect } from 'react';
import { Button, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from './types';
import { requestUserPermission, onForegroundNotification, onBackgroundNotification, createChannel } from '../services/notifications';
import messaging from '@react-native-firebase/messaging';



type Props = {
	navigation: HomeScreenNavigationProp;
};
//const manReqPerm = async () => {
//	const auth = await messaging.requestPermission();
//	console.log('Manual permission request status:', auth);
//}

const Home = ({ navigation }: Props) => {
	useEffect(() => {
		requestUserPermission();
		//manReqPerm();
		createChannel();
		const unsubscribe = onForegroundNotification();
		onBackgroundNotification();
		return () => {
			unsubscribe();
		};
	}, []);

	return (
		<View>
			<Button
				title="Operator Screen"
				onPress={() => navigation.navigate('OperatorTabs')}
			/>
			<Button
				title="Driver Screen"
				onPress={() => navigation.navigate('DriverTabs')}
			/>
		</View>
	);
};

export default Home;
