import DateTimePicker from '@react-native-community/datetimepicker';
import { Children, useState, useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import React from 'react';
import { Card, Icon } from 'react-native-elements';

import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { BarCodeScanner } from "expo-barcode-scanner";

import * as SQLite from 'expo-sqlite';
//const db = SQLite.openDatabase('db.testDb');// returns Database object
const db = SQLite.openDatabase('pointplus1.db');// returns Database object

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
//import { child } from 'fontawesome';

const data = [
  { label1: 'Sports & Games', value: 'Sports & Games' },
  { label1: 'Cultural Activities', value: 'Cultural Activities' },
  { label1: 'Professional Self Initiatives', value: 'Professional Self Initiatives' }
];
const sports = [
  { label1: 'Sports', value: 'Sports' },
  { label1: 'Games', value: 'Games' },
];
const cultural = [
  { label1: 'Music', value: 'Music' },
  { label1: 'Performing Arts', value: 'Performing Arts' },
  { label1: 'Literary Arts', value: 'Literary Arts' }
];
const professional = [
  { label1: 'MOOC', value: 'MOOC' },
  { label1: 'Industrial Training/ Internship', value: 'Industrial Training/ Internship' },
  { label1: 'Industrial/ Exhibition visits', value: 'Industrial/ Exhibition visits' }
];

let subdef = [
  { label1: 'Please select main category', value: null }
];

let activitypos = [
  { label1: 'Please select main and sub category', value: null }
];


const EnterDetails = ({ route, navigation }) => {
  const student_id = route.params.sid;
  const teacher_id = route.params.tid;
  const student_name = route.params.sname;
  const teacher_name = route.params.tname;

  const [name, setName] = useState(null);
  const [venue, setVenue] = useState(null);
  const [days, setDays] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [mydate, setDate] = useState(new Date());
  const [displaymode, setMode] = useState('date');
  const [isDisplayDate, setShow] = useState(false);
  const changeSelectedDate = (event, selectedDate) => {
    const currentDate = selectedDate || mydate;
    setDate(currentDate);
    setShow(false);
  };
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };
  const displayDatepicker = () => {
    showMode('date');
  };

  const [pickedImagePath, setPickedImagePath] = useState('');
  const showImagePicker = async () => {
    setModalVisible(!modalVisible);
    // Ask the user for the permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
      console.log(result.uri);
    }
  };

  // This function is triggered when the "Open camera" button pressed
  const openCamera = async () => {
    setModalVisible(!modalVisible);
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
    });

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
      console.log(result.uri);
    }
  };

  const [sub, setSub] = useState([
    { label1: 'Please select main category', value: null }
  ]);

  const [value1, setValue1] = useState(null);
  const [value3, setValue3] = useState(null);

  const [pos, setPos] = useState('NA');

  const [isFocus, setIsFocus] = useState(false);

  const [statusAndAlert, setStatusAndAlert] = useState({ status: 'accepted', alert: 'Certificate Accepted!' }); //accepted | rejected | pending | ticket
  const [points, setPoints] = useState(0);


  useEffect(() => {
    if (value1 == null) {
      setSub(subdef);
    }
    else if (value1 == 'Sports & Games') {
      setSub(sports);
    }
    else if (value1 == 'Cultural Activities') {
      setSub(cultural);
    }
    else if (value1 == 'Professional Self Initiatives') {
      setSub(professional);
    }
    else {
      setSub(subdef);
    }

  }, [value1]);

  useEffect(() => {
    if (value3 == null) {
      setPoints(0);
    }
    else if (value3 == 'Sports') {
      setPoints(8);
    }
    else if (value3 == 'Games') {
      setPoints(8);
    }
    else if (value3 == 'Music') {
      setPoints(8);
    }
    else if (value3 == 'Performing Arts') {
      setPoints(8);
    }
    else if (value3 == 'Literary Arts') {
      setPoints(8);
    }
    else if (value3 == 'MOOC') {
      setPoints(50);
    }
    else if (value3 == 'Industrial Training/ Internship') {
      setPoints(20);
    }
    else if (value3 == 'Industrial/ Exhibition visits') {
      setPoints(5);
    }
    else {
      setPoints(0);
    }

  }, [value3]);

  // for Position dropdown
  // useEffect(() => {
  //   if (value1 == 'Sports & Games') {
  //     setSub(sports);
  //   }
  //   else if (value1 == 'Cultural Activities') {
  //     setSub(cultural);
  //   }
  //   else {
  //     setSub(subdef);
  //   }

  // }, [value1]);

  useEffect(() => {
    if (points > 20) {
      setStatusAndAlert({ status: 'pending', alert: 'Certificate will have to be verified by class teacher as the eligible points is >20' });
    }
    else {
      setStatusAndAlert({ status: 'accepted', alert: 'Certificate Accepted!' });
    }

  }, [points]);

  const renderLabel = () => {
    if (value1 || isFocus) {
      return (
        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>

        </Text>
      );
    }
    return null;
  };

  const BarCodeScannerCall = () => {
    navigation.navigate('BarCodeScanner');
  }

  const ImageSelectorCall = () => {
    navigation.navigate('ImageSelector');
  }

  const onPress = (screenNumber) => {
    setModalVisible(!modalVisible);
    screenNumber == 0 ? BarCodeScannerCall() : ImageSelectorCall();  //screenNumber = 0 for Barcode, 1 for imageSelector
  }

  let addCertificate = () => {
    console.log("certificate i/p:", name, venue, days, mydate, value1, value3, student_name, teacher_name, pickedImagePath);
    if (pickedImagePath == '') {
      alert('Please select certificate image');
      return;
    }
    if (!name) {
      alert('Please fill certificate name');
      return;
    }
    if (!venue) {
      alert('Please fill venue');
      return;
    }
    if (!days) {
      alert('Please fill number of days');
      return;
    }
    if (!mydate) {
      alert('Please select start date');
      return;
    }
    if (!value1) {
      alert('Please select Activity type');
      return;
    }
    if (!value3) {
      alert('Please select Activity-sub type');
      return;
    }

    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO certificate_table (student_ref, teacher_ref, certificate_name, certificate_uri, certificate_venue, certificate_days, certificate_date, certificate_type, certificate_subtype, certificate_status, certificate_points, ticket_closedate, ticket_remarks, ticket_active) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [parseInt(student_id), parseInt(teacher_id), name, pickedImagePath, venue, days, mydate.toLocaleDateString("en-US"), value1, value3, statusAndAlert.status, parseInt(points), '', '', 'false'],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            alert(
              statusAndAlert.alert
            );
          } else alert('Certificate insertion Failed');
          setPickedImagePath('');
          setName(null);
          setDays(null);
          setVenue(null);
          setValue1(null);
          setValue3(null);
          setPoints(0);
        },
        (tx, errob) => {
          console.log("error occured:");
          console.log(errob);
        }
      );
    });

  };

  const RenderPointsLabel = () => {
    if (points > 20) {
      return <Text style={styles.pointstxt1}>{'Eligible points: ' + points + '\nRequires teacher approval'}</Text>
    }

    else if (points <= 20) {
      return <Text style={styles.pointstxt}>{'Eligible points: ' + points}</Text>
    }
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.centeredView}>
          <TouchableOpacity>
            <Card
              containerStyle={{
                width: 300,
                height: 170,
                borderRadius: 15,
                backgroundColor: "#e8e7e6",
                marginBottom: 50,
              }}
            >
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <View style={{ flexDirection: "row", marginTop: 50 }}>
                      {/* onPress would disable modal and open camera */}
                      <TouchableOpacity onPress={openCamera}>
                        <Card
                          containerStyle={{
                            width: 70,
                            height: 70,
                            borderRadius: 15,
                            backgroundColor: "#e8e7e6",
                          }}
                        >
                          <Icon name="camera" type="font-awesome-5" size={40} />
                        </Card>
                      </TouchableOpacity>

                      {/* onPress would disable modal and open image selector */}
                      <TouchableOpacity
                        onPress={showImagePicker}
                        style={{ color: "white", marginLeft: 50 }}
                      >
                        <Card
                          containerStyle={{
                            width: 70,
                            height: 70,
                            borderRadius: 15,
                            backgroundColor: "#e8e7e6",
                          }}
                        >
                          <Icon
                            name="file"
                            type="font-awesome-5"
                            size={38}
                            iconStyle={{ color: "blue" }}
                          />
                        </Card>
                      </TouchableOpacity>
                    </View>

                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Text style={styles.textStyle}>Close</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>

              <View>
                {pickedImagePath !== "" ? (
                  <Image
                    source={{ uri: pickedImagePath }}
                    style={styles.image}
                  />
                ) : (
                  <Pressable
                    style={[styles.button, styles.buttonOpen]}
                    onPress={() => setModalVisible(true)}
                  >
                    <Icon name="plus-circle" type="font-awesome-5" size={40} />
                  </Pressable>
                )}
              </View>
            </Card>
          </TouchableOpacity>
        </View>
        <View>
          <Button
            // style={{ marginTop: -35 }}
            title="SCAN QR"
            onPress={() => navigation.navigate(BarCodeScanner)}
          />
          <StatusBar style="auto" />
        </View>
        <Text style={{ fontWeight: "bold", marginTop: 20, marginBottom: 6 }}>Name: </Text>
        <View
          style={{
            flexDirection: "column",
            borderRadius: 15,
            borderColor: "#3173de",
            borderWidth: 2,
            height: 40,
          }}
        >
          <TextInput style={styles.textinput}
            value={name}
            placeholder="Certificate name"
            placeholderTextColor="grey"
            onChangeText={(name) => setName(name)} />
        </View>

        <Text style={{ fontWeight: "bold", marginTop: 20, marginBottom: 6 }}>Venue: </Text>
        <View
          style={{
            flexDirection: "column",
            borderRadius: 15,
            borderColor: "#3173de",
            borderWidth: 2,
            height: 40,
          }}
        >
          <TextInput style={styles.textinput}
            value={venue}
            placeholder="Venue"
            placeholderTextColor="grey"
            onChangeText={(venue) => setVenue(venue)} />
        </View>

        <Text style={{ fontWeight: "bold", marginTop: 20, marginBottom: 6 }}>
          Duration:{" "}
        </Text>
        <View
          style={{
            flexDirection: "column",
            borderRadius: 15,
            borderColor: "#3173de",
            borderWidth: 2,
            height: 40,
          }}
        >
          <TextInput style={styles.textinput}
            value={days}
            placeholder="Number of days"
            placeholderTextColor="grey"
            onChangeText={(days) => setDays(days)} />
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold", marginTop: 30 }}>Date: </Text>

          <TouchableOpacity onPress={displayDatepicker}>
            <Icon
              name="calendar-alt"
              type="font-awesome-5"
              size={40}
              iconStyle={{ marginTop: 20, marginLeft: 10 }}
            />
          </TouchableOpacity>
          <Text style={{ marginTop: 30, marginLeft: 30 }}>{String(mydate.toLocaleDateString("en-US"))}</Text>
          {isDisplayDate && (
            <DateTimePicker
              testID="dateTimePicker"
              value={mydate}
              mode={displaymode}
              is24Hour={true}
              display="default"
              onChange={changeSelectedDate}
            />
          )}
          {/* <Text style={{ fontWeight: 'bold', marginTop: 20 }}>{mydate.format()}</Text> */}
        </View>


        <View style={{ marginTop: 100 }}>
          <Text style={{ fontWeight: 'bold', marginTop: -50 }}> Select Activity Type:  </Text>
          {/* {renderLabel()} */}
          <Dropdown
            style={[styles.dropdown, isFocus && { borderWidth: 1 }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={data}
            maxHeight={300}
            labelField="label1"
            valueField="value"
            placeholder={!isFocus ? 'Select Activity Type' : '...'}
            value={value1}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setValue1(item.value);
              setValue3(null);
              setIsFocus(false);
            }}

          />
        </View>

        <View style={{ marginTop: 80 }}>
          <Text style={{ fontWeight: 'bold', marginTop: -50 }}> Select Activity Sub Type:  </Text>
          {/* {renderLabel()} */}
          <Dropdown
            style={[styles.dropdown, isFocus && { borderWidth: 1 }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={sub}
            maxHeight={300}
            labelField="label1"
            valueField="value"
            placeholder={!isFocus ? 'Select Activity Sub Type' : '...'}
            value={value3}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setValue3(item.value);
              setIsFocus(false);
            }}
          />
        </View>

        <View>
          <RenderPointsLabel />
        </View>

        {/* <Text style={styles.pointstxt}>{'Eligible points: ' + points}</Text> */}

        <TouchableOpacity style={styles.button1} onPress={addCertificate}>
          <Text style={styles.btntext}>Add Certificate</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>)
}

