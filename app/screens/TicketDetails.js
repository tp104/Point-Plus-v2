import React, { Component, useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Input,
    SafeAreaView, Pressable, Alert,
    Keyboard,
    ScrollView,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform, Image
} from 'react-native';
import { Card, Button, Title, Paragraph } from 'react-native-paper';

import Modal from "react-native-modal";

import * as SQLite from 'expo-sqlite';
//const db = SQLite.openDatabase('db.testDb');// returns Database object
const db = SQLite.openDatabase('pointplus1.db');// returns Database object

const TicketDetails = ({ route, navigation }) => {
    const data = route.params.data;
    //console.log(certificate);

    const [ticketremarks, setTicketRemarks] = useState(null);

    const closedate = new Date().toLocaleDateString("en-US");

    let closeTicket = () => {
        console.log("ticket remarks:", ticketremarks);
        if (ticketremarks == '') {
            alert('Please enter ticket remarks');
            setTicketRemarks(null)
            return;
        }
        if (!ticketremarks) {
            alert('Please enter ticket remarks');
            setTicketRemarks(null)
            return;
        }

        console.log("closing ticket:", ticketremarks, closedate);

        db.transaction(function (tx) {
            tx.executeSql(
                'DELETE FROM ticket_table WHERE ticket_id = ?',
                [parseInt(data.ticket_id)],
                (tx, results) => {
                    if (results.rowsAffected == 0) {
                        alert('Ticket Closure Failed!');
                        return;
                    }
                },
                (tx, errob) => {
                    console.log("DB error occured:");
                    console.log(errob);
                }
            );
        });

        db.transaction(function (tx) {
            tx.executeSql(
                'UPDATE certificate_table set ticket_active=? , ticket_closedate=?, ticket_remarks=? Where certificate_id =?',
                ['false', closedate, ticketremarks, parseInt(data.certificate_id)],
                (tx, results) => {
                    if (results.rowsAffected > 0) {
                        alert('Ticket closed!');
                        navigation.navigate('TeacherTicketsList', {
                            tid: data.teacher_ref
                        });


                    } else {
                        alert('Ticket Closure Failed!');
                        return;
                    }
                },
                (tx, errob) => {
                    console.log("DB error occured:");
                    console.log(errob);
                }
            );
        });


    };


    return (
        <View style={Styles.outcontainer}>
            <ScrollView>

                <Card style={Styles.text} mode='outlined'
                    onPress={() => { navigation.navigate('CertificateDetailsTeacher', { certificate: data, tid: data.teacher_ref }) }}>
                    <Card.Cover source={{ uri: data.certificate_uri }} />
                </Card>

                <Card style={[Styles.container, { marginTop: 20, backgroundColor: "#FEFBF6" }]}>
                    <Card.Content>
                        <View style={{ marginBottom: 10, width: 340, }}>
                            <Text style={{ fontWeight: 'bold' }}>Ticket raised by : {" " + data.student_name}</Text>
                            <Text >Ticket raised on : {" " + data.ticket_opendate}</Text>
                        </View>
                        <Text style={Styles.ticketbg}>Ticket discription: </Text>
                        <View style={Styles.textAreaContainer} >
                            <TextInput
                                style={[Styles.textArea, { backgroundColor: "#EEEEEE", color: 'black' }]}
                                value={data.ticket_discreption}
                                editable={false}
                                underlineColorAndroid="transparent"
                                numberOfLines={10}
                                multiline={true}
                            />
                        </View>
                    </Card.Content>
                </Card>

                <Card style={[Styles.ticketcontainer, { backgroundColor: "#FEFBF6" }]}>
                    <Card.Content>
                        <Text style={Styles.ticketbg}>Faculty remarks: </Text>
                        <View style={[Styles.textAreaContainer, { marginBottom: 30 }]} >
                            <TextInput
                                style={Styles.textArea}
                                value={ticketremarks}
                                onChangeText={(ticketremarks) => setTicketRemarks(ticketremarks)}
                                underlineColorAndroid="transparent"
                                placeholder="Enter Remarks"
                                placeholderTextColor="grey"
                                numberOfLines={10}
                                multiline={true}
                            />
                        </View>

                        <TouchableOpacity style={Styles.ticketbuttonsubmit} onPress={closeTicket} >
                            <Text style={Styles.ticketbtntext}>Close Ticket</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={Styles.ticketbuttonsubmit} onPress={() => navigation.navigate('TeacherTicketsList', {
                            tid: data.teacher_ref
                        })} >
                            <Text style={Styles.ticketbtntext}>Cancel</Text>
                        </TouchableOpacity>

                    </Card.Content>

                </Card>

            </ScrollView>
        </View>
    )
}
export default TicketDetails;

const Styles = StyleSheet.create({
    outcontainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    container: {
        alignContent: 'center',

    },
    bg: {
        backgroundColor: '#FEFBF6',
        borderRadius: 5,
        width: 350,
        height: 30,
        marginTop: 15,
        textAlign: 'center',
        fontWeight: 'bold',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,

    },
    bg1: {
        backgroundColor: '#FEFBF6',
        borderRadius: 5,
        width: 350,
        height: 85,
        marginTop: 15,
        paddingTop: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,

    },
    bg2: {
        backgroundColor: '#CEE5D0',
        borderRadius: 5,
        width: 350,
        height: 40,
        marginTop: 30,
        paddingTop: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,

    },
    ticketbtntext: {
        padding: 10,
        color: "#ffff",
        fontWeight: "bold",
    },
    ticketbutton: {
        alignSelf: 'stretch',
        alignItems: 'center',
        paddding: 20,
        backgroundColor: '#3173de',
        marginTop: 10,
        height: 40,
        marginBottom: 10,
    },
    ticketbuttonsubmit: {
        alignSelf: 'stretch',
        alignItems: 'center',
        paddding: 20,
        backgroundColor: '#3173de',
        height: 40,
        marginBottom: 10,
    },
    ticketcontainer: {
        alignContent: 'center',
        marginTop: 20,

    },
    ticketbg: {
        paddingTop: 5,
        textAlign: 'center',
        alignSelf: 'center',

    },
    input: {
        backgroundColor: '#FEFBF6',
        borderRadius: 5,
        padding: 10,
        height: 90,
        width: 230,
        alignSelf: 'center',
        margin: 40,

    },
    textAreaContainer: {
        // borderColor: "#C7C7CD",
        borderColor: 'black',
        borderWidth: 1,
        padding: 5,
        marginTop: 5,
        marginBottom: 15,
    },
    textArea: {
        height: 130,
        justifyContent: "flex-start",
        textAlignVertical: 'top',
    },
    tickethead: {
        marginBottom: 15,
        color: "#ffff",
        fontWeight: "bold",
        alignSelf: 'center',
        fontSize: 22,
    },
})