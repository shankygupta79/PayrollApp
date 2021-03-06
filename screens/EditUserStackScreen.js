import React from 'react';
import { Alert, View, Text, TextInput, Image, ScrollView, StyleSheet, Dimensions, RefreshControl, FlatList, TouchableHighlight } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Feather from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Checkbox, ActivityIndicator, Avatar, } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@react-navigation/native';
import BottomNav from './BottomNav.js';
import { set } from 'react-native-reanimated';
const Stack = createStackNavigator();
var keys = ['admin', 'office_close', 'userToken', 'access', 'userToken2']
var coloring = ""
var z = ""
var z1 = ""
var uid=""
const { width, height } = Dimensions.get("screen");
const EditUserScreen = (props, { route, navigation }) => {
  const { colors } = useTheme();
  navigation = props.navigation
  coloring = colors
  const [button, setButton] = React.useState(true)
  const [loader, setLoader] = React.useState(false)
  const [ref, setRef] = React.useState(false)
  const [change, setChange] = React.useState(0);
  const [checked1, setChecked1] = React.useState(false);
  const [checked2, setChecked2] = React.useState(false);
  const [checked3, setChecked3] = React.useState(false);
  const [checked4, setChecked4] = React.useState(false);
  const [checked5, setChecked5] = React.useState(false);
  const [checked6, setChecked6] = React.useState(false);
  const [checked7, setChecked7] = React.useState(false);
  const [checked8, setChecked8] = React.useState(false);
  const [checked9, setChecked9] = React.useState(false);
  const [checked10, setChecked10] = React.useState(false);

  const [data, setData] = React.useState({
    username: '',
    mail: '',
    check_textInputChange: false,
    check_name: true,
    check_mail: true,
    id: 0,
  });
  const textInputChange = (val) => {
    if (val.length !== 0) {
      setData({
        ...data,
        username: val,
        check_textInputChange: true
      });
    } else {
      setData({
        ...data,
        username: val,
        check_textInputChange: false
      });
    }
  }

  const mailfun = (val) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)) {
      setData({
        ...data,
        mail: val,
        check_mail: true
      });
    } else {
      setData({
        ...data,
        mail: val,
        check_mail: false
      });
    }
  }

  const onRefresh = () => {
    setRef(true);
    api1()

  }
  const api1 = () => {
    setLoader(false)
    console.log("called")
    var api="https://payrollv2.herokuapp.com/users/api/user?idx="+uid+z1
    fetch(api)
      .then((response) => response.json())
      .then((responseJson) => {
        var x = responseJson
        data.username = x.username
        data.mail = x.emailId
        data.id = x.id
        var arr = x.access.split(";")
        setChecked1(arr[0] == "true"); setChecked6(arr[5] == "true");
        setChecked2(arr[1] == "true"); setChecked7(arr[6] == "true");
        setChecked3(arr[2] == "true"); setChecked8(arr[7] == "true");
        setChecked4(arr[3] == "true"); setChecked9(arr[8] == "true");
        setChecked5(arr[4] == "true"); setChecked10(arr[9] == "true");
        setRef(false)
        setLoader(true)
      }).catch((error) => {
        console.error(error);
        Alert.alert('Error Occured!', 'Some Error Occured.' + error, [
          { text: 'Okay' }
        ]);
        setLoader(true)
        return
      })

  }

  const save = () => {
    if (button == false) {
      return
    }
    if (data.check_mail == false) {
      Alert.alert('Check Mail!', 'Not an appropriate Mail ID.', [
        { text: 'Okay' }
      ]);
      return
    }

    var x = checked1 + ";" + checked2 + ";" + checked3 + ";" + checked4 + ";" + checked5 + ";" + checked6 + ";";
    var y = x + checked7 + ";" + checked8 + ";" + checked9 + ";" + checked10;
    console.log(y)
    setButton(false)

    if (button == false) {
      return
    }
    if (data.check_mail == false) {
      Alert.alert('Check Mail!', 'Not an appropriate Mail ID.', [
        { text: 'Okay' }
      ]);
      return
    }

    var x = checked1 + ";" + checked2 + ";" + checked3 + ";" + checked4 + ";" + checked5 + ";" + checked6 + ";";
    var y = x + checked7 + ";" + checked8 + ";" + checked9 + ";" + checked10;
    setButton(false)
    try {
      fetch('http://payrollv2.herokuapp.com/users/edit_userpost' + z, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          y: y,
          name: data.username,
          id: data.id

        })
      }).then((response) => response.json())
        .then((data) => {
          setButton(true)
          if (data.message == 'true') {
            
            setChange(change + 1)
            Alert.alert('Success', 'User Edited Successfully.', [
              { text: 'Okay', onPress: () => { navigation.navigate('UsersStackScreen', { refresh: true }) } }
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
      setButton(true)
      return

    }
  };

  React.useEffect(() => {
    AsyncStorage.multiGet(keys, async (err, stores) => {
      setLoader(false)
      var admin = stores[0][1];
      var off = stores[1][1];
      var id = stores[2][1];
      var access = stores[3][1];
      var id2 = stores[4][1];
      uid=props.user.id
      z = '?id=' + encodeURIComponent(id) + '&platform=APP&admin=' + encodeURIComponent(admin) + '&id2=' + encodeURIComponent(id2) + "&off=" + encodeURIComponent(off) + "&access=" + encodeURIComponent(access);
      z1= '&id=' + encodeURIComponent(id) + '&platform=APP&admin=' + encodeURIComponent(admin) + '&id2=' + encodeURIComponent(id2) + "&off=" + encodeURIComponent(off) + "&access=" + encodeURIComponent(access);
      api1()
      
      //console.log(api2)
      //await api1(api).then(() => { setLoader(true) })


    })
  }, [navigation, props])
  return (
    <View style={styles.container}>
      <ScrollView refreshControl={
        <RefreshControl
          refreshing={ref}
          onRefresh={onRefresh}
        />}>
        {loader ? <View>

          <Animatable.View
            animation="fadeInUpBig"
            style={[styles.footer, {
              backgroundColor: colors.background
            }]}>
            <ScrollView>


              <Text style={[styles.text_footer, {
                marginTop: 0, color: colors.text
              }]}>Username</Text>
              <View style={styles.action}>
                <FontAwesome
                  name="user-o"
                  color="red"
                  size={20}
                />
                <TextInput
                  placeholder="Your Username"
                  style={[styles.textInput, { color: colors.text }]}
                  autoCapitalize="none"
                  onChangeText={(val) => textInputChange(val)}
                  value={data.username}
                />
                {data.check_textInputChange ?
                  <Animatable.View
                    animation="bounceIn"
                  >
                    <Feather
                      name="check-circle"
                      color="green"
                      size={20}
                    />
                  </Animatable.View>
                  : null}
              </View>

              <Text style={[styles.text_footer, {
                marginTop: 15, color: colors.text
              }]}>Email</Text>
              <View style={styles.action}>
                <FontAwesome
                  name="envelope"
                  color="red"
                  size={20}
                />
                <TextInput
                  placeholder="Your Email"
                  style={[styles.textInput, { color: colors.text }]}
                  autoCapitalize="none"
                  onChangeText={(val) => mailfun(val)}
                  value={data.mail}
                />
                {data.check_mail ?
                  <Animatable.View
                    animation="bounceIn"
                  >
                    <Feather
                      name="check-circle"
                      color="green"
                      size={20}
                    />
                  </Animatable.View>
                  : null}
              </View>

              <Text style={[styles.text_footer, {
                marginTop: 20, marginBottom: 15, color: colors.text
              }]}>Module Access</Text>
              <View style={{ flex: 1, flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                <Text style={[styles.text_footer, { fontSize: 16, width: width * 0.4, color: colors.text }]}>
                  Employee
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: width * 0.3 }}>
                  <Checkbox
                    status={checked1 ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setChecked1(!checked1);
                    }}
                    color={'coral'}
                  />
                  <Text style={{ color: colors.text }}>
                    View
              </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', width: width * 0.3 }}>
                  <Checkbox
                    status={checked2 ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setChecked2(!checked2);
                    }}
                    color={'coral'}
                  />
                  <Text style={{ color: colors.text }}>
                    Edit
              </Text>
                </View>
              </View>

              <View style={{ flex: 1, flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                <Text style={[styles.text_footer, { fontSize: 16, width: width * 0.4, color: colors.text }]}>
                  Department
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: width * 0.3 }}>
                  <Checkbox
                    status={checked3 ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setChecked3(!checked3);
                    }}
                    color={'coral'}
                  />
                  <Text style={{ color: colors.text }}>
                    View
              </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', width: width * 0.3 }}>
                  <Checkbox
                    status={checked4 ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setChecked4(!checked4);
                    }}
                    color={'coral'}
                  />
                  <Text style={{ color: colors.text }}>
                    Edit
              </Text>
                </View>
              </View>

              <View style={{ flex: 1, flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                <Text style={[styles.text_footer, { fontSize: 16, width: width * 0.4, color: colors.text }]}>
                  Attendance
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: width * 0.3 }}>
                  <Checkbox
                    status={checked5 ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setChecked5(!checked5);
                    }}
                    color={'coral'}
                  />
                  <Text style={{ color: colors.text }}>
                    View
              </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', width: width * 0.3 }}>
                  <Checkbox
                    status={checked6 ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setChecked6(!checked6);
                    }}
                    color={'coral'}
                  />
                  <Text style={{ color: colors.text }}>
                    Edit
              </Text>
                </View>
              </View>

              <View style={{ flex: 1, flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                <Text style={[styles.text_footer, { fontSize: 16, width: width * 0.4, color: colors.text }]}>
                  Holidays
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: width * 0.3 }}>
                  <Checkbox
                    status={checked7 ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setChecked7(!checked7);
                    }}
                    color={'coral'}
                  />
                  <Text style={{ color: colors.text }}>
                    View
              </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', width: width * 0.3 }}>
                  <Checkbox
                    status={checked8 ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setChecked8(!checked8);
                    }}
                    color={'coral'}
                  />
                  <Text style={{ color: colors.text }}>
                    Edit
              </Text>
                </View>
              </View>

              <View style={{ flex: 1, flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                <Text style={[styles.text_footer, { fontSize: 16, width: width * 0.4, color: colors.text }]}>
                  Payslips
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: width * 0.3 }}>
                  <Checkbox
                    status={checked9 ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setChecked9(!checked9);
                    }}
                    color={'coral'}
                  />
                  <Text style={{ color: colors.text }}>
                    View
              </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Checkbox
                    status={checked10 ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setChecked10(!checked10);
                    }}
                    color={'coral'}
                  />
                  <Text style={{ color: colors.text }}>
                    Edit
              </Text>
                </View>
              </View>



              <View style={styles.button}>
                <TouchableOpacity
                  style={styles.signIn}
                  onPress={() => { save() }}
                >
                  <LinearGradient
                    colors={['#fc6a84', '#ad5565', '#fc6a84']}
                    style={styles.signIn}
                    start={[-1, 0]}
                    end={[1, 0]}
                  >
                    <Text style={[styles.textSign, {
                      color: '#fff'
                    }]}>Save</Text>
                    {!button ? <ActivityIndicator style={{ marginLeft: "5%" }} size="small" color="white" /> : null}
                  </LinearGradient>
                </TouchableOpacity>

              </View>
            </ScrollView>




          </Animatable.View>



        </View> : <ActivityIndicator style={styles.loader} size="large" color="#fc6a84" />}

      </ScrollView>
      <BottomNav name="" color='#fc6a84' navigation={navigation}></BottomNav>
    </View>
  )
}

const EditUserStackScreen = ({ route, navigation }) => {

  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#fc6a84',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold'
      }
    }}>
      <Stack.Screen
        name="Edit User"
        options={{
          title: 'Edit User ',
          headerLeft: () => (
            <FontAwesome.Button name="bars" size={25} backgroundColor="#fc6a84" onPress={() => navigation.openDrawer()} />
          )
        }}
      >{props => <EditUserScreen {...props} user={route.params.user} />}</Stack.Screen>
    </Stack.Navigator>
  );
}
export default EditUserStackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,

  }, loader: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    marginTop: "50%",
  }, header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50
  },
  footer: {
    flex: Platform.OS === 'ios' ? 3 : 5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  button: {
    alignItems: 'center',
    marginTop: 50
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row'
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20
  },
  color_textPrivate: {
    color: 'grey'
  }
})