export default EnterDetails;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
    paddingLeft: 60,
    paddingRight: 60,
    // paddingTop: Platform.OS === "android" ? 20 : 0,
    alignSelf: "stretch",
    borderRadius: 15,
    borderColor: "#3173de",
  },
  image: {
    width: 300,
    height: 170,
    borderRadius: 10,
    // width: '100%',
    // height:'100%',
    justifyContent: "center",
    resizeMode: "center",
  },
  imageContainer: {
    padding: 0,
    margin: 0,
  },
  textinput: {
    alignSelf: "stretch",
    width: "82%",
    height: 23,
    marginBottom: 30,

    color: "black",
    paddingTop: 4,
    marginLeft: 20,
  },
  button: {
    alignSelf: "stretch",
    alignItems: "center",
    paddding: 20,
    backgroundColor: "#3173de",
    marginTop: 30,
    height: 50,
  },
  btntext: {
    padding: 10,
    color: "#ffff",
    fontWeight: "bold",
  },
  dropdown: {
    margin: 1,
    height: 50,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    marginTop: -180,

    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 300,
    width: 300,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 1,
  },
  buttonOpen: {
    backgroundColor: "silver",
    width: 100,
    marginLeft: 85,
    marginTop: 40,
  },
  buttonClose: {
    backgroundColor: "blue",
    marginTop: 55,
    width: 100,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  button1: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddding: 20,
    backgroundColor: '#3173de',
    marginTop: 30,
    height: 40,
    marginBottom: 15,
  },
  pointstxt: {
    borderRadius: 8,
    height: 40,
    paddingTop: 10,
    textAlign: 'center',
    paddingBottom: 10,
    marginTop: 20,
    width: '100%',
    fontWeight: 'bold',
    fontSize: 15,
    alignSelf: 'center',
    backgroundColor: '#C6EBC9',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  pointstxt1: {
    borderRadius: 8,
    height: 60,
    paddingTop: 11,
    textAlign: 'center',
    paddingBottom: 11,
    marginTop: 20,
    width: '100%',
    fontWeight: 'bold',
    fontSize: 15,
    alignSelf: 'center',
    backgroundColor: '#FD8C8C',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
});