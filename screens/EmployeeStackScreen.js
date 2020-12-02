import React from 'react';
import { View, Text,Image, ScrollView, StyleSheet, Dimensions, RefreshControl,} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ContentLoader from "react-native-easy-content-loader";
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Avatar, } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { useTheme } from '@react-navigation/native';
var { width, height } = Dimensions.get('window');
const Stack = createStackNavigator();
var sortfield = 'status'
var sortfield2 = 'Status'
var myArray = []
const keys = ['admin', 'office_close', 'userToken', 'access', 'userToken2']
const EmployeeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [visible, setVisible] = React.useState(false);
  const [loader, setLoader] = React.useState(false)
  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const sort = (key) => {
    console.log(key)
    sortfield = key
    if (key == 'doj') {
      sortfield2 = "Date of Joining"
      myArray.sort(comparedate)
    } else if (key == "des") {
      sortfield2 = "Designation"
      myArray.sort(compare)
    } else if (key == "name") {
      sortfield2 = "Name"
      myArray.sort(compare)
    } else {
      sortfield2 = "Status"
      myArray.sort(compare)
    }

    setVisible(false)
    //console.log(myArray)
  }
  const [ref, setRef] = React.useState(false)
  const onRefresh = () => {
    setRef(true);
    setTimeout(function () { setRef(false) }, 1500);

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
  React.useEffect(() => {
    AsyncStorage.multiGet(keys, (err, stores) => {
      setLoader(false)
      var admin = stores[0][1];
      var off = stores[1][1];
      var id = stores[2][1];
      var access = stores[3][1];
      var id2 = stores[4][1];
      api = 'https://payrollv2.herokuapp.com/employee/api/quickemp?id=' + encodeURIComponent(id) + '&platform=APP&admin=' + encodeURIComponent(admin) + '&id2=' + encodeURIComponent(id2) + "&off=" + encodeURIComponent(off) + "&access=" + encodeURIComponent(access);
      console.log(api)

      fetch(api)
        .then((response) => response.json())
        .then((responseJson) => {

          myArray = responseJson
          //console.log(myArray)

          //sort('status')
          setLoader(true)
        }
        )
        .catch((error) => {
          console.error(error);
        });


    });
  }, [navigation])
  return (

    <View style={styles.container}>
      <View style={styles.touchableOpacityStyle}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('AddHolStackScreen')}>
                    <FontAwesome name="plus" size={25} backgroundColor="orange" color="white" />

                </TouchableOpacity>
            </View>
      {loader ? <ScrollView refreshControl={
        <RefreshControl
          refreshing={ref}
          onRefresh={onRefresh}
        />}>
        

        
        <View style={{ backgroundColor: "#f2f5f2", padding: 5, flex: 1, alignItems: 'center',elevation:5, }}>
          <TouchableOpacity onPress={toggleOverlay}><Text style={{ borderColor: '#c8ccc9', borderWidth: 1, padding: 5, borderRadius: 10,fontFamily: "sans-serif-medium",backgroundColor:'white' }}>Sort By : {sortfield2}</Text></TouchableOpacity></View>
        
          
          {visible ? <View style={styles.overlay}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => sort('name')}><Text style={[styles.sortbut, { backgroundColor: 'name' === sortfield ? "#faf0cd" : "#ffff" }, { borderColor: 'name' === sortfield ? "orange" : "black" }]}>Name</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => sort('status')}><Text style={[styles.sortbut, { backgroundColor: 'status' === sortfield ? "#F7EABE" : "#ffff" }, { borderColor: 'status' === sortfield ? "orange" : "black" }]}>Status</Text></TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => sort('doj')}><Text style={[styles.sortbut, { backgroundColor: 'doj' === sortfield ? "#F7EABE" : "#ffff" }, { borderColor: 'doj' === sortfield ? "orange" : "black" }]}>Date of Joining</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => sort('des')}><Text style={[styles.sortbut, { backgroundColor: 'des' === sortfield ? "#F7EABE" : "#ffff" }, { borderColor: 'des' === sortfield ? "orange" : "black" }]}>Designation</Text></TouchableOpacity>
            </View>
          </View> : null}
          <ScrollView style={[{marginTop:5}]}

        >
          
          {myArray.map((item, key) => {
            return <View style={{ borderBottomColor: "grey", borderBottomWidth: 1 }} key={item.name} >
              <TouchableOpacity style={[styles.list, {
                backgroundColor: colors.background
              }]} onPress={() => {
                navigation.navigate('EditEmpStackScreen', { emp_id: item.emp_id })
              }
              }>



                <Avatar.Image size={74} source={{ uri: item.photo }} />
                <View style={{ flex: 6, flexDirection: 'column' }}>
                  <View style={{ flex: 1, alignItems: 'center', }}>
                    <Text style={[{ fontSize: 18, width: "50%", color: colors.text, fontWeight: 'bold' }]} numberOfLines={2}>{item.name} </Text>
                  </View>
                  <View style={styles.table}>
                    <Text style={{ color: colors.text, }} numberOfLines={1}>
                      ID : {item.emp_id}
                    </Text>
                    <Text style={{ color: colors.text, marginLeft: "40%" }} numberOfLines={1}>
                      {item.des}
                    </Text>
                  </View>
                  <View style={styles.table}>
                    <Text style={{ color: colors.text }}>
                      {item.doj}
                    </Text >
                    <Text style={{ color: colors.text }}>
                      ₹{item.salary}
                    </Text>
                  </View>
                </View>

              </TouchableOpacity>

            </View>
            


          }
          
          )}</ScrollView>

      </ScrollView>
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
    elevation:5,
  }, list: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: "3%",
    marginRight: "3%",
    marginTop: "2%",
    padding:1,
    marginBottom:"1%",
  }, table: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: "10%",
    marginRight: "15%",zIndex:0,
  }, sortbut: {
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 1,
    fontFamily: "sans-serif-medium",
    padding: 5,
    margin: "5%",
    alignItems: 'center',
    backgroundColor:'white',
    paddingLeft:"5%"
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
        bottom: 30,
        position: 'absolute'
    
  },
});
