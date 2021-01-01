import React from 'react';
import { Alert, View, Text, Image, ScrollView, StyleSheet, Dimensions, RefreshControl, } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ContentLoader from "react-native-easy-content-loader";
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Avatar, } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { useTheme } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import BottomNav from './BottomNav.js';
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';
import Ripple from 'react-native-material-ripple';
var { width, height } = Dimensions.get('window');
const Stack = createStackNavigator();
var sortfield = 'status'
var id = ""
var apix = ""
var myArray = []
var myArray2 = []
var map = ["Name", "Status", "Date of Joining", "Designation"]
const keys = ['admin', 'office_close', 'userToken', 'access', 'userToken2']
const EmployeeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [count, setCount] = React.useState(0);
  const [change, setChange] = React.useState(0);
  const [visible, setVisible] = React.useState(false);
  const [loader, setLoader] = React.useState(false)
  const [showin, setShowin] = React.useState(false)
  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const sort = (key) => {
    console.log(key)
    sortfield = key
    if (key == 'Date of Joining') {
      sortfield = "doj"
      myArray.sort(comparedate)
    } else if (key == "Designation") {
      sortfield = "des"
      myArray.sort(compare)
    } else if (key == "Name") {
      sortfield = "name"
      myArray.sort(compare)
    } else {
      sortfield = "status"
      myArray.sort(compare)
    }

    setVisible(false)
    //console.log(myArray)
  }
  const [ref, setRef] = React.useState(false)
  const [select1, setSelect1] = React.useState("None")
  const [visible1, setVisible1] = React.useState(false)
  const onRefresh = () => {
    setRef(true);
    api1(apix);

  }
  const compare = (a, b) => {
    var nameA = a[sortfield]
    var nameB = b[sortfield]
    if (nameA < nameB) { return -1; }
    if (nameA > nameB) { return 1; }
    return 0;
  }
  const comparedate = (a, b) => {
    var nameA = a[sortfield]
    var nameB = b[sortfield]
    nameA = nameA.slice(6, 10) + nameA.slice(3, 5) + nameA.slice(0, 2)
    nameB = nameB.slice(6, 10) + nameB.slice(3, 5) + nameB.slice(0, 2)
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }
  const api1 = (api) => {
    setLoader(false)
    console.log("called")
    console.log(api)
    fetch(api)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        if(responseJson==false){
          Alert.alert('No Access!', 'Ask Admin to provide you the access of this page !.', [
            { text: 'Okay' }
          ]);
          setRef(false)
          setLoader(true)
          return 
        }
        myArray = []
        myArray2 = []
        for (var i = 0; i < responseJson.length; i++) {
          if (responseJson[i].status == 'Active') {
            myArray.push(responseJson[i])
          } else {
            myArray2.push(responseJson[i])
          }
        }
        setChange(change+1)
        setRef(false)
        console.log("Loaded")
        setLoader(true)
        return
      }).catch((error) => {
        console.error(error);
        Alert.alert('Error Occured!', 'Some Error Occured.' + error, [
          { text: 'Okay' }
        ]);
        setLoader(false)
        setRef(false)
        return
      });

  }
  React.useEffect(() => {
    AsyncStorage.multiGet(keys, (err, stores) => {
      setLoader(false)
      var admin = stores[0][1];
      var off = stores[1][1];
      var id = (stores[2][1]);
      var access = stores[3][1];
      var id2 = stores[4][1];
      apix = 'https://payrollv2.herokuapp.com/employee/api/quickemp?id=' + encodeURIComponent(id) + '&platform=APP&admin=' + encodeURIComponent(admin) + '&id2=' + encodeURIComponent(id2) + "&off=" + encodeURIComponent(off) + "&access=" + encodeURIComponent(access);
      api1(apix)

    });
  }, [navigation])
  React.useEffect(() => {
  }, [change])


  return (

    <View style={styles.container}>
      <View style={styles.touchableOpacityStyle}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('AddEmpStackScreen')}>
          <FontAwesome name="plus" size={25} backgroundColor="orange" color="white" />

        </TouchableOpacity>
      </View>
      <ScrollView refreshControl={
        <RefreshControl
          refreshing={ref}
          onRefresh={onRefresh}
        />}>


        {loader ? <View>



          <View style={[styles.sort]}>
            <Ripple style={[styles.sort2, { backgroundColor: colors.back2 }]} onPress={() => { setShowin(!showin) }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >

                <Text style={{ fontWeight: 'bold', color: colors.text }}>
                  {""} Show In-Actives {" "}
                </Text>

                {!showin ? <FontAwesome name="caret-up" size={18} color={colors.text} /> :
                  <FontAwesome name="caret-down" size={18} color={colors.text} />
                }


              </View>

            </Ripple>
            <Ripple style={[styles.sort2, { backgroundColor: colors.back2 }]} onPress={() => { setVisible1(!visible1) }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} >

                <Text style={{ fontWeight: 'bold', color: colors.text }}>
                  {""} Sort By :
                                </Text>
                <Text style={{ color: colors.text }}>
                  {" "}{select1}{"  "}
                </Text>
                <FontAwesome name="sort-alpha-desc" size={18} color={colors.text} />


              </View>

            </Ripple>
          </View>
          <SinglePickerMaterialDialog
            title={'Select Sort By '}
            items={map.map((row, index) => ({ value: index, label: row }))}
            visible={visible1}
            selectedItem={select1}
            colorAccent={'green'}
            onCancel={() => setVisible1(false)}
            scrolled={true}
            onOk={result => {
              setVisible1(false);
              sort(result.selectedItem.label)
              setSelect1(result.selectedItem.label);
            }}
          />
          <ScrollView style={[{ marginTop: 5 }]}

          >
            <View style={[styles.blck, { backgroundColor: 'green' }]}>
              <View style={{ alignItems: 'center' }}>
                <Text style={[styles.text2, { color: 'white' }]}>
                  Active Employees
                            </Text>

              </View>
            </View>

            {myArray.map((item, key) => {
              return <Animatable.View
                animation="fadeInUpBig"
                style={{ borderRadius: 20, margin: '0.5%', backgroundColor: colors.back2 }} key={item.name} >
                <Ripple rippleDuration={200} rippleColor="rgb(100, 100, 100)" style={[styles.list, {

                }]} onPress={() => {
                  navigation.navigate('EditEmpStackScreen', { emp_id: item.emp_id })
                }
                }>



                  <Avatar.Image size={74} source={{ uri: item.photo }} />
                  <View style={{ flex: 1, flexDirection: 'column', width: width * 0.7 }}>
                    <View style={{ alignItems: 'center', width: width * 0.7 }}>
                      <Text style={[{ fontSize: 18, paddingBottom: 4, color: colors.text, fontWeight: 'bold' }]} numberOfLines={2}>{item.name} </Text>
                    </View>
                    <View style={[{ alignItems: 'center', width: width * 0.7 }]}>

                      <Text style={{ color: colors.text }} numberOfLines={1}>
                        {item.des}
                      </Text>
                    </View>
                    <View style={[{ alignItems: 'center', width: width * 0.7 }]}>

                      <Text style={{ color: colors.text }}>
                        ₹{item.salary}
                      </Text>
                    </View>
                  </View>

                </Ripple>


              </Animatable.View>




            }

            )}

            {showin ?
              <View>
                <View style={[styles.blck, { backgroundColor: 'green' }]}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={[styles.text2, { color: 'white' }]}>
                      In - Active Employees
                            </Text>

                  </View>
                </View>
                {myArray2.map((item, key) => {
                  return <Animatable.View
                    animation="fadeInUpBig"
                    style={{ borderRadius: 20, margin: '0.5%', backgroundColor: colors.back2 }} key={item.name} >
                    <Ripple rippleDuration={200} rippleColor="rgb(100, 100, 100)" style={[styles.list, {

                    }]} onPress={() => {
                      navigation.navigate('EditEmpStackScreen', { emp_id: item.emp_id })
                    }
                    }>



                      <Avatar.Image size={74} source={{ uri: item.photo }} />
                      <View style={{ flex: 1, flexDirection: 'column', width: width * 0.7 }}>
                        <View style={{ alignItems: 'center', width: width * 0.7 }}>
                          <Text style={[{ fontSize: 18, paddingBottom: 4, color: colors.text, fontWeight: 'bold' }]} numberOfLines={2}>{item.name} </Text>
                        </View>
                        <View style={[{ alignItems: 'center', width: width * 0.7 }]}>

                          <Text style={{ color: colors.text }} numberOfLines={1}>
                            {item.des}
                          </Text>
                        </View>
                        <View style={[{ alignItems: 'center', width: width * 0.7 }]}>

                          <Text style={{ color: colors.text }}>
                            ₹{item.salary}
                          </Text>
                        </View>
                      </View>

                    </Ripple>


                  </Animatable.View>




                }

                )}</View> : null}
          </ScrollView>
        </View>

          :
          <View style={styles.loader}>

            <ContentLoader
              active
              avatar
              pRows={2}
              loading={true}
              listSize={6}
              containerStyles={styles.loader}
            ></ContentLoader></View>}
      </ScrollView>
      <BottomNav name="Employee" color='green' navigation={navigation}></BottomNav>
    </View >
  );
};

