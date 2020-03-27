import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, AsyncStorage } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { v4 as uuid } from 'uuid';
import Constants from '../constants/Constants.js';

export default function App() {
	const BASE_BARCODE_API = "https://world.openfoodfacts.org/api/v0/product";
	const [hasPermission, setHasPermission] = useState(null);
	const [scanned, setScanned] = useState(false);

	useEffect(() => {
		(async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync();
			setHasPermission(status === 'granted');
		})();
	}, []);

		getBarcodeData = async barcode => {
		let endpoint = `${BASE_BARCODE_API}/${barcode}.json`;
		let response = await fetch(endpoint);
		let barcodeJSON = await response.json();
		if(barcodeJSON.status === 0){
			console.log(barcodeJSON)
			alert(`${barcode} returned no data`);
			return;
		}
		setItemInStorage(barcodeJSON.product);
	}

	setItemInStorage = async bc => {
		let item = {}
		item.id = uuid.v4();
		item.name = `${escapeXml(bc.brands)} - ${escapeXml(bc.product_name_en)}`;
		item.quantity = escapeXml(bc.quantity);
		AsyncStorage.setItem(item.id, JSON.stringify(item));
	}

	escapeXml = aString => {
		return aString.replace(/[<>'"]/g, c => {
			switch (c) {
				case '<': return '&lt;';
				case '>': return '&gt;';
				case '\'': return '&apos;';
				case '"': return '&quot;';
			}
		});
	}

	const handleBarCodeScanned = ({ type, data }) => {
		setScanned(true);
		//alert(`Bar code with type ${type} and data ${data} has been scanned!`);
		getBarcodeData(data);
	};

	if (hasPermission === null) {
		return <Text>Requesting for camera permission</Text>;
	}
	if (hasPermission === false) {
		return <Text>No access to camera</Text>;
	}

	return (
		<View
			style={{
				flex: 1,
				flexDirection: 'column',
				justifyContent: 'flex-end',
			}}>
			<BarCodeScanner
				onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
				style={StyleSheet.absoluteFillObject}
			/>

			{scanned && (
				<Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
			)}
		</View>
	);
}