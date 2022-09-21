import React, { useState } from 'react';

import { Dropdown } from 'react-native-element-dropdown';

import {
    View,
    Text,
    Input,
    Button,
    SafeAreaView,
    Keyboard,
    ScrollView,
    Alert,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform, Image
} from 'react-native';

import { useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('pointplus1.db');// returns Database object

const department = [
    { label1: 'IT', value1: 'IT' },
    { label1: 'CS', value1: 'CS' },
    { label1: 'Mechanical', value1: 'Mechanical' },
    { label1: 'Electrical and Electronics', value1: 'Electrical and Electronics' },
    { label1: 'Civil', value1: 'Civil' },
    { label1: 'AEI', value1: 'AEI' },

];

const sem = [
    { label2: 'S1', value2: 'S1' },
    { label2: 'S2', value2: 'S2' },
    { label2: 'S3', value2: 'S3' },
    { label2: 'S4', value2: 'S4' },
    { label2: 'S5', value2: 'S5' },
    { label2: 'S6', value2: 'S6' },
    { label2: 'S7', value2: 'S7' },
    { label2: 'S8', value2: 'S8' },
];

const div = [
    { label3: 'A', value3: 'A' },
    { label3: 'B', value3: 'B' },
    { label3: 'C', value3: 'C' },
];



const TeacherRegistrationScreen = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const [value1, setValue1] = useState(null);
    const [value2, setValue2] = useState(null);
    const [value3, setValue3] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const renderLabel = () => {
        if (value1 || isFocus) {
            return (
                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>

                </Text>
            );
        }
        return null;
    };

    let registerOnPress = () => {
        console.log(name, email, password, value1, value2, value3);

        if (!name) {
            alert('Please fill name');
            return;
        }
        if (!email) {
            alert('Please fill Email');
            return;
        }
        if (!password) {
            alert('Please fill password');
            return;
        }
        if (!value1) {
            alert('Please fill department');
            return;
        }
        if (!value2) {
            alert('Please fill semester');
            return;
        }
        if (!value3) {
            alert('Please fill division');
            return;
        }

        db.transaction(function (tx) {
            tx.executeSql(
                'INSERT INTO teacher_table (teacher_name, teacher_dept, teacher_sem, teacher_div, teacher_email, teacher_password) VALUES (?,?,?,?,?,?)',
                [name, value1, value2, value3, email, password],
                (tx, results) => {
                    if (results.rowsAffected > 0) {
                        Alert.alert(
                            'Success',
                            'You are Registered Successfully',
                            [
                                {
                                    text: 'Ok',
                                    onPress: () => { },
                                },
                            ],
                            { cancelable: false }
                        );
                    } else alert('Registration Failed');
                    setName('');
                    setValue1(null);
                    setValue2(null);
                    setValue3(null);
                    setPassword('');
                    setEmail('');
                }
            );
        });
    };

    return (

        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Text style={{ fontSize: 25, color: '#000080', paddingBottom: 10, marginBottom: 80, borderBottomColor: '#3173de', borderBottomWidth: 1, }}>FACULTY REGISTRATION</Text>
                <Text style={{ fontWeight: 'bold', marginTop: -30, marginBottom: 5 }}>Name: </Text>
                <View style={{ flexDirection: 'column', borderRadius: 15, borderColor: '#3173de', borderWidth: 2, height: 40, }}>

                    <TextInput style={styles.textinput} placeholder="Enter your Name"
                        value={name} onChangeText={(text) => setName(text)} />
                </View>

                <Text style={{ fontWeight: 'bold', marginTop: 20, marginBottom: 5 }}>Email: </Text>
                <View style={{ flexDirection: 'column', borderRadius: 15, borderColor: '#3173de', borderWidth: 2, height: 40, }}>

                    <TextInput style={styles.textinput} placeholder="Enter your Email"
                        value={email} onChangeText={(text) => setEmail(text)} />
                </View>

                <Text style={{ fontWeight: 'bold', marginTop: 20, marginBottom: 5 }}>Password: </Text>
                <View style={{ flexDirection: 'column', borderRadius: 15, borderColor: '#3173de', borderWidth: 2, height: 40 }}>

                    <TextInput style={styles.textinput} placeholder="Enter your Password" secureTextEntry={true}
                        value={password} onChangeText={(text) => setPassword(text)} />
                </View>

                <Text style={{ fontWeight: 'bold', marginTop: 20, marginBottom: 5 }}>Department: </Text>
                <View style={{ marginTop: -3 }}>
                    {renderLabel()}
                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: 'blue', borderWidth: 1 }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={department}
                        maxHeight={300}
                        labelField="label1"
                        valueField="value1"
                        placeholder={!isFocus ? 'Select Your Department' : '...'}
                        value={value1}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            setValue1(item.value1);
                            setIsFocus(false);
                        }}

                    />
                </View>

                <Text style={{ fontWeight: 'bold', marginTop: 20, marginBottom: 5 }}>Semester: </Text>
                <View style={{ marginTop: -3 }}>
                    {renderLabel()}
                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: 'blue', borderWidth: 1 }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={sem}
                        maxHeight={300}
                        labelField="label2"
                        valueField="value2"
                        placeholder={!isFocus ? 'Select Your Semester' : '...'}
                        value={value2}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            setValue2(item.value2);
                            setIsFocus(false);
                        }}

                    />
                </View>
                <Text style={{ fontWeight: 'bold', marginTop: 20, marginBottom: 5 }}>Division: </Text>
                <View style={{ marginTop: -3 }}>
                    {renderLabel()}
                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: 'blue', borderWidth: 1 }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={div}
                        maxHeight={300}
                        labelField="label3"
                        valueField="value3"
                        placeholder={!isFocus ? 'Select Your Division' : '...'}
                        value={value3}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            setValue3(item.value3);
                            setIsFocus(false);
                        }}
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={registerOnPress}>
                    <Text style={styles.btntext}>Sign Up</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>)
}

export default TeacherRegistrationScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingLeft: 60,
        paddingRight: 60,
        paddingTop: Platform.OS === "android" ? 20 : 0,
        alignSelf: 'stretch',
        borderRadius: 15,
        borderColor: '#3173de',
    },
    textinput: {
        alignSelf: 'stretch',
        width: '82%',
        height: 23,
        marginBottom: 30,
        color: 'black',
        paddingTop: 4,
        marginLeft: 20,



    },
    button: {
        alignSelf: 'stretch',
        alignItems: 'center',
        paddding: 20,
        backgroundColor: '#3173de',
        marginTop: 30,
        height: 50,
    }, btntext: {

        padding: 10,
        color: '#ffff',
        fontWeight: 'bold',
    }
});
