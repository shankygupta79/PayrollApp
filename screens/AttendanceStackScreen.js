import React from 'react';
import { TextInput, Alert, View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Checkbox, ActivityIndicator, Avatar, } from 'react-native-paper';
import CalendarStrip from './CalendarStrip';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import { useTheme } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import BottomNav from './BottomNav.js';
var z=""
const Stack = createStackNavigator();
var selectedDate = '2018-01-01'
var dx = 0
var total = 0
var myArray = []
var x = '2018-01'
var admin = '';
var off = '';
var id = '';
var api=""
var access = '';
var id2 = '';
var dxt=""
const { width, height } = Dimensions.get("screen");
const keys = ['admin', 'office_close', 'userToken', 'access', 'userToken2']
const AttendanceScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [change, setChange] = React.useState(0)
  const [saving, setSaving] = React.useState(false)

  const [loader, setLoader] = React.useState(false)
  const mark = (i, x) => {
    var data = myArray;
    myArray[i].status = x;
    setChange(change + 1)

  }
  const handleChange = (i, val) => {
    myArray[i].etb = val
    setChange(change + 1)
  }
  const getdata = () => {
    setLoader(false)
    var mon = selectedDate.getMonth() + 1
    if (mon < 10) {
      mon = "0" + mon
    }
    var yeaar = selectedDate.getFullYear();
    dx = parseInt(selectedDate.getDate())
    x = mon + "-" + yeaar;
    if(off[(selectedDate.getDay()-1+7)%7]=="1"){
      Alert.alert('Today is Holiday !', 'Enjoy The Day !.', [
        { text: 'Okay' }
      ]);
      setLoader(true)
      return
    }
    api = 'https://payrollv2.herokuapp.com/attendance/api/attendance?date=' + x + '&dx=' + dx + '&id=' + encodeURIComponent(id) + '&platform=APP&admin=' + encodeURIComponent(admin) + '&id2=' + encodeURIComponent(id2) + "&off=" + encodeURIComponent(off) + "&access=" + encodeURIComponent(access);

    //setContent([a, a, a, a])

    fetch(api)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("ATT API")
        //console.log(responseJson)
        if (responseJson == false) {
          Alert.alert('No Access!', 'Ask Admin to provide you the access of this page !.', [
            { text: 'Okay' }
          ]);
          setLoader(true)
          return
        }
        
        if (responseJson == '5') {
          Alert.alert('Chart for this Month Created!', 'Reload to mark Attendance !', [
            { text: 'Okay' }
          ]);
          setLoader(true)
        } else if (responseJson == '0') {
          Alert.alert('No Access', 'You Dont Have Access to View', [
            { text: 'Okay' }
          ]);
        } else {
          myArray = []
          for (var i = 0; i < responseJson.length; i++) {
            var temp = '';
            var tpr = '';
            var temparray = responseJson[i].extratime.slice(';')
            temp = temparray[(dx - 1) * 2]
            var st = responseJson[i].present[dx - 1]
            if (st == '-') {
              tpr = "none"
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
            myArray.push(entry)
          }
          setChange(change)
          setLoader(true)
          total = myArray.length;
        }
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Error Occured!', 'Some Error Occured.' + error, [
          { text: 'Okay' }
        ]);
        setLoader(false)
        return
      });
  }
  const attendance = async (j) => {
    return new Promise((resolve, reject) => {
      console.log(j)
      var y = '';
      for (var i = 0; i < 61; i++) {
        if (i == 2 * (dx - 1)) {
          y = y + myArray[j].etb
        } else {
          y = y + myArray[j].etbarr[i];
        }
      }
      var tp = myArray[j].presentarr
      var tp2 = myArray[j].marked
      if (myArray[j].status == "none") {
        myArray[j].status = "-";
      }else if(myArray[j].status==true){
        myArray[j].status = "Present";
      }else{
        myArray[j].status = "Absent";
      }
      console.log(myArray[j].status)
      if (myArray[j].status[0] == undefined) {
        reject("P")
      }
      tp = tp.substring(0, dx - 1) + myArray[j].status[0] + tp.substring(dx);
      
      tp2 = tp2.substring(0, dx - 1) + "1" + tp2.substring(dx);

      var abc = '';
      if (dx == dxt) {
        var abc = myArray[j].status[0]
      }
      try {

        fetch('http://payrollv2.herokuapp.com/attendance/edit' + z, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            present: tp,
            etb: y,
            empid: myArray[j].empid,
            quick: abc,
            marked: tp2,
            dx: dx,
            monthyear: myArray[j].monthyear,
            attby: myArray[j].attbyarr,
          })
        }).then((response) => response.json())
          .then((data) => {
            if (data == false) {
              Alert.alert('No Access!', 'Ask Admin to provide you the access of this page !.', [
                { text: 'Okay' }
              ]);
              setLoader(true)
              reject("Z")
              return
            }
            if (myArray[j].status == "-") {
              myArray[j].status = "none";
            }else if(myArray[j].status=="Present"){
              myArray[j].status = true;
            }else{
              myArray[j].status = false;
            }
            if (data.message != 'true') {
              reject("P")
            } else {
              resolve("A")
            }
          })
      } catch {
        Alert.alert('Some Error!', 'Try Again Some Error.', [
          { text: 'Okay' }
        ]);
        setLoader(true)
        return

      }
    })
  }

  const save = async () => {
    setSaving(true)
    for (var i = 0; i < myArray.length; i++) {
      var a = await attendance(i);
      console.log(a)
      if(a=="Z"){
        break
      }

    }
    Alert.alert('Attendance Marked', 'Attendance Marked for '+selectedDate, [
      { text: 'Okay' }
    ]);
    setSaving(false)

  }
  const expand = (i) => {
    var data = myArray;
    myArray[i].expand = !myArray[i].expand;
    setChange(change + 1)

  }
  React.useEffect(() => {
    selectedDate = new Date()
    AsyncStorage.multiGet(keys, (err, stores) => {
      var today = new Date();
      dxt = today.getDate()
      setLoader(false)
      admin = stores[0][1];
      off = stores[1][1];
      id = stores[2][1];
      access = stores[3][1];
      id2 = stores[4][1];
      z = '?id=' + encodeURIComponent(id) + '&platform=APP&admin=' + encodeURIComponent(admin) + '&id2=' + encodeURIComponent(id2) + "&off=" + encodeURIComponent(off) + "&access=" + encodeURIComponent(access);
      getdata()

    });
  }, [navigation]);
  React.useEffect(() => {
  }, [change])

  return (
    <View style={styles.container}>
      <View style={styles.touchableOpacityStyle}>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('AttReportStackScreen')}>
          <FontAwesome name="bar-chart" size={25} backgroundColor="#47c72a" color="white" />

        </TouchableOpacity>
      </View>
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
                return <View style={{ borderRadius: 20, margin: '0.5%', backgroundColor: colors.back2 }} key={item.idx} >
                  <View style={[styles.list,]}>

                    <View style={{ flexDirection: 'row', alignItems: 'center', width: "25%" }}>
                      {item.expand ? <View><FontAwesome.Button backgroundColor={colors.back2} color="grey" name="caret-up" onPress={() => expand(item.idx)} />
                      </View> : <View>
                          <FontAwesome.Button backgroundColor={colors.back2} color="grey" name="caret-down" onPress={() => expand(item.idx)} /></View>}

                      <Avatar.Image size={width * 0.15} source={{ uri: item.photo }} />
                    </View>
                    <Text style={[{ flexDirection: "column", fontSize: 18, width: "40%", paddingLeft: 5, color: colors.text }]} numberOfLines={2}>{item.name} </Text>
                    <View style={{ flexDirection: 'column', alignItems: 'center', marginRight: 20, width: '25%' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Checkbox
                          status={item.status == true ? 'checked' : 'unchecked'}
                          onPress={() => {
                            mark(key, true);
                          }}
                          color={'green'}
                        />
                        <Text style={{ color: colors.text }}>
                          Present
                      </Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox
                          status={item.status == false ? 'checked' : 'unchecked'}
                          onPress={() => {
                            mark(key, false);
                          }}
                          color={'red'}
                        />
                        <Text style={{ color: colors.text }}>
                          Absent{" "}
                        </Text>
                      </View>
                    </View>



                  </View>
                  {item.expand ?
                    <View style={{ flexDirection: 'column', alignItems: 'center', color: colors.text, backgroundColor: colors.back2, }}>
                      <View>
                        {item.marked[dx - 1] == "0" ? <Text style={[{ color: colors.text }]}>Not Marked</Text> : <View>
                          {
                            item.attby == "1" ? <Text style={[{ color: colors.text }]}>Attendance By : Admin</Text>
                              : <Text style={[{ color: colors.text }]}>Attendance By : User </Text>

                          }
                        </View>}
                      </View>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={[{ color: colors.text }]}>Extra Time Bonus : ₹ </Text>
                        <TextInput
                          placeholder="0"
                          keyboardType={"numeric"}
                          style={[styles.textInput, { color: colors.text }]}
                          autoCapitalize="none"
                          onChangeText={(val) => handleChange(key, val)}
                          value={item.etb}
                        />
                      </View>

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
                onPress={() => { console.log("SAVED"); save() }}
              >
                <LinearGradient
                  colors={['#d42424', '#96358d']}
                  style={styles.signIn}
                  start={[-1, 0]}
                  end={[1, 0]}
                >

                  <Text style={[styles.textSign, {
                    color: '#fffff0'
                  }]}>
                    SAVE </Text>
                  {saving ? <ActivityIndicator style={{ marginLeft: "5%" }} size="small" color="#fffff0" /> : null}
                </LinearGradient>
              </TouchableOpacity>
            </View>

          </View> : <ActivityIndicator style={styles.loader} size="large" color="#47c72a" />
        }</ScrollView>

      <BottomNav name="Attendance" color="#47c72a" navigation={navigation}></BottomNav>



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
  }, touchableOpacityStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    zIndex: 100,

    elevation: 7,
    backgroundColor: '#47c72a',

    right: 30,
    bottom: 72,
    position: 'absolute'

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
  }, textInput: {
    marginTop: Platform.OS === 'ios' ? 0 : -6,
    paddingLeft: 10,
    color: '#05375a',
  },
});
