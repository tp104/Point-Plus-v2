import * as React from 'react';
import { Button, View, Image, Text, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegistrationScreen from './app/screens/RegistrationScreen';
import LoginScreen from './app/screens/LoginScreen';
import StudentDashboard from './app/screens/StudentDashboard';
import TeacherDashboardScreen from './app/screens/TeacherDashboardScreen';
import EnterDetails from './app/screens/EnterDetails';
import TeacherLogin from './app/screens/TeacherLogin';
import TeacherRegistrationScreen from './app/screens/TeacherRegistrationScreen';
import ViewCertificates from './app/screens/ViewCertificates';
import ViewCertificatesTeacher from './app/screens/ViewCertificatesTeacher';
import ViewActivityPoints from './app/screens/ViewActivityPoints';
//import HomeScreen from './app/screens/HomeScreen';
import ImageSelector from './app/screens/ImageSelector';
import BarCodeScanner from './app/screens/BarCodeScanner';
import CertificateDetails from './app/screens/CertificateDetails';
import StudentListView from './app/screens/StudentListView';
import CertificateDetailsTeacher from './app/screens/CertificateDetailsTeacher';
import FilterSortTeacher from './app/screens/FilterSortTeacher';
import RaiseTicketStudent from './app/screens/RaiseTicketStudent';
import TeacherTicketsList from './app/screens/TeacherTicketsList';
import TicketDetails from './app/screens/TicketDetails';

import { Alert } from 'react-native';
import { useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

console.disableYellowBox = true;
//const db = SQLite.openDatabase('db.testDb');// returns Database object
const db = SQLite.openDatabase('pointplus1.db');// returns Database object

const headerbg = "#EFFFFD";
const headertext = "#42C2FF"

function HomeScreen({ navigation }) {

  useEffect(() => {

    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT * FROM sqlite_master WHERE type='table' AND name='teacher_table'",
        [],
        function (tx, res) {
          //console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS teacher_table', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS teacher_table(teacher_id INTEGER PRIMARY KEY AUTOINCREMENT, teacher_name VARCHAR(20), teacher_dept VARCHAR(20), teacher_sem VARCHAR(10), teacher_div VARCHAR(10), teacher_email VARCHAR(30), teacher_password VARCHAR(20))',
              []
            );
          }
        }
      );
    });

    // console.log("----- Teacher Data------")
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM teacher_table',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            // console.log("reading: ", i);
            temp.push(results.rows.item(i));
          }
          // console.log(temp);
        }
      );
    });

    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT * FROM sqlite_master WHERE type='table' AND name='student_table'",
        [],
        function (tx, res) {
          //console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS student_table', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS student_table(student_id INTEGER PRIMARY KEY AUTOINCREMENT, student_name VARCHAR(20), student_dept VARCHAR(20), student_sem VARCHAR(10), student_div VARCHAR(10), student_email VARCHAR(30), student_password VARCHAR(20), student_points INTEGER(4))',
              []
            );
          }
        }
      );
    });

    //console.log("----- Student Data------")
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM student_table',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            //console.log("reading: ", i);
            temp.push(results.rows.item(i));
          }
          //console.log(temp);
        }
      );
    });

    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT * FROM sqlite_master WHERE type='table' AND name='certificate_table'",
        [],
        function (tx, res) {
          console.log('certificate item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS certificate_table', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS certificate_table(certificate_id INTEGER PRIMARY KEY AUTOINCREMENT, student_ref INTEGER REFERENCES student_table(student_id), teacher_ref INTEGER REFERENCES teacher_table(teacher_id), certificate_name VARCHAR(30), certificate_uri VARCHAR(250), certificate_venue VARCHAR(30), certificate_days VARCHAR(10), certificate_date VARCHAR(50), certificate_type VARCHAR(50), certificate_subtype VARCHAR(50), certificate_status VARCHAR(10), certificate_points INTEGER(4), ticket_closedate VARCHAR(50), ticket_remarks VARCHAR(50), ticket_active VARCHAR(10))',
              []
            );
          }
        }
      );
    });
    console.log("----- Certificate Data------")
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM certificate_table',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            console.log("reading: ", i);
            temp.push(results.rows.item(i));
          }
          console.log(temp);
        }
      );
    });

    // ticket table
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT * FROM sqlite_master WHERE type='table' AND name='ticket_table'",
        [],
        function (tx, res) {
          console.log('ticket item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS ticket_table', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS ticket_table(ticket_id INTEGER PRIMARY KEY AUTOINCREMENT, certificate_ref INTEGER REFERENCES certificate_table(certificate_id), ticket_discreption VARCHAR(50), ticket_opendate VARCHAR(50))',
              []
            );
          }
        }
      );
    });
    console.log("----- Ticket Data------")
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM ticket_table',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            console.log("reading: ", i);
            temp.push(results.rows.item(i));
          }
          console.log(temp);
        }
      );
    });

  }, []);


  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff", }}>
      {/* <View>

        <Text style={{ fontSize: 36, marginTop: 100, marginLeft: 100 }}>Point Plus+</Text>
      </View> */}

      <Image
        style={{
          marginTop: 120,
          marginRight: 20,
          marginLeft: -5,
          justifyContent: 'center',
          alignItems: 'stretch',
          resizeMode: 'stretch',
          width: 400,
          height: 300,
        }}
        source={{ uri: "https://i.ibb.co/wNNRrKy/PPLogo1.jpg" }}
        resizeMode={'contain'}
      />

      {/* <View style={{ flexDirection: 'row', marginTop: 100, marginLeft: 50 }}>
        <Button style={{ marginLeft: 100 }}
          title="Login as Teacher"
          onPress={() => navigation.navigate('TeacherLogin')}
        />
        <View style={{ width: 20, height: 20 }} />
        <Button style={{ marginLeft: 10 }}
          title="Login as Student"
          onPress={() => navigation.navigate('Login')}
        />
      </View> */}

      <View style={{ marginHorizontal: 20, marginTop: 70 }}>

        <TouchableOpacity style={[styles.buttonstudent, {}]} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.btntext}>Student</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonfaculty, {}]} onPress={() => navigation.navigate('TeacherLogin')}>
          <Text style={styles.btntext}>Faculty</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen
          name="Point Plus" component={HomeScreen} options={{
            title: '',

            headerShown: false,


            headerStyle: {
              backgroundColor: 'white',
            },
            headerTintColor: 'white',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} />
        <Stack.Screen name="Login" component={LoginScreen}
          options={{
            title: 'Student Login',
            headerStyle: {
              backgroundColor: headerbg,
            },
            headerTintColor: headertext,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} />
        <Stack.Screen name="TeacherLogin" component={TeacherLogin}
          options={{
            title: 'Teacher Login',
            headerStyle: {
              backgroundColor: headerbg,
            },
            headerTintColor: headertext,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} />
        <Stack.Screen name="Register" component={RegistrationScreen}
          options={{
            title: 'Student Registration',
            headerStyle: {
              backgroundColor: headerbg,
            },
            headerTintColor: headertext,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} />
        <Stack.Screen name="TeacherRegistrationScreen" component={TeacherRegistrationScreen}
          options={{
            title: 'Faculty Registration',
            headerStyle: {
              backgroundColor: headerbg,
            },
            headerTintColor: headertext,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} />
        <Stack.Screen name="TeacherDashboardScreen" component={TeacherDashboardScreen}
          options={{
            title: 'Faculty Dashboard',
            headerStyle: {
              backgroundColor: headerbg,
            },
            headerTintColor: headertext,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} />
        <Stack.Screen name="StudentDashboard" component={StudentDashboard}
          options={{
            title: 'Student Dashboard',
            headerStyle: {
              backgroundColor: headerbg,
            },
            headerTintColor: headertext,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} />
        <Stack.Screen name="EnterDetails" component={EnterDetails}
          options={{
            title: 'Upload Certificate',
            headerStyle: {
              backgroundColor: headerbg,
            },
            headerTintColor: headertext,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} />
        <Stack.Screen name="ViewActivityPoints" component={ViewActivityPoints}
          options={{
            title: 'Activity Points',
            headerStyle: {
              backgroundColor: headerbg,
            },
            headerTintColor: headertext,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} />
        <Stack.Screen name="ImageSelector" component={ImageSelector}
          options={{
            title: 'Select Image',
            headerStyle: {
              backgroundColor: headerbg,
            },
            headerTintColor: headertext,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} />
        <Stack.Screen name="BarCodeScanner" component={BarCodeScanner}
          options={{
            title: 'QR Code',
            headerStyle: {
              backgroundColor: headerbg,
            },
            headerTintColor: headertext,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} />
        <Stack.Screen name="ViewCertificates" component={ViewCertificates}
          options={{
            title: 'View Certificates',
            headerStyle: {
              backgroundColor: headerbg,
            },
            headerTintColor: headertext,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} />
        <Stack.Screen name="CertificateDetails" component={CertificateDetails}
          options={{
            title: 'Certificate Details',
            headerStyle: {
              backgroundColor: headerbg,
            },
            headerTintColor: headertext,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} />
        <Stack.Screen name="StudentListView" component={StudentListView}
          options={{
            title: 'Students List',
            headerStyle: {
              backgroundColor: headerbg,
            },
            headerTintColor: headertext,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} />
        <Stack.Screen name="CertificateDetailsTeacher" component={CertificateDetailsTeacher}
          options={{
            title: 'Certificate Details',
            headerStyle: {
              backgroundColor: headerbg,
            },
            headerTintColor: headertext,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} />
        <Stack.Screen name="ViewCertificatesTeacher" component={ViewCertificatesTeacher}
          options={{
            title: 'View Certificates',
            headerStyle: {
              backgroundColor: headerbg,
            },
            headerTintColor: headertext,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} />
        <Stack.Screen name="FilterSortTeacher" component={FilterSortTeacher}
          options={{
            title: 'Filter Certificates',
            headerStyle: {
              backgroundColor: headerbg,
            },
            headerTintColor: headertext,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} />
        <Stack.Screen name="TeacherTicketsList" component={TeacherTicketsList}
          options={{
            title: 'Tickets List',
            headerStyle: {
              backgroundColor: headerbg,
            },
            headerTintColor: headertext,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} />
        <Stack.Screen name="TicketDetails" component={TicketDetails}
          options={{
            title: 'Ticket Details',
            headerStyle: {
              backgroundColor: headerbg,
            },
            headerTintColor: headertext,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    height: "100%",
    textAlign: "center"
  },
  buttonstudent: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddding: 18,
    backgroundColor: '#3173de',
    marginHorizontal: 20,
    marginTop: 25,
    height: 45,
    marginBottom: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 10,
  },
  buttonfaculty: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddding: 18,
    backgroundColor: '#6F38C5',
    marginHorizontal: 20,
    marginTop: 25,
    height: 45,
    marginBottom: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 10,
  },
  btntext: {
    padding: 10,
    fontSize: 18,
    color: "#ffff",
    fontWeight: "bold",
  },
});

export default App;