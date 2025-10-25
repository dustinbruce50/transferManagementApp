import React, { useEffect } from 'react';
import { Button, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from './types';
import { requestUserPermission, onForegroundNotification, onBackgroundNotification } from '../services/notifications';


type Props = {
	navigation: HomeScreenNavigationProp;
};

const Home = ({ navigation }: Props) => {
	useEffect(() => {
		requestUserPermission();
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
