import React from 'react';
import { View, Alert, Text, Image, ScrollView, StyleSheet, Dimensions, RefreshControl, FlatList, TouchableHighlight } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ActivityIndicator, } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';
import { useTheme } from '@react-navigation/native';
const { width, height } = Dimensions.get("screen");
import Ripple from 'react-native-material-ripple';
import BottomNav from './BottomNav.js';
import { color } from 'react-native-reanimated';
const Stack = createStackNavigator();
var apix = ""
var myArray = []
var monthlist = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var apix = ""
var arr = ['01-', '02-', '03-', '04-', '05-', '06-', '07-', '08-', '09-', '10-', '11-', '12-'];
var yearlist = []
var monthday = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var idx = []
var daysarr = []
var week = ["Sun", 'Mon', 'Tue', "Wed", 'Thu', "Fri", "Sat"];
var weekarr = [];
var list = []
var week_bias = 2;
var days = 31;
var days2 = 3;
var admin = "";
var off = "";
var id = "";
var access = "";
var id2 = "";
for (var i = 1; i <= days; i++) {
  daysarr.push(i)
  weekarr.push(week[(i + week_bias - 1) % 7])
}
var sortfield = ""
var keys = ['admin', 'office_close', 'userToken', 'access', 'userToken2']
const AttReportScreen = ( { route, navigation }) => {
  const { colors } = useTheme();
  const [select1, setSelect1] = React.useState("All Employees")
  const [loader, setLoader] = React.useState(false)
  const [visible1, setVisible1] = React.useState(false)
  const [select2, setSelect2] = React.useState("")
  const [saving, setSaving] = React.useState(false)
  const [visible2, setVisible2] = React.useState(false)
  const [select3, setSelect3] = React.useState("")
  const [visible3, setVisible3] = React.useState(false)
  const [ref, setRef] = React.useState(false)
  const [data, setData] = React.useState(false)
  const api1 = async (api) => {
    try {
      const response = await fetch(api);
      const responseJson = await response.json();
      myArray = ["All Employee"];
      idx = [-1]
      for (var i = 0; i < responseJson.length; i++) {
        myArray.push(responseJson[i].name);
        idx.push(responseJson[i].emp_id);
      }
    } catch (error) {
      console.error(error);
      return await Promise.reject(false);
    }

  };
  const year = () => {
    var d = new Date();
    var n = d.getFullYear() + 1;
    var y = 2020;
    do {
      yearlist.push(y + "")
      y++;
    } while (n != y);
    setSelect2(monthlist[d.getMonth()]);
    setSelect3("" + n - 1)
  }
  const view = async () => {
    if (saving == true) {
    return
    }
    setData(false)
    setSaving(true)

    var z = '&id=' + encodeURIComponent(id) + '&platform=APP&admin=' + encodeURIComponent(admin) + '&id2=' + encodeURIComponent(id2) + "&off=" + encodeURIComponent(off) + "&access=" + encodeURIComponent(access);
    var ap1 = 'https://payrollv2.herokuapp.com/payslips/api/data?date=' + arr[monthlist.indexOf(select2)] + select3 + z
    try {
      const response = await fetch(ap1);
      list = await response.json();

      if (response.length == 0) {
        Alert.alert('No Record!', 'No Record Found.', [
          { text: 'Okay' }
        ]);
        setSaving(false)
        return

      }
      var zz = monthlist.indexOf(select2)
      var x = new Date(select3, zz, 1)
      week_bias = x.getDay()
      days = monthday[zz]
      days2 = days - 28
      for (var i = 0; i < list.length; i++) {
        list[i] = { name: list[i]['employee_quick'].name, att: list[i].present.split("").splice(0,days) }
      }
      
      daysarr = []
      weekarr = []
      for (var i = 1; i <= days; i++) {
        daysarr.push(i)
        weekarr.push(week[(i + week_bias - 1) % 7])
      }
      sort('Name')
      setSaving(false)
      setData(true)
    } catch (error) {
      console.error(error);
      Alert.alert('Some Error Occured!', 'Error is .' + error, [
        { text: 'Okay' }
      ]);
      setSaving(false)
      return await Promise.reject(false);
    }
    setSaving(false)
  }
  const sort = (key) => {
    console.log(key)
    sortfield = key
    if (key == 'Net Pay') {
      sortfield = "neypay"
      myArray.sort(compare)
    } else if (key == "Name") {
      sortfield = "name"
      list.sort(compare)
    }
  }
  const compare = (a, b) => {
    var nameA = a[sortfield]
    var nameB = b[sortfield]
    if (nameA < nameB) { return -1; }
    if (nameA > nameB) { return 1; }
    return 0;
  }
  const onRefresh = () => {
    setRef(true);
    view()
    setTimeout(function () { setRef(false) }, 1500);

  }
  React.useEffect(() => {
    AsyncStorage.multiGet(keys, async (err, stores) => {
      setLoader(false)
      admin = stores[0][1];
      off = stores[1][1];
      id = stores[2][1];
      access = stores[3][1];
      id2 = stores[4][1];
      if (false) {
        apix = 'https://payrollv2.herokuapp.com/employee/api/quickemp?id=' + encodeURIComponent(id) + '&platform=APP&admin=' + encodeURIComponent(admin) + '&id2=' + encodeURIComponent(id2) + "&off=" + encodeURIComponent(off) + "&access=" + encodeURIComponent(access);
        await api1(apix).then(() => { setLoader(true) })
        year()
      } else {
        year()
        setLoader(true)
      }


    })
  }, [navigation])
  return (
    <View style={styles.container}>
      <ScrollView refreshControl={
        <RefreshControl
          refreshing={ref}
          onRefresh={onRefresh}
        />}>
        {loader ? <View>
          <SinglePickerMaterialDialog
            title={'Select Month'}
            items={monthlist.map((row, index) => ({ value: index, label: row }))}
            visible={visible2}
            selectedItem={select2}
            colorAccent={'#47c72a'}
            onCancel={() => setVisible2(false)}
            scrolled={true}
            onOk={result => {
              setVisible2(false);
              setSelect2(result.selectedItem.label);
            }}
          />
          <SinglePickerMaterialDialog
            title={'Select one Employee'}
            items={myArray.map((row, index) => ({ value: index, label: row }))}
            visible={visible1}
            selectedItem={select1}
            onCancel={() => setVisible1(false)}
            scrolled={true}
            colorAccent={'#47c72a'}
            onOk={result => {
              setVisible1(false);
              setSelect1(result.selectedItem.label);
            }}
          />
          <SinglePickerMaterialDialog
            title={'Select Year'}
            items={yearlist.map((row, index) => ({ value: index, label: row }))}
            visible={visible3}
            selectedItem={select3}
            colorAccent={'#47c72a'}
            onCancel={() => setVisible3(false)}
            onOk={result => {
              setVisible3(false);
              setSelect3(result.selectedItem.label);
            }}
          />
          {/*<Ripple style={[styles.blck, { backgroundColor: colors.back2 }]} onPress={() => { setVisible1(!visible1) }}>
            <View style={styles.table}>
              <Text style={[{ fontSize: 18, color: colors.text }]}>
                Employee
                        </Text>
              <Text style={[{ fontSize: 18, color: colors.text }]}>
                {select1} {"  >"}
              </Text>
            </View>
          </Ripple>*/}
          <Ripple style={[styles.blck, { backgroundColor: colors.back2 }]} onPress={() => { setVisible2(!visible2) }}>
            <View style={styles.table}>
              <Text style={[{ fontSize: 18, color: colors.text }]}>
                Month
                        </Text>
              <Text style={[{ fontSize: 18, color: colors.text }]}>
                {select2} {"  >"}

              </Text>
            </View>
          </Ripple>
          <Ripple style={[styles.blck, { backgroundColor: colors.back2 }]} onPress={() => { setVisible3(!visible3) }}>
            <View style={styles.table}>
              <Text style={[{ fontSize: 18, color: colors.text }]}>
                Year
                        </Text>
              <Text style={[{ fontSize: 18, color: colors.text }]}>
                {select3} {"  >"}
              </Text>
            </View>
          </Ripple>
          <View style={styles.button}>

            <TouchableOpacity
              onPress={() => { console.log("CLICKED"); view() }} >
              <LinearGradient
                colors={['lightgreen', '#47c72a', 'lightgreen']}
                style={styles.signIn}
                start={[-1, 0]}
                end={[1, 0]}
              >

                <Text style={[styles.textSign, { color: '#fffff0', fontWeight: "bold" }]}>
                  SHOW </Text>
                {saving ? <ActivityIndicator style={{ marginLeft: "5%" }} size="small" color="#fffff0" /> : null}
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={{margin:'4%'}}>
          {
            data ? <View>
              <ScrollView horizontal={true} style={{paddingBottom:10}}>
                <View style={{ flexDirection: 'column',justifyContent:'center',alignItems:'center' }}>

                  <View style={{ flexDirection: 'row', }}>
                    <View style={[styles.header, { width: width * 0.3,backgroundColor:'#47c72a' }]}>
                      <Text style={[styles.text, { color: 'white',fontWeight:'bold',padding:10  }]}>
                        Name
                    </Text>
                    </View>
                    {
                      daysarr.map((item, key) => {
                        return (

                          <View style={[styles.header,{backgroundColor:'#47c72a'}]}>

                            <Text style={[styles.text, { color: 'white',fontWeight:'bold' }]}>
                              {item}
                            </Text>
                            <Text style={[styles.text, { color: 'white',fontWeight:'bold' }]}>
                              {weekarr[key]}
                            </Text>

                          </View>

                        )
                      })
                    }
                  </View>
                  <View style={{ flexDirection: 'column' }}>

                    {
                      list.map((item, key) => {
                        return (
                          <View style={{ flexDirection: 'row', height: 75 }}>
                            <View style={[styles.header, { width: width * 0.3,alignItems:'flex-start'}]}>

                              <Text style={[styles.text, { color: colors.text,padding:10 }]}>
                                {item.name}
                              </Text>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, }}>
                              {
                                item.att.map((item2, key2) => {
                                  return (

                                    <View style={styles.header}>

                                      <Text style={[styles.text, { color:  item2=='A'?'red' :colors.text }]}>
                                        {item2}
                                      </Text>

                                    </View>

                                  )
                                })
                              }
                            </View>

                          </View>

                        )
                      })
                    }

                  </View>
                </View>


              </ScrollView>

            </View>
              : null
          }
          </View>
          <View>
            <Text style={{ height: height * 0.1 }}>

            </Text>
          </View>

        </View> : <ActivityIndicator style={styles.loader} size="large" color="#47c72a" />}

      </ScrollView>
      <BottomNav name="" color='#47c72a' navigation={navigation}></BottomNav>
    </View>
  )
}

const AttReportStackScreen = ({ navigation }) => {
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
        name="Attendance Chart"
        component={AttReportScreen}
        options={{
          title: ' Attendance Chart ',
          headerLeft: () => (
            <FontAwesome.Button name="bars" size={25} backgroundColor="#47c72a" onPress={() => navigation.openDrawer()} />
          )
        }}
      />
    </Stack.Navigator>
  );
}
export default AttReportStackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,

  }, loader: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    marginTop: "0%",
  }, blck: {
    padding: "2%",
    margin: '0.5%',
    borderRadius: 20,
  }, text: {
    fontSize: 15,
    alignItems: 'center',
  }, table: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: "2%",
    marginRight: "2%", zIndex: 0,
  }, button: {
    alignItems: 'center',
    marginTop: 10
  }, signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
  }, header: {
    flexDirection: 'column',
    width: width * 0.12,
    alignItems: 'center',
    borderWidth: 0.5,
    borderRadius: 0,
    borderBottomWidth:0.8,
    borderColor:'#bfbeba',
    justifyContent: 'center',
  }
})