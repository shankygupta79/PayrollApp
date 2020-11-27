import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Avatar, } from 'react-native-paper';
import CalendarStrip from 'react-native-slideable-calendar-strip';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import ToggleSwitch from 'toggle-switch-react-native'
import { useTheme } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
const Stack = createStackNavigator();
var selectedDate = '2018-01-01'
var dx = 0
var total = 0
var myArray = []
var x = '2018-01'
var admin = '';
var off = '';
var id = '';
var access = '';
var id2 = '';
const keys = ['admin', 'office_close', 'userToken', 'access', 'userToken2']
const AttendanceScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [change, setChange] = React.useState(0)
  const [saving, setSaving] = React.useState(false)

  const [loader, setLoader] = React.useState(false)
  const mark = (i) => {
    var data = myArray;
    myArray[i].status = !myArray[i].status;
    setChange(change + 1)

  }
  const getdata = () => {
    setLoader(false)
    console.log(selectedDate)
    var mon = selectedDate.getMonth() + 1
    if (mon < 10) {
      mon = "0" + mon
    }
    var yeaar = selectedDate.getFullYear();
    dx = parseInt(selectedDate.getDate())
    x = mon + "-" + yeaar;
    api = 'https://payrollv2.herokuapp.com/attendance/api/attendance?date=' + x + '&dx=' + dx + '&id=' + encodeURIComponent(id) + '&platform=APP&admin=' + encodeURIComponent(admin) + '&id2=' + encodeURIComponent(id2) + "&off=" + encodeURIComponent(off) + "&access=" + encodeURIComponent(access);
    console.log(api)

    //setContent([a, a, a, a])

    fetch(api)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("ATT API")
        //console.log(responseJson)
        if (responseJson == '5') {
          console.log('Chart for New Month Created')
        } else if (responseJson == '0') {
          console.log('You Dont have access to View')
        } else {
          myArray = []
          for (var i = 0; i < responseJson.length; i++) {
            var temp = '';
            var tpr = '';
            var temparray = responseJson[i].extratime.slice(';')
            temp = temparray[(dx - 1) * 2]
            var st = responseJson[i].present[dx - 1]
            if (st == '-') {
              tpr = false
            } else if (st == 'A') {
              tpr = false
            } else {
              tpr = true
            }

            var entry = {
              idx: i,
              empid: responseJson[i].emp_id,
              name: responseJson[i].employee_quick.name,
              attby: responseJson[i].attby[dx - 1],
              etb: temp,
              status: tpr,
              etbarr: temparray,
              attbyarr: responseJson[i].attby,
              presentarr: responseJson[i].present,
              marked: responseJson[i].marked,
              monthyear: responseJson[i].monthyear,
              active: responseJson[i].employee_quick.status,
              photo: responseJson[i].employee_quick.photo,
              expand: false,

            }
            console.log(tpr)
            myArray.push(entry)
          }
          //console.log(myArray)
          setChange(change)
          setLoader(true)
          total = myArray.length;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  const expand = (i) => {
    var data = myArray;
    myArray[i].expand = !myArray[i].expand;
    setChange(change + 1)

  }
  React.useEffect(() => {
    selectedDate = new Date()
    AsyncStorage.multiGet(keys, (err, stores) => {
      setLoader(false)
      admin = stores[0][1];
      off = stores[1][1];
      id = stores[2][1];
      access = stores[3][1];
      id2 = stores[4][1];

      getdata()

    });
  }, [navigation]);
  React.useEffect(() => {
  }, [change])

  return (
    <View style={styles.container}>

      <ScrollView>


        {

          loader ? <View>
            <CalendarStrip
              showWeekNumber
              selectedDate={selectedDate}
              onPressDate={(date) => {
                selectedDate = date
                getdata()
                setChange(change + 1)
              }}
              onPressGoToday={(today) => {
                selectedDate = today
                getdata()
                setChange(change + 1)
              }}
              onSwipeDown={() => {
                alert('onSwipeDown');
              }}
              markedDate={['2020-11-14', '2018-05-15', '2018-06-04', '2018-05-01']}
              weekStartsOn={0} // 0,1,2,3,4,5,6 for S M T W T F S, defaults to 0
            />{
              myArray.map((item, key) => {
                return <View style={{ borderBottomColor: "grey", borderBottomWidth: 0.5 }} key={item.idx} >
                  <View style={[styles.list, {
                    backgroundColor: colors.background
                  }]}>


                    {item.expand ? <View><FontAwesome.Button backgroundColor={colors.background} color="grey" name="caret-up" onPress={() => expand(item.idx)} />
                    </View> : <View>
                        <FontAwesome.Button backgroundColor={colors.background} color="grey" name="caret-down" onPress={() => expand(item.idx)} /></View>}

                    <Avatar.Image size={74} source={{ uri: item.photo }} />
                    <Text style={[{ flexDirection: "column", fontSize: 18, width: "50%", color: colors.text }]} numberOfLines={2}>{item.name} </Text>

                    <ToggleSwitch isOn={item.status} onToggle={isOn => mark(item.idx)} />



                  </View>
                  {item.expand ?
                    <View style={{ flexDirection: 'column', alignItems: 'center', color: colors.text, backgroundColor: colors.background, }}>
                      <Text style={[{ color: colors.text }]}>Attendance By : Admin</Text>
                      <Text style={[{ color: colors.text }]}>Extra Time Bonus : Rs. 0</Text>
                    </View> : null}

                </View>
              }
              )
            }
            <View style={styles.button}>
              <TouchableOpacity
                style={[styles.signIn, {
                  marginTop: 15
                }]}
                onPress={() => { console.log("SAVED");setSaving(true) }}
              >
                <LinearGradient
                            colors={['#fbb034', '#ffdd00']}
                            style={styles.signIn}
                            start={[-1, 0]}
                            end={[1, 0]}
                        >

                <Text style={[styles.textSign, {
                  color:'#fffff0'
                }]}>
                  SAVE </Text>
                  {saving?<ActivityIndicator style={{marginLeft:"5%"}} size="small" color="#fffff0" />:null}
                  </LinearGradient>
              </TouchableOpacity>
            </View>

          </View> : <ActivityIndicator style={styles.loader} size="large" color="#47c72a" />
        }</ScrollView>





    </View>
  );
};
const AttendanceStackScreen = ({ navigation }) => {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#47c72a',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold'
      }
    }}>
      <Stack.Screen
        name="Daily Attendance"
        component={AttendanceScreen}
        options={{
          title: 'Daily Attendance',
          headerLeft: () => (
            <FontAwesome.Button name="bars" size={25} backgroundColor="#47c72a" onPress={() => navigation.openDrawer()} />
          )
        }}
      />
    </Stack.Navigator>
  );
}
export default AttendanceStackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,

  }, list: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: "3%",
    marginRight: "3%",
    marginTop: "2%"
  }, loader: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 100,
    marginTop: "50%",
  }, button: {
    alignItems: 'center',
        marginTop: 5
  }, signIn: {
    width: '60%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    flexDirection: 'row'
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});
