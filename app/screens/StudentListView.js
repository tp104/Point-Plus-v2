import React, { useState, useEffect, useRef } from 'react';
import UserAvatar from 'react-native-user-avatar';
import { Alert, View, StyleSheet, SafeAreaView, FlatList, Text, TextInput } from 'react-native';
import { Card, Icon } from 'react-native-elements';

import * as SQLite from 'expo-sqlite';
//const db = SQLite.openDatabase('db.testDb');// returns Database object
const db = SQLite.openDatabase('pointplus1.db');// returns Database object

export default function StudentListView({ route, navigation }) {
    const tid = route.params.tid;
    const tname = route.params.tname;
    const data = route.params.studentData;

    // const data = [
    //     {
    //         id: 1,
    //         name: "Jim Halpert",
    //     },
    //     {
    //         id: 2,
    //         name: 'Dwight Schrute',
    //     },
    //     {
    //         id: 3,
    //         name: 'Michael Scott',
    //     },
    //     {
    //         id: 4,
    //         name: 'Pam Beasley',
    //     },
    //     {
    //         id: 5,
    //         name: 'James Bond',
    //     },
    //     {
    //         id: 6,
    //         name: 'Chandler Bing',
    //     },
    //     {
    //         id: 7,
    //         name: 'Andy Bernard',
    //     },
    //     {
    //         id: 8,
    //         name: 'John Peter',
    //     },
    //     {
    //         id: 9,
    //         name: 'John Wick',
    //     },
    //     {
    //         id: 10,
    //         name: 'David Wallace',
    //     }
    // ];


    const [dataFrom, setDataFrom] = useState(data);

    const getItem = (name) => {

        Alert.alert(name);

    }
    const item = ({ item }) => {
        return (
            <View >
                <Text style={{ fontSize: 34 }}>{item.student_name}</Text>
            </View>);
    };

    const ItemRender = ({ item }) => (
        <View style={styleSheet.item}>
            <UserAvatar size={30} name={item.student_name} style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                overflow: 'hidden'
            }} />
            <Text style={styleSheet.itemText} onPress={() => navigation.navigate('ViewActivityPoints', { sid: item.student_id, sname: item.student_name, tid: tid, tname: tname })}> {item.student_name}</Text>
        </View>
    );

    const ItemDivider = () => {
        return (
            <View
                style={{
                    marginTop: -10,
                    marginBottom: -10,
                    height: 1,
                    width: "100%",
                    backgroundColor: "#607D8B",
                }}
            />
        );
    }
    const searchName = (input) => {
        let data = dataFrom;
        let searchdata = data.filter((item) => {
            return item.student_name.toLowerCase().includes(input.toLowerCase());
        }); setDataFrom(searchdata)

    };
    const searchNames = (input) => {
        let data = dataFrom;
        let searchdata = data.filter((item) => {
            return item.student_name.toLowerCase().includes(input.toLowerCase());
        }); setDataFrom(searchdata)

    };
    const handleKeyPress = ({ nativeEvent: { key: keyValue } }) => {
        console.log(keyValue);
        if (keyValue === 'Backspace') {
            setDataFrom(data);
        }
    };

    return (
        <SafeAreaView style={styleSheet.MainContainer}>
            <View style={{ marginTop: 1, marginLeft: 3, borderColor: 'black', borderWidth: 1, width: 390, flexDirection: 'row', borderRadius: 20, backgroundColor: 'silver' }}>
                <Icon
                    name='search' type='font-awesome-5' size={25} style={{ marginLeft: 12, marginTop: 11 }} />
                <TextInput placeholder="Search name" onChangeText={(input) => {
                    searchName(input), searchNames(input);
                }
                } style={{ fontSize: 20, width: 350, padding: 10, borderRadius: 15, marginLeft: 5 }}
                    onKeyPress={handleKeyPress} />
            </View>
            <FlatList
                data={dataFrom}
                renderItem={({ item }) => <ItemRender item={item} />}
                keyExtractor={(item, index) => { index.toString(), item }}

                ItemSeparatorComponent={ItemDivider}
            />
        </SafeAreaView>
    );
}

const styleSheet = StyleSheet.create({

    MainContainer: {
        flex: 1,
        backgroundColor: 'white',
    },

    item: {
        padding: 20,
        marginTop: 5,
        fontSize: 20,
        flexDirection: "row"
    },

    itemText: {
        fontSize: 20,
        color: 'black',
        marginLeft: 15,
        marginTop: 10,
    }

});