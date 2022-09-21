import React, { Component, useState, useEffect } from 'react';
import {
    View,
    Text,
    Input,
    Button,
    SafeAreaView, Modal, Pressable, Alert,
    Keyboard,
    ScrollView,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform, Image
} from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Unorderedlist from 'react-native-unordered-list';
//import { TouchableOpacity } from "react-native-web";

import * as SQLite from 'expo-sqlite';
//const db = SQLite.openDatabase('db.testDb');// returns Database object
const db = SQLite.openDatabase('pointplus1.db');// returns Database object

const CertificateDetailsTeacher = ({ navigation, route }) => {
    const tid = route.params.tid;

    const certificate = route.params.certificate;
    console.log(certificate);
    const certificatestatus = certificate.certificate_status;
    const prevpoints = certificate.certificate_points;
    const [sname, setSname] = useState('');
    const [points, setPoints] = useState(certificate.certificate_points);
    useEffect(() => {

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM student_table where student_id = ?',
                [certificate.student_ref],
                (tx, results) => {
                    var name = "";
                    for (let i = 0; i < results.rows.length; ++i) {
                        console.log("reading: ", i);
                        name = results.rows.item(i).student_name;
                    }
                    setSname(name);
                }
            );
        });

    }, []);

    const RenderCertificateButton = () => {
        if (certificatestatus == 'pending') {
            return (
                <>
                    <TouchableOpacity style={Styles.button1} onPress={acceptCertificate} >
                        <Text style={Styles.btntext}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.button1} onPress={rejectCertificate} >
                        <Text style={Styles.btntext}>Reject</Text>
                    </TouchableOpacity>
                </>
            );
        }

        else if (certificatestatus == 'accepted') {
            return (
                <>
                    <TouchableOpacity style={Styles.button1} onPress={updateCertificate} >
                        <Text style={Styles.btntext}>Update</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.button1} >
                        <Text style={Styles.btntext}>Cancel</Text>
                    </TouchableOpacity>
                </>
            );
        }

        return null;
    }

    const acceptCertificate = () => {
        console.log(points, typeof points, isNaN(+points));
        if (isNaN(+points)) {
            alert("Please enter valid points!");
            return;
        }

        console.log("Hello");
        db.transaction(function (tx) {
            tx.executeSql(
                'UPDATE certificate_table set certificate_status=?, certificate_points=? Where certificate_id =?',
                ['accepted', parseInt(points), certificate.certificate_id],
                (tx, results) => {
                    if (results.rowsAffected > 0) {
                        alert(
                            'Certificate Accepted!'
                        );
                        navigation.navigate('TeacherDashboardScreen', {
                            tid: tid
                        });
                    } else alert('Certificate insertion Failed');
                },
                (tx, errob) => {
                    console.log("error occured:");
                    console.log(errob);
                }
            );
        });
    }

    const rejectCertificate = () => {
        db.transaction(function (tx) {
            tx.executeSql(
                'DELETE FROM certificate_table Where certificate_id =?',
                [certificate.certificate_id],
                (tx, results) => {
                    if (results.rowsAffected > 0) {
                        alert(
                            'Certificate Rejected!'
                        );
                        navigation.navigate('TeacherDashboardScreen', {
                            tid: tid
                        });
                    } else alert('Certificate rejection Failed');
                },
                (tx, errob) => {
                    console.log("error occured:");
                    console.log(errob);
                }
            );
        });
    }

    const updateCertificate = () => {
        console.log(points, typeof points, isNaN(+points));
        if (isNaN(+points)) {
            alert("Please enter valid points!");
            return;
        }

        console.log("Hello");
        db.transaction(function (tx) {
            tx.executeSql(
                'UPDATE certificate_table set certificate_points=? Where certificate_id =?',
                [parseInt(points), certificate.certificate_id],
                (tx, results) => {
                    if (results.rowsAffected > 0) {
                        alert(
                            'Certificate Updated!'
                        );
                        navigation.navigate('TeacherDashboardScreen', {
                            tid: tid
                        });
                    } else alert('Certificate updation Failed');
                },
                (tx, errob) => {
                    console.log("error occured:");
                    console.log(errob);
                }
            );
        });
    }

    return (
        <View>
            <ScrollView>
                <Card style={Styles.text}>
                    <Card.Cover source={{ uri: certificate.certificate_uri }} />
                </Card>
                <Card style={Styles.container}>
                    <Card.Content>
                        <Paragraph style={Styles.bg}>Student Name: {" " + sname} </Paragraph>
                        <Paragraph style={Styles.bg}>Certificate Name: {" " + certificate.certificate_name} </Paragraph>
                        <Paragraph style={Styles.bg}>Date:  {" " + certificate.certificate_date}</Paragraph>
                        <Paragraph style={Styles.bg}>Venue:  {" " + certificate.certificate_venue}</Paragraph>
                        <Paragraph style={Styles.bg}>Duration:  {" " + certificate.certificate_days + " days"}</Paragraph>
                        <Paragraph style={Styles.bg1}>
                            <Text>Activity Type:</Text>
                            <Text>{'\n -  '}{certificate.certificate_type}</Text>
                            <Text>{'\n ->  '}{certificate.certificate_subtype}</Text>
                        </Paragraph>

                        <View style={Styles.bg2}>
                            <Paragraph style={Styles.bg3} >Eligible Points :  {"" + certificate.certificate_points}  </Paragraph>
                            <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 3 }}>
                                <Text style={Styles.bg4}>Points : </Text>
                                <View style={Styles.inputView}>
                                    <TextInput
                                        style={Styles.TextInput}
                                        value={points}
                                        placeholder={prevpoints.toString()}
                                        placeholderTextColor="black"
                                        onChangeText={(points) => setPoints(points)}
                                    />
                                </View>
                            </View>

                        </View>
                    </Card.Content>
                </Card>
                <Card style={Styles.container}>
                    <Card.Content>

                        <RenderCertificateButton />

                    </Card.Content>
                </Card>
            </ScrollView>

        </View>
    )
}
export default CertificateDetailsTeacher;

const Styles = StyleSheet.create({
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
        marginTop: 5,
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
        backgroundColor: '#FEFBF6',
        color: '#FF5D5D',
        borderRadius: 5,
        fontSize: 18,
        width: 350,
        height: 108,
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
    bg3: {
        color: '#FF5D5D',
        fontSize: 17,
        marginTop: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    bg4: {
        color: '#3173de',
        fontSize: 18,
        marginTop: 5,
        textAlign: 'center',
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    btntext: {
        padding: 10,
        color: "#ffff",
        fontWeight: "bold",
    },
    button1: {
        alignSelf: 'stretch',
        alignItems: 'center',
        paddding: 20,
        backgroundColor: '#3173de',
        height: 40,
        marginBottom: 15,
    },
    inputView: {
        backgroundColor: "#ffffff",
        borderRadius: 10,
        width: "17%",
        height: 35,
        marginTop: 6,
        marginLeft: 5,
        borderWidth: 2,
        borderColor: '#3173de',

        alignItems: "center",
    },

    TextInput: {
        height: 20,
        flex: 1,
        padding: 3,
        marginLeft: 5,
        fontWeight: 'bold',
        fontSize: 16,
    },

})