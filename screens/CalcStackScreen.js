import React from 'react';
import { Alert, TextInput, View, Text, ScrollView, StyleSheet, Dimensions, RefreshControl, } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ActivityIndicator, Avatar, } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { useTheme } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';
import Ripple from 'react-native-material-ripple';
import BottomNav from './BottomNav';
const { width, height } = Dimensions.get("screen");
const Stack = createStackNavigator();
var keys = ['admin', 'office_close', 'userToken', 'access', 'userToken2']
var monthlist = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var arr = ['01-', '02-', '03-', '04-', '05-', '06-', '07-', '08-', '09-', '10-', '11-', '12-'];
var yearlist = []
var monthday = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var admin = "";
var off = "";
var id = "";
var access = "";
var id2 = "";
var apix = ""
var list = []
var z = ""


const CalcScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [loader, setLoader] = React.useState(false)
  const [ref, setRef] = React.useState(false)
  const [select2, setSelect2] = React.useState("")
  const [visible2, setVisible2] = React.useState(false)
  const [select3, setSelect3] = React.useState("")
  const [visible3, setVisible3] = React.useState(false)
  const [change, setChange] = React.useState(0);
  const [saving, setSaving] = React.useState(false)
  const [saving2, setSaving2] = React.useState(false)
  const [savebutton, setSaveButton] = React.useState("Edit")
  const [data, setData] = React.useState(false)
  const [edit, setEdit] = React.useState(false)
  const [count, setCount] = React.useState(0)

  const emichange = (val, key) => {
    list[key].emi = val
    setCount(count + 1)
  }
  const bonuschange = (val, key) => {
    list[key].bonus = val
    setCount(count + 1)
  }
  const deductionchange = (val, key) => {
    list[key].deduction = val
    setCount(count + 1)
  }
  const transferchange = (val, key) => {
    list[key].transfer = val
    setCount(count + 1)
  }
  const onRefresh = () => {
    setRef(true);
    view()

  }
  const save = () => {
    if (edit == false) {
      setEdit(true)
      setSaveButton("Save")
    } else {
      setSaving2(true)
      setEdit(false)
      try {

        fetch('http://payrollv2.herokuapp.com/payslips/api/calc' + z, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            list: list,
            x: list[0].monthyear,
          })
        }).then((response) => response.json())
          .then((data) => {
            console.log(data)
            setSaving2(false)
            if(data==false){
              Alert.alert('No Access!', 'Ask Admin to provide you the access of this page !.', [
                { text: 'Okay' }
              ]);
              setRef(false)
              setLoader(true)
              return 
            }
            if (data.message == 'true') {
              setSaveButton("Edit")
              
              setChange(change + 1)
              Alert.alert('Success !', 'Monthly Salary Calculation Saved.', [
                { text: 'Okay', onPress: () => { navigation.navigate('PayslipsStackScreen', { refresh: true }) } }
              ]);
              return
            } else {
              Alert.alert('Some Error!', 'Try Again Some Error.', [
                { text: 'Okay' }
              ]);

              return
            }

          })

      } catch {
        Alert.alert('Some Error!', 'Try Again Some Error.', [
          { text: 'Okay' }
        ]);
        setSaving(false)

        setSaveButton("Edit")
        return

      }
    }
  }
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
    setLoader(false)
    setSaving(true)
    var z = '&id=' + encodeURIComponent(id) + '&platform=APP&admin=' + encodeURIComponent(admin) + '&id2=' + encodeURIComponent(id2) + "&off=" + encodeURIComponent(off) + "&access=" + encodeURIComponent(access);
    var ap1 = 'https://payrollv2.herokuapp.com/payslips/api/data?date=' + arr[monthlist.indexOf(select2)] + select3 + z
    console.log("Data called")
    return fetch(ap1)
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson==false){
          Alert.alert('No Access!', 'Ask Admin to provide you the access of this page !.', [
            { text: 'Okay' }
          ]);
          setRef(false)
          setSaving(false)
          setLoader(true)
          return 
        }
        list = responseJson
        if (list.length == 0) {
          Alert.alert('No Record!', 'No Record Found.', [
            { text: 'Okay' }
          ]);
          setSaving(false)
          setLoader(true)
          setRef(false)
          return

        }
        var days = monthday[monthlist.indexOf(select2)]


        for (var i = 0; i < list.length; i++) {
          list[i].emiold = list[i].emi;
          var extrarr = list[i].extratime.split(';')
          var prearr = list[i].present
          var extra = 0
          var ab = 0
          for (var j = 0; j < days; j++) {
            extra = extra + parseInt(extrarr[j])
            if (prearr[j] == 'A') {
              ab++
            }
          }
          list[i].extratimetotoal = extra
          list[i].holidays = Math.round((list[i]['employee_quick'].salary / days) * ab)
        }

        setSaving(false)
        setLoader(true)
        setData(true)
        setRef(false)
      }).catch(error => {
        console.error(error);
        Alert.alert('Some Error Occured!', 'Error is .' + error, [
          { text: 'Okay' }
        ]);
        setSaving(false)
        setLoader(true)
        setData(true)
        setRef(false)
        return
      })
  }

  React.useEffect(() => {
    AsyncStorage.multiGet(keys, async (err, stores) => {
      setLoader(false)
      admin = stores[0][1];
      off = stores[1][1];
      id = stores[2][1];
      access = stores[3][1];
      id2 = stores[4][1];
      z = '?id=' + encodeURIComponent(id) + '&platform=APP&admin=' + encodeURIComponent(admin) + '&id2=' + encodeURIComponent(id2) + "&off=" + encodeURIComponent(off) + "&access=" + encodeURIComponent(access);
      year()
      setLoader(true)


    })
  }, [navigation, id])
  return (
    <View style={styles.container}>
      <View style={styles.touchableOpacityStyle}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => { navigation.navigate('PayslipsStackScreen') }}>
          <FontAwesome name="download" size={20} backgroundColor="magenta" color="white" />

        </TouchableOpacity>
      </View>

      <ScrollView refreshControl={
        <RefreshControl
          refreshing={ref}
          onRefresh={onRefresh}
        />}>
        {loader ? <View>

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
                colors={['#e774ed', '#eb38cd', '#e774ed']}
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


          <SinglePickerMaterialDialog
            title={'Select Month'}
            items={monthlist.map((row, index) => ({ value: index, label: row }))}
            visible={visible2}
            selectedItem={select2}
            colorAccent={'#fa50e2'}
            onCancel={() => setVisible2(false)}
            scrolled={true}
            onOk={result => {
              setVisible2(false);
              setSelect2(result.selectedItem.label);
            }}
          />
          <SinglePickerMaterialDialog
            title={'Select Year'}
            items={yearlist.map((row, index) => ({ value: index, label: row }))}
            visible={visible3}
            selectedItem={select3}
            colorAccent={'#fa50e2'}
            onCancel={() => setVisible3(false)}
            onOk={result => {
              setVisible3(false);
              setSelect3(result.selectedItem.label);
            }}
          />
          <View>
            <Text>

            </Text>
          </View>

          {data ? <View>
            {
              list.map((item, key) => {
                return (<View key={item.id}>
                  <View style={[styles.blck, { backgroundColor: '#fa50e2' }]}>
                    <View style={[styles.table, { justifyContent: 'center' }]}>
                      <Text style={[{ color: 'white', fontSize: 15 }]}>
                        {item.employee_quick.name}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.blck, { backgroundColor: colors.back2 }]}>
                    <View style={[styles.table]}>
                      <Text>

                      </Text>
                      <Avatar.Image size={74} source={{ uri: item.employee_quick.photo }} />


                      <Text style={[styles.text2, { color: colors.text, }]}>
                        Net Pay
              </Text>
                      <Text style={[styles.text2, { color: colors.text, fontSize: 17 }]}>
                        ₹ {parseInt(item['employee_quick'].salary) + parseInt(item.bonus) + parseInt(item.extratimetotoal) - parseInt(item.deduction) - parseInt(item.advance) - parseInt(item.holidays) - parseInt(item.emi) - parseInt(item.transfer)}
                      </Text>

                    </View>
                    <View style={[styles.table]}>
                      <Text style={[styles.text2, { color: colors.text, }]}>
                        Salary
              </Text>
                      <Text style={[styles.text2, { color: '#07a81a', }]}>
                        ₹ {parseInt(item['employee_quick'].salary)}
                      </Text>
                      <Text style={[styles.text2, { color: colors.text, }]}>
                        Holidays
              </Text>
                      <Text style={[styles.text2, { color: 'red', }]}>
                        ₹ {parseInt(item.holidays)}
                      </Text>
                    </View>
                    <View style={[styles.table]}>
                      <Text style={[styles.text2, { color: colors.text, }]}>
                        Extra Time
              </Text>
                      <Text style={[styles.text2, { color: 'red', }]}>
                        ₹ {parseInt(item.extratimetotoal)}
                      </Text>
                      <Text style={[styles.text2, { color: colors.text, }]}>
                        Advance
              </Text>
                      <Text style={[styles.text2, { color: 'red', }]}>
                        ₹ {parseInt(item.advance)}
                      </Text>
                    </View>
                    <View style={[styles.table]}>
                      <Text style={[styles.text2, { color: colors.text, }]}>
                        Total Loan
              </Text>
                      <Text style={[styles.text2, { color: colors.text, }]}>
                        ₹ {parseInt(item['employee_quick'].totalloan) - parseInt(item.emi) + parseInt(item.emiold)}
                      </Text>
                      <Text style={[styles.text2, { color: colors.text, }]}>
                        EMI
              </Text>
                      {!edit ? <Text style={[styles.text2, { color: 'red', }]}>
                        ₹ {parseInt(item.emi)}
                      </Text> :
                        <View style={[styles.action, { width: width * 0.21 }]}>
                          <FontAwesome
                            name="inr"
                            color="red"
                            size={18}
                          />
                          <TextInput
                            placeholder="0"
                            keyboardType={'numeric'}
                            style={[styles.textInput, { color: colors.text }]}
                            autoCapitalize="none"
                            value={item.emi}
                            onChangeText={(val) => emichange(val, key)}
                          />
                        </View>

                      }
                    </View>
                    <View style={[styles.table]}>
                      <Text style={[styles.text2, { color: colors.text, }]}>
                        Bonus
              </Text>
                      {!edit ? <Text style={[styles.text2, { color: '#07a81a', }]}>
                        ₹ {parseInt(item.bonus)}
                      </Text> :
                        <View style={[styles.action, { width: width * 0.21 }]}>
                          <FontAwesome
                            name="inr"
                            color="#07a81a"
                            size={18}
                          />
                          <TextInput
                            placeholder="0"
                            keyboardType={'numeric'}
                            style={[styles.textInput, { color: colors.text }]}
                            autoCapitalize="none"
                            value={item.bonus}
                            onChangeText={(val) => bonuschange(val, key)}
                          />
                        </View>

                      }
                      <Text style={[styles.text2, { color: colors.text, }]}>
                        Deduction
              </Text>
                      {!edit ? <Text style={[styles.text2, { color: 'red', }]}>
                        ₹ {parseInt(item.deduction)}
                      </Text> :
                        <View style={[styles.action, { width: width * 0.21 }]}>
                          <FontAwesome
                            name="inr"
                            color="red"
                            size={18}
                          />
                          <TextInput
                            placeholder="0"
                            keyboardType={'numeric'}
                            style={[styles.textInput, { color: colors.text }]}
                            autoCapitalize="none"
                            value={item.decution}
                            onChangeText={(val) => deductionchange(val, key)}
                          />
                        </View>

                      }
                    </View>
                    <View style={[styles.table]}>
                      <Text style={[styles.text2, { color: colors.text, }]}>
                        Balance
              </Text>
                      <Text style={[styles.text2, { color: colors.text, fontSize: 17 }]}>
                        ₹ {parseInt(item['employee_quick'].salary) + parseInt(item.bonus) + parseInt(item.extratimetotoal) - parseInt(item.deduction) - parseInt(item.advance) - parseInt(item.holidays) - parseInt(item.emi)}
                      </Text>
                      <Text style={[styles.text2, { color: colors.text, }]}>
                        Transfer
              </Text>
                      {!edit ? <Text style={[styles.text2, { color: 'red', }]}>
                        ₹ {parseInt(item.transfer)}
                      </Text> :
                        <View style={[styles.action, { width: width * 0.21 }]}>
                          <FontAwesome
                            name="inr"
                            color="red"
                            size={18}
                          />
                          <TextInput
                            placeholder="0"
                            keyboardType={'numeric'}
                            style={[styles.textInput, { color: colors.text }]}
                            autoCapitalize="none"
                            value={item.transfer}
                            onChangeText={(val) => transferchange(val, key)}
                          />
                        </View>

                      }
                    </View>
                  </View>
                </View>)
              })}
            <View style={styles.button}>
              <TouchableOpacity
                onPress={() => { console.log("CLICKED"); save() }} >
                <LinearGradient
                  colors={['#e774ed', '#eb38cd', '#e774ed']}
                  style={[styles.signIn, { width: width * 0.8 }]}
                  start={[-1, 0]}
                  end={[1, 0]}
                >

                  <Text style={[styles.textSign, { color: '#fffff0', fontWeight: "bold" }]}>
                    {savebutton} </Text>
                  {saving2 ? <ActivityIndicator style={{ marginLeft: "5%" }} size="small" color="#fffff0" /> : null}
                </LinearGradient>
              </TouchableOpacity></View>



          </View> : null}


          <View style={{ height: height * 0.1 }}>
            <Text>

            </Text>
          </View>



        </View> : <ActivityIndicator style={styles.loader} size="large" color="#fa50e2" />}

      </ScrollView>

      <BottomNav name="" color='#fa50e2' navigation={navigation}></BottomNav>
    </View>
  )
}

