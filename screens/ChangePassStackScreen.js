import React from 'react';
import { Alert,View, Text, TextInput, ScrollView, StyleSheet, Dimensions, RefreshControl, FlatList, TouchableHighlight } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ActivityIndicator, } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { useTheme } from '@react-navigation/native';
import BottomNav from './BottomNav.js';
const Stack = createStackNavigator();
var keys = ['admin', 'office_close', 'userToken', 'access', 'userToken2']
const { width, height } = Dimensions.get("screen");
const ChangePassScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
 
  const [loader, setLoader] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [pass1, setPass1] = React.useState("")
  const [pass2, setPass2] = React.useState("")
  const [pass3, setPass3] = React.useState("")
  const [ref, setRef] = React.useState(false)
  const onRefresh = () => {
    setRef(true);
    setTimeout(function () { setRef(false) }, 1500);

  }
  const save = () => {
    console.log(pass1)
    console.log(pass2)
    console.log(pass3)
    if (pass1=="" || pass2=="" || pass3 == "") {
      Alert.alert('Enter Password!', 'Password Field Cannot Be Empty.', [
        { text: 'Okay' }
      ]);

      setSaving(false)
      return

    }
    if (pass2!=pass3) {
      Alert.alert('Password Dont Match!', 'Confirm your new Password.', [
        { text: 'Okay' }
      ]);

      setSaving(false)
      return

    }
    setSaving(true)
    setTimeout(()=>{
      setSaving(false)
    },1000)
    
  };
  React.useEffect(() => {
    AsyncStorage.multiGet(keys, async (err, stores) => {
      setLoader(false)
      var admin = stores[0][1];
      var off = stores[1][1];
      var id = stores[2][1];
      var access = stores[3][1];
      var id2 = stores[4][1];
      setLoader(true)
      //console.log(api2)
      //await api1(api, api2).then(() => { setLoader(true) })


    })
  }, [navigation])
  return (
    <View style={styles.container}>
      <ScrollView refreshControl={
        <RefreshControl
          refreshing={ref}
          onRefresh={onRefresh}
        />}>
        {loader ? <View style={{justifyContent:'center',flexDirection:'column',alignItems:'center',flex:1,}}>
          <View style={styles.tab}>
            <Text style={[styles.heading, { color: colors.text }]}>
              Current Password
                                </Text>
            <TextInput
              placeholder="Current Password"
              style={[styles.textInput, { color: colors.text }]}
              autoCapitalize="none"
              onChangeText={(val) => setPass1(val)}
            />
          </View>
          <View style={styles.tab}>
            <Text style={[styles.heading, { color: colors.text }]}>
              New Password
                                </Text>
            <TextInput
              placeholder="New Password"
              style={[styles.textInput, { color: colors.text }]}
              autoCapitalize="none"
              onChangeText={(val) => setPass2(val)}
            />
          </View>
          <View style={styles.tab}>
            <Text style={[styles.heading, { color: colors.text }]}>
              Confirm Password
                                </Text>
            <TextInput
              placeholder="Confirm New Password"
              style={[styles.textInput, { color: colors.text }]}
              autoCapitalize="none"
              onChangeText={(val) => setPass3(val)}
            />
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              style={[styles.signIn, {
                marginTop: 15
              }]}
              onPress={() => { console.log("SAVED"); save(); }}
            >
              <LinearGradient
                colors={['#d083fc', '#b16cd9']}
                style={styles.signIn}
                start={[-1, 0]}
                end={[1, 0]}
              >

                <Text style={[styles.textSign, {
                  color: '#fffff0', fontWeight: 'bold'
                }]}>
                  SAVE </Text>
                {saving ? <ActivityIndicator style={{ marginLeft: "5%" }} size="small" color="#fffff0" /> : null}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View> : <ActivityIndicator style={styles.loader} size="large" color="#d083fc" />}

      </ScrollView>
      <BottomNav name="" color='#d083fc' navigation={navigation}></BottomNav>
    </View>
  )
}

const ChangePassStackScreen = ({ navigation }) => {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#d083fc',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold'
      }
    }}>
      <Stack.Screen
        name="Chnage Password"
        component={ChangePassScreen}
        options={{
          title: ' Change Password ',
          headerLeft: () => (
            <FontAwesome.Button name="bars" size={25} backgroundColor="#d083fc" onPress={() => navigation.openDrawer()} />
          )
        }}
      />
    </Stack.Navigator>
  );
}
export default ChangePassStackScreen;

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
  },tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    width: '100%',
    flexWrap: 'wrap'

  }, heading: {
    marginTop: 15,
    color: '#05375a',
    fontSize: 18,
    width: width*0.9
  },textInput: {
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 1,
    flexDirection: 'column',
    width: width*0.9,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    paddingBottom: 5,
    marginTop: 5,
  },signIn: {
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 50,
    width:width*0.8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row'
  },
})