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
//import Icon from 'react-native-vector-icons/FontAwesome5';
import Unorderedlist from 'react-native-unordered-list';

import Modal from "react-native-modal";

import * as SQLite from 'expo-sqlite';
//const db = SQLite.openDatabase('db.testDb');// returns Database object
const db = SQLite.openDatabase('pointplus1.db');// returns Database object

const CertificateDetails = ({ route, navigation }) => {
    const certificate = route.params.certificate;
    //console.log(certificate);

    const RenderPointsLabel = () => {
        if (certificate.certificate_status == 'accepted') {
            return <Text style={Styles.bg2}>Points Awarded :  {" " + certificate.certificate_points}</Text>
        }

        else if (certificate.certificate_status == 'pending') {
            return <Text style={[Styles.bg2, { height: 60, backgroundColor: '#FE8C8C' }]}>Eligible Points :  {" " + certificate.certificate_points + '\nTeacher approval pending'}</Text>
        }
        return null;
    }

    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const [ticketdescription, setTicketDescription] = useState(null);
    const [ticketactive, setTicketActive] = useState(certificate.ticket_active);
    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM ticket_table where certificate_ref = ?',
                [certificate.certificate_id],
                (tx, results) => {
                    console.log(results)
                    if (results.rows.length > 0) {
                        console.log("Ticket desc found :", results.rows.item(0).ticket_discreption);
                        setTicketDescription(results.rows.item(0).ticket_discreption);
                    }
                }
            );
        });

    }, []);

    const opendate = new Date().toLocaleDateString("en-US");

    const RenderTicketButton = () => {
        if (ticketactive == 'false') {
            return (
                <>
                    <TouchableOpacity style={Styles.ticketbutton} onPress={toggleModal}>
                        <Text style={Styles.ticketbtntext}>Raise a Ticket</Text>
                    </TouchableOpacity>

                    <Modal isVisible={isModalVisible} onBackdropPress={cancelTicket} backdropTransitionInTiming={0} backdropTransitionOutTiming={0}>
                        <View style={{ flex: 1 }}>
                            <View style={{ backgroundColor: "#ffffff", marginHorizontal: 30, marginVertical: 100, paddingHorizontal: 30, paddingBottom: 25, paddingTop: 20, borderRadius: 10, }}>
                                <View style={Styles.tickethead}>
                                    <Text style={{ fontWeight: "600", }}>New Ticket</Text>
                                </View>
                                <View style={Styles.textAreaContainer} >
                                    <TextInput
                                        style={Styles.textArea}
                                        value={ticketdescription}
                                        onEndEditing={(value) => setTicketDescription(value.nativeEvent.text)}
                                        underlineColorAndroid="transparent"
                                        placeholder="Enter ticket description"
                                        placeholderTextColor="grey"
                                        numberOfLines={10}
                                        multiline={true}
                                    />
                                </View>

                                <TouchableOpacity style={Styles.ticketbuttonsubmit} onPress={submitTicket} >
                                    <Text style={Styles.ticketbtntext}>Submit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={Styles.ticketbuttonsubmit} onPress={cancelTicket}>
                                    <Text style={Styles.ticketbtntext}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </>
            );
        }

        else if (ticketactive == 'true') {
            return (
                <>
                    <TouchableOpacity style={[Styles.ticketbutton, { backgroundColor: "#D84D2A" }]} onPress={toggleModal}>
                        <Text style={[Styles.ticketbtntext,]}>Active Ticket</Text>
                    </TouchableOpacity>

                    <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(!isModalVisible)} backdropTransitionInTiming={0} backdropTransitionOutTiming={0}>
                        <View style={{ flex: 1 }}>
                            <View style={{ backgroundColor: "#ffffff", marginHorizontal: 30, marginVertical: 100, paddingHorizontal: 30, paddingBottom: 25, paddingTop: 20, borderRadius: 10, }}>
                                <View style={Styles.tickethead}>
                                    <Text style={{ fontWeight: "600", }}>Active Ticket</Text>
                                </View>
                                <View style={{ marginBottom: 10, }}>
                                    <Text >Ticket raised on: {"" + opendate}</Text>
                                </View>
                                <View style={Styles.textAreaContainer} >
                                    <TextInput
                                        style={[Styles.textArea, { backgroundColor: "#EEEEEE", color: 'black' }]}
                                        value={ticketdescription}
                                        editable={false}
                                        underlineColorAndroid="transparent"
                                        numberOfLines={10}
                                        multiline={true}
                                    />
                                </View>

                                <TouchableOpacity style={Styles.ticketbuttonsubmit} onPress={() => setModalVisible(!isModalVisible)}>
                                    <Text style={Styles.ticketbtntext}>Back</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </>
            );
        }

        return null;
    }

    let submitTicket = () => {
        console.log("ticket desc:", ticketdescription);
        if (ticketdescription == '') {
            setTicketDescription(null)
            return;
        }
        if (!ticketdescription) {
            alert('Please enter ticket description');
            setTicketDescription(null)
            return;
        }

        console.log("storing ticket:", ticketdescription, opendate);

        db.transaction(function (tx) {
            tx.executeSql(
                'INSERT INTO ticket_table (certificate_ref , ticket_discreption , ticket_opendate ) VALUES (?,?,?)',
                [parseInt(certificate.certificate_id), ticketdescription, opendate],
                (tx, results) => {
                    if (results.rowsAffected == 0) {
                        alert('Ticket Failed!');
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
                'UPDATE certificate_table set ticket_active=? Where certificate_id =?',
                ['true', certificate.certificate_id],
                (tx, results) => {
                    if (results.rowsAffected > 0) {
                        alert('Ticket raised: ' + ticketdescription);
                        setTicketActive('true');
                        setModalVisible(false);

                    } else alert('Ticket Failed!');
                },
                (tx, errob) => {
                    console.log("DB error occured:");
                    console.log(errob);
                }
            );
        });

        setModalVisible(false);
    };

    let cancelTicket = () => {
        setTicketDescription(null)
        console.log("ticket desc:", ticketdescription);
        setModalVisible(false);
    };

    return (
        <View style={Styles.outcontainer}>
            <ScrollView>
                <Card style={Styles.text}>

                    <Card.Cover source={{ uri: certificate.certificate_uri }} />

                </Card>
                <Card style={Styles.container}>
                    <Card.Content>
                        <Paragraph style={Styles.bg}>Name: {" " + certificate.certificate_name} </Paragraph>
                        <Paragraph style={Styles.bg}>Date:  {" " + certificate.certificate_date}</Paragraph>
                        <Paragraph style={Styles.bg}>Venue:  {" " + certificate.certificate_venue}</Paragraph>
                        <Paragraph style={Styles.bg}>Duration:  {" " + certificate.certificate_days + " days"}</Paragraph>
                        <Paragraph style={Styles.bg1}>
                            <Text>Activity Type:</Text>
                            <Text>{'\n -  '}{certificate.certificate_type}</Text>
                            <Text>{'\n ->  '}{certificate.certificate_subtype}</Text>
                        </Paragraph>

                        <RenderPointsLabel />
                        {/* <Paragraph style={Styles.bg2}>Points Awarded :  {" " + certificate.certificate_points}</Paragraph> */}


                    </Card.Content>

                </Card>


                <Card style={Styles.ticketcontainer}>
                    <Card.Content>
                        <Text style={Styles.ticketbg}>Previous ticket closed on: {" " + certificate.ticket_closedate}</Text>
                        <Text style={Styles.ticketbg}>Faculty remarks: {' "' + certificate.ticket_remarks + '"'}</Text>

                        <RenderTicketButton />

                    </Card.Content>

                </Card>

            </ScrollView>
        </View>
    )
}
export default CertificateDetails;

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
        borderColor: "#C7C7CD",
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