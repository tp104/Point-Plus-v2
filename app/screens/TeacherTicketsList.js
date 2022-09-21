import React, { Component, useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView,
    TextInput,
    FlatList
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';


import * as SQLite from 'expo-sqlite';
//const db = SQLite.openDatabase('db.testDb');// returns Database object
const db = SQLite.openDatabase('pointplus1.db');// returns Database object

const TeacherTicketsList = ({ route, navigation }) => {
    const tid = route.params.tid;

    //Pass teacher dept and div (lots of re-write)
    // or take tid
    // join cert table and ticket table on cid, where cert.teacher_ref= tid

    const [data, setData] = useState([]);
    useFocusEffect(
        React.useCallback(() => {
            db.transaction((tx) => {
                tx.executeSql(
                    'select * from certificate_table INNER JOIN ticket_table ON certificate_table.certificate_id = ticket_table.certificate_ref INNER JOIN student_table ON certificate_table.student_ref = student_table.student_id WHERE certificate_table.teacher_ref = ?',
                    [tid],
                    (tx, results) => {
                        var temp = [];
                        for (let i = 0; i < results.rows.length; ++i) {
                            console.log("READING: no.", i, "-", results.rows.item(i).certificate_name);
                            temp.push(results.rows.item(i));
                        }
                        console.log(temp);
                        setData(temp);
                    }
                );
            });

        }, [])
    );

    return (
        <ScrollView>
            <View style={styles.container}>

                <View style={styles.inputContainer}>
                    <Text style={styles.headertxt}>Live Tickets</Text>
                </View>



                <FlatList
                    style={styles.notificationList}
                    data={data}
                    scrollEnabled={false}
                    keyExtractor={(item) => {
                        return item.ticket_id;
                    }}
                    renderItem={({ item }) => {

                        return (
                            <TouchableOpacity style={[styles.card, { borderColor: '#00bfff' }]}
                                onPress={() => { navigation.navigate('TicketDetails', { data: item }) }}
                            >
                                <View style={styles.cardContent}>
                                    <Image style={[styles.image, styles.imageContent]} source={{ uri: item.certificate_uri }} />
                                    <Text style={styles.name}>{item.certificate_name}</Text>
                                </View>
                                <View style={[styles.cardContent, styles.tagsContent]}>
                                    <Text style={styles.btnColor}>{'Student: ' + item.student_name}</Text>
                                    <Text style={styles.btnColor1}>{'Raised on: ' + item.ticket_opendate}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }} />

            </View>
        </ScrollView>
    )
}
export default TeacherTicketsList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    formContent: {
        flexDirection: 'row',
        marginTop: 30,
    },
    inputContainer: {
        // borderBottomColor: '#F5FCFF',
        borderColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        // borderBottomWidth: 1,
        borderWidth: 1,
        height: 10,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 10,
        marginTop: 40,
        marginBottom: 10,
    },
    icon: {
        width: 30,
        height: 30,
    },
    iconBtnSearch: {
        alignSelf: 'center'
    },
    inputs: {
        height: 45,
        marginLeft: 16,
        borderBottomColor: '#FFFFFF',
        flex: 1,
    },
    inputIcon: {
        marginLeft: 15,
        justifyContent: 'center'
    },
    notificationList: {
        marginTop: 20,
        padding: 10,
    },
    card: {
        borderRadius: 8,
        height: null,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 5,
        backgroundColor: '#FEFBF6',
        flexDirection: 'column',
        borderTopWidth: 40,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.7,
        shadowRadius: 5,
        elevation: 4,
    },
    cardContent: {
        flexDirection: 'row',
        marginLeft: 10,
    },
    imageContent: {
        marginTop: -40,
    },
    tagsContent: {
        marginTop: 5,
        flexWrap: 'wrap'
    },
    image: {
        width: 100,
        height: 80,
        borderRadius: 0,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 20,
        marginTop: -20,
        alignSelf: 'center'
    },
    btnColor: {
        padding: 10,
        fontWeight: 'bold',
        marginHorizontal: 3,

        marginTop: 5,
    },
    btnColor1: {
        padding: 10,
        fontWeight: 'bold',
        marginHorizontal: 3,
        backgroundColor: '#FBC5C5',
        marginTop: 5,
        marginBottom: 7,
        marginLeft: 20,
        borderRadius: 15,
        width: 150,

    },
    btnColor2: {
        padding: 10,
        fontWeight: 'bold',
        marginHorizontal: 3,
        backgroundColor: '#FE8C8C',
        marginTop: 5,
        marginLeft: 210,
        marginBottom: 10,
        borderRadius: 15,
        width: 50,

    },
    headertxt: {
        borderRadius: 8,
        height: 60,
        paddingVertical: 15,
        textAlign: 'center',
        marginVertical: 3,
        width: '100%',
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
        backgroundColor: '#C6EBC9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.7,
        shadowRadius: 5,
        elevation: 4,
    },
});  