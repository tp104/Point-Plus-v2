import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Platform, TouchableOpacity, Animated, ScrollView } from 'react-native';
import Dashboard from 'react-native-dashboard';
import { FontAwesome } from 'react-native-vector-icons';
import { Card, Icon } from 'react-native-elements';
import { useState, useEffect, useRef } from 'react'
import { ProgressBar } from '@react-native-community/progress-bar-android';
import * as Progress from 'react-native-progress';

import * as SQLite from 'expo-sqlite';
//const db = SQLite.openDatabase('db.testDb');// returns Database object
const db = SQLite.openDatabase('pointplus1.db');// returns Database object

const ViewActivityPoints = ({ route, navigation }) => {

    const sid = route.params.sid;
    const sname = route.params.sname;
    const tid = route.params.tid;
    const tname = route.params.tname;

    const [totalpoints, setTotalpoints] = useState(0);
    const [professionalpoints, setProfessionalpoints] = useState(0);
    const [sportspoints, setSportspoints] = useState(0);
    const [culturalpoints, setCulturalpoints] = useState(0);

    const [data, setData] = useState([]);
    useEffect(() => {

        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM certificate_table where student_ref = ?',
                [sid],
                (tx, results) => {
                    var totpts = 0;
                    var sportspts = 0;
                    var culturalpts = 0;
                    var professionalpts = 0;
                    var temp = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        console.log("reading: ", i);
                        if (results.rows.item(i).certificate_status == "accepted") {
                            temp.push(results.rows.item(i));
                            totpts += results.rows.item(i).certificate_points;
                            if (results.rows.item(i).certificate_type == "Sports & Games")
                                sportspts += results.rows.item(i).certificate_points;
                            else if (results.rows.item(i).certificate_type == "Cultural Activities")
                                culturalpts += results.rows.item(i).certificate_points;
                            else if (results.rows.item(i).certificate_type == "Professional Self Initiatives")
                                professionalpts += results.rows.item(i).certificate_points;
                        }
                    }
                    console.log(totpts);
                    setTotalpoints(totpts);
                    setSportspoints(sportspts);
                    setCulturalpoints(culturalpts);
                    setProfessionalpoints(professionalpts);
                    console.log(temp);
                    setData(temp);
                }
            );
        });


    }, []);




    return (
        <ScrollView>
            <View style={styles.container}>
                <View >
                    <Card containerStyle={{
                        borderRadius: 8,
                        height: 220,
                        paddingTop: 30,
                        textAlign: 'center',
                        paddingBottom: 10,
                        marginTop: 10,
                        width: '90%',
                        fontSize: 18,
                        fontWeight: 'bold',
                        alignSelf: 'center',
                        backgroundColor: '#C6EBC9',
                        marginBottom: 15,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.7,
                        shadowRadius: 5,
                        elevation: 4,
                    }}>
                        <View>
                            <Card.Image style={{ height: 90, width: 90, alignSelf: 'center', marginLeft: 118, marginBottom: 15 }} source={require('../assets/graduated.png')} />
                            <Text style={styles.headertxt}>{'Name: ' + sname}</Text>
                            <Text style={styles.headertxt}>{'Class teacher: ' + tname}</Text>
                            <Text style={styles.headertxt}>{'Totalt points: ' + totalpoints + '/100'}</Text>
                        </View>
                    </Card>
                </View>


                <View style={{ marginTop: -10 }}>
                    <Card containerStyle={{ height: 250, borderRadius: 20, marginBottom: 10 }}>


                        <View >
                            <Text style={{ marginTop: 20, marginBottom: -10 }}>{'Sports & Games:  + ' + sportspoints}</Text>
                            <View style={styles.progressBar}>
                                <Progress.Bar progress={sportspoints / 100} width={200} height={10} showsText={true} color={'red'} borderRadius={20} borderColor={'white'} />
                            </View>

                            <Text style={{ marginTop: 20, marginBottom: -10 }}>{'Cultural Activities:  + ' + culturalpoints}</Text>
                            <View style={styles.progressBar}>
                                <Progress.Bar progress={culturalpoints / 100} width={200} height={10} color={'green'} borderColor={'white'} borderRadius={20} />
                            </View>

                            <Text style={{ marginTop: 20, marginBottom: -10 }}>{'Professional Self Initiatives:  + ' + professionalpoints}</Text>
                            <View style={styles.progressBar}>
                                <Progress.Bar progress={professionalpoints / 100} width={200} height={10} color={'blue'} borderColor={'white'} borderRadius={20} />
                            </View>
                        </View>

                    </Card></View>

                <View style={{ marginTop: -10 }}>
                    <Card containerStyle={{ height: 250, borderRadius: 20, marginBottom: 20 }}>


                        <View >

                            <View style={{ marginTop: 35, marginLeft: 90, }}>
                                {/* <Text style={{ marginBottom: 20, marginLeft: -20, fontWeight: 'bold' }}>Progress:</Text> */}
                                <Progress.Circle size={150} showsText={true} thickness={7} progress={totalpoints / 100} />
                            </View>

                        </View>

                    </Card></View>
            </View>
        </ScrollView>

    );
}

export default ViewActivityPoints;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',

    },
    progressBar: {
        height: 10,
        flexDirection: "row",
        width: '100%',

        backgroundColor: 'white',



        marginTop: 20
    },
    headertxt: {
        textAlign: 'center',
        width: '100%',
        fontWeight: 'bold',
        alignSelf: 'center',

    },
});
