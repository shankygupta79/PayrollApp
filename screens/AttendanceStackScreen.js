import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity,ActivityIndicator } from 'react-native';
import { Avatar, } from 'react-native-paper';
import CalendarStrip from 'react-native-slideable-calendar-strip';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import ToggleSwitch from 'toggle-switch-react-native'
import { useTheme } from '@react-navigation/native';
const Stack = createStackNavigator();
const AttendanceScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [myArray, setMyArray] = React.useState([])
  const keys = ['admin', 'office_close', 'userToken', 'access', 'userToken2']
  const [selectedDate, setSelectedDate] = React.useState('2018-01-01')
  const [dx, setdx] = React.useState('00')
  const [total, setTotal] = React.useState('00')
  const [change, setChange] = React.useState(0)

  const [loader, setLoader] = React.useState(false)
  const mark = (i) => {
    var data = myArray;
    myArray[i].status = !myArray[i].status;
    setChange(change + 1)


  }
  const expand = (i) => {
    var data = myArray;
    myArray[i].expand = !myArray[i].expand;
    setChange(change + 1)
  }
  React.useEffect(() => {
    var d = new Date()
    console.log(d.getDate())
    setSelectedDate(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())
    AsyncStorage.multiGet(keys, (err, stores) => {
      setLoader(false)
      var admin = stores[0][1];
      var off = stores[1][1];
      var id = stores[2][1];
      var access = stores[3][1];
      var id2 = stores[4][1];
      console.log(selectedDate)
      var mon = selectedDate.slice(5, 7);
      var yeaar = selectedDate.slice(0, 4);
      setdx(parseInt(selectedDate.slice(8, 10)))
      var x = mon + "-" + yeaar;
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
            var temp1 = []
            var temp2 = []
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
              temp1.push(entry)
            }
            setMyArray(temp1);
            //console.log(myArray)
            temp1 = []
            setLoader(true)
            setTotal(myArray.length);
          }
        })
        .catch((error) => {
          console.error(error);
        });


    });
  }, [navigation]);
  React.useEffect(() => {
  }, [change])

  return (
    <View style={styles.container}>
      <CalendarStrip
        showWeekNumber
        selectedDate={selectedDate}
        onPressDate={(date) => {
          setSelectedDate(date);
        }}
        onPressGoToday={(today) => {
          setSelectedDate(today);
        }}
        onSwipeDown={() => {
          alert('onSwipeDown');
        }}
        markedDate={['2018-05-04', '2018-05-15', '2018-06-04', '2018-05-01']}
        weekStartsOn={0} // 0,1,2,3,4,5,6 for S M T W T F S, defaults to 0
      />
      <ScrollView>


        {
          loader ? <View>{
            myArray.map((item, key) => {
              return <View style={{ borderBottomColor: "grey", borderBottomWidth: 1 }} key={item.idx} >
                <View style={[styles.list, {
                  backgroundColor: colors.background
                }]}>
                  

                    {item.expand ? <View><FontAwesome.Button backgroundColor={colors.background} color="black" name="chevron-up" onPress={() => expand(item.idx)} />
                      </View>:<View>
                      <FontAwesome.Button backgroundColor={colors.background} color="black" name="chevron-down" onPress={() => expand(item.idx)} /></View>}

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
          }</View> : <ActivityIndicator style={styles.loader}size="large" color="#47c72a"/>
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
  },loader:{
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    marginTop:"50%",
  }
});
