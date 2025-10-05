import {StackNavigationProp} from '@react-navigation/stack';

export type RootStackParamList = {
  Login: undefined;
  OperatorScreen: undefined;
  DriverScreen: undefined;
  RegisterScreen: undefined;
  Home: undefined;
  OperatorTabs: undefined,
  DriverTabs: undefined,
};

export type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

export type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'RegisterScreen'
>;
export type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

export interface Transfer {
  _id: string;
  item: string;
  cost: number;
  amountReq: number;
  amountReqType: string;
  amountSent: number;
  amountSentType: string;
  receivingUnit: string;
  sendingUnit: string;
  type: string;
  date: string;
}