import React from 'react';
import { Alert, View, Text, TextInput, Image, ScrollView, StyleSheet, Dimensions, RefreshControl, FlatList, TouchableHighlight } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ActivityIndicator, Avatar, } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@react-navigation/native';
import BottomNav from './BottomNav.js';
import { set } from 'react-native-reanimated';
const Stack = createStackNavigator();
var keys = ['admin', 'office_close', 'userToken', 'access', 'userToken2']
var z=""
const { width, height } = Dimensions.get("screen");
const AddDepScreen = ({  navigation }) => {
  const { colors } = useTheme();
  const [loader, setLoader] = React.useState(false)
  const [change, setChange] = React.useState(0);
  const [saving, setSaving] = React.useState(false)
  const [ref, setRef] = React.useState(false)
  const handleNameChange = (val) => { setData({ ...data, name: val }); }
  
  const [data, setData] = React.useState({
    name: '',
  })
  const onRefresh = () => {
    setRef(true);
    setTimeout(function () { setRef(false) }, 1500);

  }
  
  const save = () => {
    if(saving==true){
      return
    }
    setSaving(true)
    
    if (data.name == "") {
      Alert.alert('Enter Name!', 'Department Name Field Cannot Be Empty.', [
        { text: 'Okay' }
      ]);

      setSaving(false)
      return

    }else{
      try {
        setSaving(true)
        fetch('http://payrollv2.herokuapp.com/department/add_deppost' + z, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: data.name,
          })
        }).then((response) => response.json())
          .then((data) => {
            setSaving(false)
            if(data==false){
              Alert.alert('No Access!', 'Ask Admin to provide you the access of this page !.', [
                { text: 'Okay' }
              ]);
              setRef(false)
              setLoader(true)
              return 
            }
            if (data.message == 'true') {
              setData({...data,name:''})
              setChange(change+1)
              Alert.alert('Success', 'Department Added Successfully.', [
                { text: 'Okay', onPress: () => { navigation.navigate('DepStackScreen', { refresh: true }) } }
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
        return

      }
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
      setLoader(true)
      z = '?id=' + encodeURIComponent(id) + '&platform=APP&admin=' + encodeURIComponent(admin) + '&id2=' + encodeURIComponent(id2) + "&off=" + encodeURIComponent(off) + "&access=" + encodeURIComponent(access);
      //console.log(api2)
      //await api1(api).then(() => { setLoader(true) })


    })
  }, [navigation,change])

  return (
    <View style={styles.container}>
      <ScrollView refreshControl={
        <RefreshControl
          refreshing={ref}
          onRefresh={onRefresh}
        />}>
        {loader ? <View>
          <Animatable.View
            animation="bounceInLeft"
            style={[
              styles.card, { backgroundColor: colors.backgroundColor }
            ]}>


            

            <View style={styles.tab}>
              <Text style={[styles.heading, { color: colors.text }]}>
                Name
                                </Text>
              <TextInput
                placeholder="Department"
                style={[styles.textInput, { color: colors.text }]}
                autoCapitalize="none"
                onChangeText={(val) => handleNameChange(val)}
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
                colors={['#d42424', '#96358d']}
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
          </Animatable.View>


        </View> : <ActivityIndicator style={styles.loader} size="large" color="#c2ba4a" />}

      </ScrollView>
      <BottomNav name="" color='#c2ba4a' navigation={navigation}></BottomNav>
    </View>
  )
}

const AddDepStackScreen = ({ route, navigation }) => {

  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#c2ba4a',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold'
      }
    }}>
      <Stack.Screen
        name="Add Department"
        component={AddDepScreen}
        options={{
          title: 'Add Department ',
          headerLeft: () => (
            <FontAwesome.Button name="bars" size={25} backgroundColor="#c2ba4a" onPress={() => navigation.openDrawer()} />
          )
        }}
      />
    </Stack.Navigator>
  );
}
export default AddDepStackScreen;

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
  }, button: {
    alignItems: 'center',
    marginTop: 5
  }, signIn: {
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    flexDirection: 'row'
  }, textInput: {
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 1,
    flexDirection: 'column',
    width: width*0.9,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    paddingBottom: 5,
    marginTop: 5,
  }, tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    width: '100%',
    flexWrap: 'wrap'

  }, heading: {
    width: "40%",
    color: '#05375a',
    fontSize: 18
  }, card: {
    marginTop: '2%',
    borderRadius: 10,
    margin: '3%',
    marginTop: "1%",
    marginBottom: "1%",
    padding: 2,
  },
})