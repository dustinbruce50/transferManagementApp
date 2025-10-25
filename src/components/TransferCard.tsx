import React from 'react';
import {
	Button,
	StyleSheet,
	Text,
	View,
} from 'react-native';

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
	buttonColor?: string;
}

const Row = ({
	label,
	value,
}: {
	label: string;
	value?: string | number;
}) => {
	if (value === null || value === undefined) return null;
	return (
		<View style={styles.row}>
			<Text
				style={styles.label}
				numberOfLines={1}
			>
				{label}:
			</Text>
			<Text
				style={styles.value}
				numberOfLines={1}
			>
				{String(value)}
			</Text>
		</View>
	);
};

const TransferCard: React.FC<TransferCardProps> = ({
	item,
	buttonTitle,
	buttonColor,
	onPressButton,
}) => {
	return (
		<View style={styles.card}>
			{/** 
      <Text>Item: {item.item}</Text>
      <Text>Requesting Unit: {item.receivingUnit}</Text>
      <Text>Sending Unit: {item.sendingUnit}</Text>
      <Text>Amount Requested: {item.amountReq} {item.amountReqType}</Text>
      {item.amountSent == null ? null : (
        <Text>
          {`Sent: ${item.amountSent} ${item.amountSentType}`}
        </Text>
      )}
      {item.cost == null ? null : <Text>{`Cost: ${item.cost}`}</Text>}
      {buttonTitle && onPressButton && (
        <Button title={buttonTitle} onPress={onPressButton} />
      )}
        
      */}
			<Row
				label="Item"
				value={item.item}
			/>
			<Row
				label="Requesting Unit"
				value={item.receivingUnit}
			/>
			<Row
				label="Sending Unit"
				value={item.sendingUnit}
			/>
			<Row
				label="Amount Requested"
				value={`${item.amountReq} ${item.amountReqType}`}
			/>
			{item.amountSent == null ? null : (
				<Row
					label="Sent"
					value={`${item.amountSent} ${item.amountSentType}`}
				/>
			)}
			{item.cost == null ? null : (
				<Row
					label="Cost"
					value={item.cost}
				/>
			)}
			{buttonTitle && onPressButton && (
				<Button
					title={buttonTitle}
					onPress={onPressButton}
					color={buttonColor}
				/>
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
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 3,
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	row: {
		flexDirection: 'row',
		alignItems: 'baseline',
		marginBottom: 5,
	},
	label: {
		width: 150,
		marginRight: 8,
		color: '#444',
		fontWeight: '600',
	},
	value: {
		flex: 1,
		color: '#111',
	},
});
export default TransferCard;