const CalcStackScreen = ({ navigation }) => {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#fa50e2',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold'
      }
    }}>
      <Stack.Screen
        name="Calculator"
        component={CalcScreen}
        options={{
          title: ' Calculator ',
          headerLeft: () => (
            <FontAwesome.Button name="bars" size={25} backgroundColor="#fa50e2" onPress={() => navigation.openDrawer()} />
          )
        }}
      />
    </Stack.Navigator>
  );
}
export default CalcStackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,

  }, loader: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    marginTop: "60%",
  }, textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -5,
    paddingLeft: 10,
    color: '#05375a',
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
  }, blck: {
    padding: "2%",
    margin: '0.5%',
    borderRadius: 20,
  }, text: {
    width: width / 3,
    fontSize: 15
  }, text2: {
    width: width / 4,
    fontSize: 15
  }, text2: {
    width: width / 4,
    fontSize: 15,
    fontWeight: 'bold'
  }, headig: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  }, headig2: {
    fontWeight: 'bold',
    fontSize: 20,
  }, touchableOpacityStyle: {
    resizeMode: 'contain',
    padding: 10,
    height: 50,
    width: 50,
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
    backgroundColor: '#fa50e2',

    right: 30,
    bottom: height * 0.1,
    position: 'absolute'

  },
  touchableOpacityStyle2: {
    padding: 10,
    borderTopLeftRadius: 35,
    borderBottomEndRadius: 35,
    alignItems: 'flex-start',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.19,
    shadowRadius: 4.65,
    zIndex: 7,

    elevation: 2,

    right: 30,
    bottom: height * 0.18,
    position: 'absolute'

  }, action: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 0,
    paddingRight: "5%",
    marginTop: "1%",
    marginRight: width * 0.04

  },
})