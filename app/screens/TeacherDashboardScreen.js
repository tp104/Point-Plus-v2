import React, { Component, useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Platform, TouchableOpacity } from 'react-native';
import Dashboard from 'react-native-dashboard';
import { FontAwesome } from 'react-native-vector-icons';
import { Card, Icon } from 'react-native-elements';
import * as Progress from 'react-native-progress';
import { useFocusEffect } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('pointplus1.db');// returns Database object


const TeacherDashboardScreen = ({ route, navigation }) => {

    const tid = route.params.tid;

    console.log('logged in teacher:', tid);

    const [teacherData, setTeacherData] = useState([]);
    const [studentData, setStudentData] = useState([]);

    useFocusEffect(
        React.useCallback(() => {

            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM teacher_table where teacher_id = ?',
                    [tid],
                    (tx, results) => {
                        var len = results.rows.length;
                        if (len > 0) {
                            let res = results.rows.item(0);
                            console.log('found teacher data: ', res);
                            setTeacherData(res);

                        } else {
                            alert('No teacher data found');

                        }
                    }
                );
            });


            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM student_table',
                    [],
                    (tx, results) => {
                        var temp = [];
                        for (let i = 0; i < results.rows.length; ++i) {
                            console.log("reading: ", i);
                            temp.push(results.rows.item(i));
                        }
                        console.log(temp);
                        setStudentData(temp);
                    }
                );
            });

        }, [])
    );

    // useEffect(() => {

    //     db.transaction((tx) => {
    //         tx.executeSql(
    //             'SELECT * FROM student_table',
    //             [],
    //             (tx, results) => {
    //                 var temp = [];
    //                 for (let i = 0; i < results.rows.length; ++i) {
    //                     console.log("reading: ", i);
    //                     temp.push(results.rows.item(i));
    //                 }
    //                 console.log(temp);
    //                 setStudentData(temp);
    //             }
    //         );
    //     });
    // }, []);

    return (

        <View style={styles.container}>

            <View style={{ marginTop: 20 }}>
                <Card >
                    <View>
                        <Card.Title style={{ textAlign: 'center', }}>{'Welcome, ' + teacherData.teacher_name}</Card.Title>
                    </View>
                    <Text style={{ marginTop: 5 }}>{'Class: ' + teacherData.teacher_sem + ' ' + teacherData.teacher_dept + ' ' + teacherData.teacher_div}</Text>
                    <View style={{ marginTop: 15 }}><Text>Overall Activity Point Progress</Text>
                        <Progress.Bar progress={0.5} width={300} height={18} showsText={true} color={'#000080'} borderRadius={10} borderColor={'black'} marginTop={13} marginBottom={10} />
                    </View>
                </Card>
            </View>

            <View style={{ flexDirection: 'row', marginLeft: 0, marginTop: 20 }}>
                <TouchableOpacity activeOpacity={0.96} onPress={() => navigation.navigate('ViewCertificatesTeacher', {
                    tid: route.params.tid
                })}><Card containerStyle={{ width: 170, height: 170, borderRadius: 15, backgroundColor: 'silver' }}>
                        <Icon
                            name='award' type='font-awesome-5' size={40} />
                        <Card.Title style={{ marginTop: 20, fontSize: 18, color: 'white' }}>Assign Points</Card.Title>
                    </Card>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.96} style={{ color: 'white' }} onPress={() => navigation.navigate('FilterSortTeacher')}>
                    <Card containerStyle={{ width: 170, height: 170, borderRadius: 15, backgroundColor: 'silver' }}>
                        <Icon
                            name='filter' type='font-awesome-5' size={40} />
                        <Card.Title style={{ marginTop: 20, fontSize: 18, color: 'white' }}>Filter Certificates</Card.Title></Card></TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', marginLeft: 0, marginTop: 20 }}>
                <TouchableOpacity activeOpacity={0.96} onPress={() => navigation.navigate('StudentListView', { studentData: studentData, tid: tid })}>
                    <Card containerStyle={{ width: 170, height: 170, borderRadius: 15, backgroundColor: 'silver' }}>
                        <Icon
                            name='star' type='font-awesome-5' size={45} />
                        <Card.Title style={{ marginTop: 20, fontSize: 18, color: 'white' }}>Student Performance Review</Card.Title>
                    </Card>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.96} style={{ color: 'white' }} onPress={() => navigation.navigate('TeacherTicketsList', {
                    tid: route.params.tid
                })}>
                    <Card containerStyle={{ width: 170, height: 170, borderRadius: 15, backgroundColor: 'silver' }}>
                        <Icon
                            name='exclamation' type='font-awesome-5' size={40} />
                        <Card.Title style={{ marginTop: 20, fontSize: 18, color: 'white' }}>Student Tickets</Card.Title></Card></TouchableOpacity>
            </View>

        </View>

    );
}

export default TeacherDashboardScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',

    },
});