import React, { Component, useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Platform, TouchableOpacity } from 'react-native';
//import Dashboard from 'react-native-dashboard';
//import { FontAwesome } from 'react-native-vector-icons';
import { Card, Icon } from 'react-native-elements';
import * as Progress from 'react-native-progress';

import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('pointplus1.db');// returns Database object

const StudentDashboard = ({ route, navigation }) => {
    const sid = route.params.sid;
    const name = route.params.name;
    const email = route.params.email;
    const department = route.params.department;
    const sem = route.params.sem;
    const div = route.params.div;
    const [teacher_id, setTeacherid] = useState("");
    const [teacher_name, setTeachername] = useState("");
    const [totalpoints, setTotalpoints] = useState(0);

    useEffect(() => {

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM certificate_table where student_ref = ?',
                [sid],
                (tx, results) => {
                    var totpts = 0;
                    var temp = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        console.log("reading: ", i);
                        temp.push(results.rows.item(i));
                        totpts += results.rows.item(i).certificate_points;
                    }
                    console.log(totpts);
                    setTotalpoints(totpts);
                }
            );
        });


    }, []);

    db.transaction((tx) => {
        tx.executeSql(
            'SELECT * FROM teacher_table where teacher_dept = ? AND teacher_sem = ? AND teacher_div = ?',
            [department, sem, div],
            (tx, results) => {
                var len = results.rows.length;
                if (len > 0) {
                    let res = results.rows.item(0);
                    setTeacherid(res.teacher_id);
                    setTeachername(res.teacher_name);
                    console.log('teacher found:', res);

                } else {
                    alert('No teacher found');

                }
            }
        );
    });

    console.log('logged in:', sid, name, email, department, sem, div, teacher_name);
    const card = ({ name }) => console.log('Card: ' + name);

    return (

        <View style={styles.container}>

            <View style={{ marginTop: 30 }}>
                <Card containerStyle={{ height: 180 }}>
                    <View>
                        <Card.Title style={{ textAlign: 'center', }}>{'Welcome, ' + name}</Card.Title>
                    </View>
                    <View style={{ marginTop: 35 }}>
                        <Text style={{ marginTop: -30 }}>{'Activity Point Progress                                      ' + totalpoints + ' %'}</Text>
                        <Progress.Bar progress={totalpoints / 100} width={310} height={18} marginLeft={7} showsText={true} color={'#000080'} borderRadius={10} borderColor={'black'} marginTop={10} />
                        <Text style={{ marginTop: 15 }}>{'Class: ' + sem + ' ' + department + ' ' + div}</Text>
                        <Text style={{ marginTop: 7 }}>{'Class Teacher: ' + teacher_name}</Text>
                    </View>
                </Card>
            </View>

            <View style={{ flexDirection: 'row', marginLeft: 0, marginTop: 30 }}>
                <TouchableOpacity activeOpacity={0.96} onPress={() => navigation.navigate('EnterDetails', { sname: name, sid: sid, tname: teacher_name, tid: teacher_id })}>
                    <Card containerStyle={{ width: 170, height: 170, borderRadius: 15, backgroundColor: '#3395ff' }}>
                        <Icon
                            name='upload' type='font-awesome-5' size={40} />
                        <Card.Title style={{ marginTop: 20, fontSize: 18, color: '#4f4e4c' }}>Upload Certificates</Card.Title></Card></TouchableOpacity>
                <TouchableOpacity activeOpacity={0.96} onPress={() => navigation.navigate('ViewCertificates', { sid: sid, sname: name, tid: teacher_id, tname: teacher_name })} style={{ color: 'white' }}><Card containerStyle={{ width: 170, height: 170, borderRadius: 15, backgroundColor: '#3395ff' }}>
                    <Icon
                        name='list' type='font-awesome-5' size={40} />
                    <Card.Title style={{ marginTop: 20, fontSize: 18, color: '#4f4e4c' }}>View Certificates</Card.Title></Card></TouchableOpacity></View>
            <View style={{ flexDirection: 'row', marginLeft: 100, marginTop: 20 }}>

                <TouchableOpacity activeOpacity={0.96} onPress={() => navigation.navigate('ViewActivityPoints', { sid: sid, sname: name, tid: teacher_id, tname: teacher_name })}><Card containerStyle={{ width: 170, height: 170, borderRadius: 15, backgroundColor: '#3395ff' }}>
                    <Icon
                        name='trophy' type='font-awesome-5' size={40} iconStyle={{ color: '#d1b202' }} />
                    <Card.Title style={{ marginTop: 20, fontSize: 18, color: '#4f4e4c' }}>View Activity Points</Card.Title></Card></TouchableOpacity></View>
        </View>

    );
}

export default StudentDashboard;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',

    },
});