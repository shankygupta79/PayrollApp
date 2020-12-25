import React from 'react';
import { Alert, View, Text, TextInput, Image, ScrollView, StyleSheet, Dimensions, RefreshControl, FlatList, TouchableHighlight } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ContentLoader from "react-native-easy-content-loader";
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
var date = "01-01-2000"
const { width, height } = Dimensions.get("screen");
const AddHolScreen = ({ route, navigation }) => {
  const { colors } = useTheme();

  const [loader, setLoader] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [ref, setRef] = React.useState(false)
  var sortfield="Date"
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
  const handleNameChange = (val) => { setData({ ...data, name: val }); }
  const handleConfirm = (dat) => {
    console.log("A date has been picked: ", dat);
    date = dat.getDate() + "-" + (dat.getMonth() + 1) + "-" + dat.getFullYear()
    hideDatePicker();
  };
  const [data, setData] = React.useState({
    name: '',
  })
  const onRefresh = () => {
    setRef(true);
    setTimeout(function () { setRef(false) }, 1500);

  }
  
  const save = () => {
    console.log(data.name)
    console.log(date)
    if (data.name == "") {
      Alert.alert('Enter Name!', 'Holiday Name Field Cannot Be Empty.', [
        { text: 'Okay' }
      ]);

      setSaving(false)
      return

    }
    setSaving(true)
    setSaving(false)
  };
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {

    setDatePickerVisibility(false);
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
      //await api1(api).then(() => { setLoader(true) })


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
          <Animatable.View
            animation="fadeInUpBig"
            style={[
              styles.card, { backgroundColor: colors.backgroundColor }
            ]}>


            <View style={styles.tab}>
              <Text style={[styles.heading, { color: colors.text }]}>
                Date </Text>
              <TouchableOpacity onPress={() => showDatePicker()} style={[styles.textInput, { flexDirection: 'row' }]}>
                <FontAwesome name="calendar" size={20} color="orange" style={{ marginRight: 8 }} />
                <Text style={{ color: colors.text }}>
                  {date}
                </Text>
              </TouchableOpacity>

            </View>

            <View style={styles.tab}>
              <Text style={[styles.heading, { color: colors.text }]}>
                Name
                                </Text>
              <TextInput
                placeholder="Holiday for some purpose"
                style={[styles.textInput, { color: colors.text }]}
                autoCapitalize="none"
                onChangeText={(val) => handleNameChange(val)}
              />
            </View>
          
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"

            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
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


        </View> : <ActivityIndicator style={styles.loader} size="large" color="orange" />}

      </ScrollView>
      <BottomNav name="" color='orange' navigation={navigation}></BottomNav>
    </View>
  )
}

const AddHolStackScreen = ({ route, navigation }) => {

  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: 'orange',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold'
      }
    }}>
      <Stack.Screen
        name="Add Holiday"
        component={AddHolScreen}
        options={{
          title: 'Add Holiday ',
          headerLeft: () => (
            <FontAwesome.Button name="bars" size={25} backgroundColor="orange" onPress={() => navigation.openDrawer()} />
          )
        }}
      />
    </Stack.Navigator>
  );
}
export default AddHolStackScreen;

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
    marginTop: 15,
    color: '#05375a',
    fontSize: 18,
    width: "40%"
  }, card: {
    marginTop: '2%',
    borderRadius: 10,
    margin: '3%',
    marginTop: "1%",
    marginBottom: "1%",
    padding: 2,
  },
})