const EmployeeStackScreen = ({ navigation }) => {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: 'green',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold'
      }

    }}>
      <Stack.Screen
        name="Employees"
        component={EmployeeScreen}
        options={{
          title: 'All Employees',
          headerLeft: () => (
            <FontAwesome.Button name="bars" size={25} backgroundColor="green" onPress={() => navigation.openDrawer()} />
          )
        }}

      />
    </Stack.Navigator>
  );
}
export default EmployeeStackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }, loader: {
    marginTop: "4%",
    marginLeft: "3%",
  }, overlay: {
    width: width,
    margin: "0%",
    padding: "5%",
    backgroundColor: "#f2f5f2",
    elevation: 5,
  }, list: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: "3%",
    marginRight: "3%",
    marginTop: "2%",
    padding: 1,
    marginBottom: "1%",
  }, table: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: "10%",
    marginRight: "15%", zIndex: 0,
  }, sortbut: {
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 1,
    fontFamily: "sans-serif-medium",
    padding: 5,
    margin: "5%",
    alignItems: 'center',
    backgroundColor: 'white',
    paddingLeft: "5%"
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
    backgroundColor: 'green',

    right: 30,
    bottom: 72,
    position: 'absolute'

  }, sort: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    margin: '0.1%',
    padding: '1%',
  }, sort2: {
    marginRight: '3%',
    margin: '1%',
    padding: '2%',
    borderRadius: 10,
  }, blck: {
    padding: "2%",
    margin: '0.5%',
    borderRadius: 20,
  }, text2: {
    fontSize: 15,
    fontWeight: 'bold'
  },
});
