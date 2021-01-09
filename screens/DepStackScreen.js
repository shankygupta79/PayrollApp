import React from 'react';
import { View, Alert, Text, Image, ScrollView, StyleSheet, Dimensions, RefreshControl, FlatList, TouchableHighlight } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ActivityIndicator, Avatar, } from 'react-native-paper';

import { SinglePickerMaterialDialog } from 'react-native-material-dialog';
import AsyncStorage from '@react-native-community/async-storage';
import { useTheme } from '@react-navigation/native';
const { width, height } = Dimensions.get("screen");
import Ripple from 'react-native-material-ripple';
import BottomNav from './BottomNav.js';
const Stack = createStackNavigator();
var myArray = []
var api = ""
var z = ""
var sortfield = "Date"
var map = ['Name', 'Employee Count']
var keys = ['admin', 'office_close', 'userToken', 'access', 'userToken2']
const DepScreen = ({ route, navigation }) => {
    const { colors } = useTheme();
    const [loader, setLoader] = React.useState(false)
    const [select1, setSelect1] = React.useState("None")

    const [change, setChange] = React.useState(0);
    const [visible1, setVisible1] = React.useState(false)
    const [ref, setRef] = React.useState(false)
    const onRefresh = () => {
        if (ref == true) {
            return
        }
        setRef(true);
        api1(api)
        setTimeout(function () { setRef(false) }, 1500);

    }
    const sort = (key) => {
        console.log(key)
        sortfield = key
        if (key == 'Name') {
            sortfield = "dep"
        } else if (key == "Employee Count") {
            sortfield = "depcount"
        }
        myArray.sort(compare)

    }
    const compare = (a, b) => {
        var nameA = a[sortfield]
        var nameB = b[sortfield]
        if (nameA < nameB) { return -1; }
        if (nameA > nameB) { return 1; }
        return 0;
    }

    const api1 = async (api) => {
        setLoader(false)
        fetch(api)
            .then((response) => response.json())
            .then((responseJson) => {
                if(Array.isArray(responseJson)  && responseJson==false){
                    setRef(false)
                    setLoader(true)
                    return
                }
                if(responseJson==false){
                    Alert.alert('No Access!', 'Ask Admin to provide you the access of this page !.', [
                      { text: 'Okay' }
                    ]);
                    setRef(false)
                    setLoader(true)
                    return 
                  }
                myArray = responseJson
                console.log("Loaded")
                sort('Name')
                setChange(change + 1)
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
    const deleteit = (obj) => {
        if (loader == false) {

            return
        }
        setLoader(false)
        try {
            fetch('http://payrollv2.herokuapp.com/department/delete?idx='+ obj.dep+ z, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                idx: obj.dep,
              })
            }).then((response) => response.json())
              .then((data) => {
                setLoader(true)
                if (data.message == 'true') {
                  setChange(change+1)
                  Alert.alert('Success', 'Department Deleted Successfully.', [
                    { text: 'Okay', onPress: () => { onRefresh() } }
                  ]);
                  return
                } else {
                  Alert.alert('Some Error!', 'Try Again Some Error.', [
                    { text: 'Okay' }
                  ]);
                  setLoader(true)
                  return
                }
    
              })
    
          } catch {
            Alert.alert('Some Error!', 'Try Again Some Error.', [
              { text: 'Okay' }
            ]);
            setLoader(true)
            return
    
          }

    }
    const deletefun = (obj) => {
        Alert.alert('Delete Dep !', 'Are you sure to selete the Dep ?', [
            { text: 'Cancel' },
            { text: 'Okay', onPress: () => { deleteit(obj) } }

        ]);
    }
    React.useEffect(() => {
        AsyncStorage.multiGet(keys, async (err, stores) => {
            setLoader(false)
            var emp_id = 1
            var admin = stores[0][1];
            var off = stores[1][1];
            var id = stores[2][1];
            var access = stores[3][1];
            var id2 = stores[4][1];
            z = '&id=' + encodeURIComponent(id) + '&platform=APP&admin=' + encodeURIComponent(admin) + '&id2=' + encodeURIComponent(id2) + "&off=" + encodeURIComponent(off) + "&access=" + encodeURIComponent(access);
            api = 'https://payrollv2.herokuapp.com/department/api/dep2?id=' + encodeURIComponent(id) + '&platform=APP&admin=' + encodeURIComponent(admin) + '&id2=' + encodeURIComponent(id2) + "&off=" + encodeURIComponent(off) + "&access=" + encodeURIComponent(access);
            api1(api)




        })
    }, [navigation,])
    React.useEffect(() => {
    }, [change])
    return (

        <View style={styles.container}>
            <View style={styles.touchableOpacityStyle}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('AddDepStackScreen')}>
                    <FontAwesome name="plus" size={25} backgroundColor="#c2ba4a" color="white" />

                </TouchableOpacity>
            </View>
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={ref}
                    onRefresh={onRefresh}
                />}>

                {loader ? <View>
                    <View style={[styles.sort]}>
                        <View style={[styles.sort2, { backgroundColor: colors.back2 }]}>
                            <Ripple style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} onPress={() => { setVisible1(!visible1) }}>

                                <Text style={{ fontWeight: 'bold', color: colors.text }}>
                                    {""} Sort By :
                                </Text>
                                <Text style={{ color: colors.text }}>
                                    {" "}{select1}{"  "}
                                </Text>
                                <FontAwesome name="sort-alpha-desc" size={18} color={colors.text} />


                            </Ripple>
                        </View>
                    </View>
                    <View style={[styles.blck, { backgroundColor: '#c2ba4a' }]}>
                        <View style={styles.table}>

                            <Text style={[styles.text2, { color: 'white' }]}>
                                Name
                            </Text>
                            <Text style={[styles.text2, { color: 'white' }]}>
                                Employee
                             </Text >

                            <Text style={[styles.text2, { color: 'white' }]}>
                                Actions
                            </Text>
                        </View>
                    </View>
                    {
                        myArray.map((item, key) => {
                            return (
                                <View key={item.holname}>

                                    <View style={[styles.blck, { backgroundColor: colors.back2 }]} onPress={() => { }}>
                                        <View style={styles.table}>


                                            <Text style={[styles.text, { color: colors.text }]}>
                                                {item.dep}
                                            </Text>
                                            <Text style={[styles.text, { color: colors.text }]}>
                                                {item.depcount}
                                            </Text>
                                            <View style={[styles.text, { color: colors.text, flexDirection: 'row', }]}>
                                                <FontAwesome name="trash-o" size={25} style={[styles.but, { backgroundColor: 'red' }]} onPress={() => deletefun(item)} >
                                                    <Text style={{ fontSize: 15 }}></Text></FontAwesome>
                                            </View>



                                        </View>

                                    </View>

                                </View>
                            )
                        })
                    }
                    <View style={{ margin: '3%', padding: 2, flexDirection: 'row', backgroundColor: "#61b55e", borderRadius: 10, alignItems: 'center' }}>
                        <Text>
                            {"  "}
                        </Text>
                        <FontAwesome name="exclamation-triangle" size={25} style={[{ backgroundColor: colors.backgroundColor, color: colors.text, }]} onPress={() => deletefun(item)} />

                        <Text style={{ color: colors.text, fontSize: 12, marginRight: '7%', marginLeft: '3%' }}>
                            Newly Added Department will be shown if you add atleast one employee in it ! !
                        </Text>
                    </View>

                    <SinglePickerMaterialDialog
                        title={'Select Sort By '}
                        items={map.map((row, index) => ({ value: index, label: row }))}
                        visible={visible1}
                        selectedItem={select1}
                        colorAccent={'#c2ba4a'}
                        onCancel={() => setVisible1(false)}
                        scrolled={true}
                        onOk={result => {
                            setVisible1(false);
                            sort(result.selectedItem.label)
                            setSelect1(result.selectedItem.label);
                        }}
                    />
                </View> : <ActivityIndicator style={styles.loader} size="large" color="#c2ba4a" />}

            </ScrollView>
            <BottomNav name="" color='#c2ba4a' navigation={navigation}></BottomNav>
        </View>
    )
}

const DepStackScreen = ({ navigation }) => {
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
                name="Manage Departments "
                component={DepScreen}
                options={{
                    title: ' Manage Departments ',
                    headerLeft: () => (
                        <FontAwesome.Button name="bars" size={25} backgroundColor="#c2ba4a" onPress={() => navigation.openDrawer()} />
                    )
                }}
            />
        </Stack.Navigator>
    );
}
export default DepStackScreen;

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
    }, blck: {
        padding: "2%",
        margin: '0.5%',
        borderRadius: 20,
    }, text: {
        width: width / 3,
        fontSize: 15
    }, text2: {
        width: width / 3,
        fontSize: 15,
        fontWeight: 'bold',
    }, table: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: "2%",
        marginRight: "2%", zIndex: 0,
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
        backgroundColor: '#c2ba4a',

        right: 30,
        bottom: 72,
        position: 'absolute'

    }, but: {
        padding: 3,
        borderRadius: 5,
        color: 'white',
        marginRight: '10%'
    }, sort: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        margin: '0.1%',
        padding: '1%',
    }, sort2: {
        marginRight: '3%',
        margin: '1%',
        padding: '2%',
        borderRadius: 10,
    }
})