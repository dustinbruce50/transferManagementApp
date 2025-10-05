import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

interface Transfer {
  _id: string;
  item: string;
  cost?: number;
  amountReq: number;
  amountReqType: string;
  amountSent?: number;
  amountSentType: string;
  type: string;
  date: string;
  receivingUnit: string;
  sendingUnit: string;
}

interface TransferCardProps {
  item: Transfer;
  buttonTitle?: string;
  onPressButton?: () => void;
}

const TransferCard: React.FC<TransferCardProps> = ({
  item,
  buttonTitle,
  onPressButton,
}) => {
  return (
    <View style={styles.card}>
      <Text>Item: {item.item}</Text>
      <Text>Requesting Unit: {item.receivingUnit}</Text>
      <Text>Sending Unit: {item.sendingUnit}</Text>
      <Text>
        Amount Requested: {item.amountReq} {item.amountReqType}
      </Text>
      {item.amountSent == null ? null : (
        <Text>
          Sent: {item.amountSent} {item.amountSentType}{' '}
        </Text>
      )}
      {item.cost == null ? null : <Text>Cost: {item.cost} </Text>}
      {buttonTitle && onPressButton && (
        <Button title={buttonTitle} onPress={onPressButton} />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default TransferCard;
