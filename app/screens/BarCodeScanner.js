import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Button } from "react-native-elements";
import EnterDetails from "./EnterDetails";

export default function BarcodeScanner({ navigation }) {
    const [hasPermission, setHasPermission] = React.useState(false);
    const [scanData, setScanData] = React.useState();

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    if (!hasPermission) {
        return (
            <View style={styles.container}>
                <Text>Please grant camera permission to app.</Text>
            </View>
        )
    }

    const handleBarCodeScanned = ({ type, data }) => {
        setScanData(data);
        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
        console.log(`Data: ${data}`)
        console.log(`Type: ${type}`)
    }

    return (
        <View style={styles.container}>
            <BarCodeScanner
                style={StyleSheet.absoluteFillObject}
                onBarCodeScanned={scanData ? undefined : handleBarCodeScanned}
            />
            {scanData && <Button title='Scan Again?' onPress={() => setScanData(undefined)} />}
            {scanData && <Button title='Close' onPress={() => navigation.navigate(EnterDetails)} />}
            <StatusBar style="auto" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 0,
    }
})