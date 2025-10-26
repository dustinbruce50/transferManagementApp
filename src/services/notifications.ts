import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
//import { Alert, Platform } from 'react-native';
//import notifee, {
//	AndroidImportance,
//} from '@notifee/react-native';
// @ts-ignore
import PushNotification from 'react-native-push-notification';

export async function getFCMToken() {
	const token = await messaging().getToken();
	return token;
}
export async function requestUserPermission(): Promise<boolean> {
	const authStatus = await messaging().requestPermission();
	const enabled =
		authStatus ===
			messaging.AuthorizationStatus.AUTHORIZED ||
		authStatus ===
			messaging.AuthorizationStatus.PROVISIONAL;

	if (enabled) {
		console.log('Authorization status:', authStatus);
	}

	return Promise.resolve(enabled);
}

export function onForegroundNotification(): () => void {
	console.log('Setting up foreground notification handler');
	const unsubscribe = messaging().onMessage(
		async remoteMessage => {
			PushNotification.localNotification({
				channelId: 'default-channel-id',
				title:
					remoteMessage.notification?.title ||
					'Notification',
				message:
					remoteMessage.notification?.body ||
					'You have received a new notification.',
			});
			console.log(
				'Foreground notification received:',
				remoteMessage,
			);
			/**Alert.alert(
				remoteMessage.notification?.title || 'Notification',
				remoteMessage.notification?.body ||
					'You have received a new notification.',
			);**/
			
		},
	);
	return unsubscribe;
}

export function onBackgroundNotification(): void {
	messaging().setBackgroundMessageHandler(
		async remoteMessage => {
			
			console.log(
				'Background notification received:',
				remoteMessage,
			);
		},
	);
}
export function onNotificationClick(): void {
	messaging().onNotificationOpenedApp(remoteMessage => {
		console.log(
			'Notification caused app to open from background state:',
			remoteMessage,
		);
	});
}

//NOTIFEE
/**
export async function setupNotifications() {
	if (Platform.OS === 'android') {
		console.log(
			'Setting up Android notification permissions',
		);
		await notifee.requestPermission();
	}
	await notifee.createChannel({
		id: 'default',
		name: 'Default Channel',
		importance: AndroidImportance.HIGH,
	});
}

export async function showNotification(
	title: string,
	body: string,
) {
	await notifee.displayNotification({
		title: title,
		body: body,
		android: {
			channelId: 'default',
		},
	});
}
*/

//REACT NATIVE PUSH NOTIFICATION
export const createChannel = () =>
	PushNotification.createChannel({
		channelId: 'default-channel-id', // (required)
		channelName: 'Default Channel', // (required)
		channelDescription: 'A default channel', // (optional) default: undefined.
	});

