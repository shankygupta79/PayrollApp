import React from 'react';
import { View, Text, Button, ScrollView, StyleSheet, ActivityIndicator, Dimensions, RefreshControl, } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Avatar, } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { useTheme } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

import { TouchableOpacity } from 'react-native-gesture-handler';
var { width, height } = Dimensions.get('window');
const Stack = createStackNavigator();
var keys = ['admin', 'office_close', 'userToken', 'access', 'userToken2']
var sorter = "Name"
var myArray = []
var myArray2 = []
var symbol = ''
var emp_id=0
async function api1(api, api2) {
    return fetch(api)
        .then((response) => response.json())
        .then((responseJson) => {
            myArray = responseJson
            //console.log(myArray)
            return fetch(api2)
                .then((response) => response.json())
                .then((Response2) => {
                    myArray2 = Response2[0]
                    symbol = Response2[1]


                })


        }
        )
        .catch((error) => {
            console.error(error);
            return Promise.reject(false)
        });

};

const EditEmpScreen = (props,{route,navigation}) => {
    const { colors } = useTheme();
    const [edit, setEdit] = React.useState(false)
    const [loader, setLoader] = React.useState(false)

    const [ref, setRef] = React.useState(false)
    const onRefresh = () => {
        setRef(true);
        setTimeout(function () { setRef(false) }, 1500);

    }
    emp_id=props.empid
    React.useEffect(() => {
        AsyncStorage.multiGet(keys, async (err, stores) => {
            setLoader(false)
            var admin = stores[0][1];
            var off = stores[1][1];
            var id = stores[2][1];
            var access = stores[3][1];
            var id2 = stores[4][1];
            var api = 'https://payrollv2.herokuapp.com/employee/api/quickemp?empid=' + emp_id + "&id=" + encodeURIComponent(id) + '&platform=APP&admin=' + encodeURIComponent(admin) + '&id2=' + encodeURIComponent(id2) + "&off=" + encodeURIComponent(off) + "&access=" + encodeURIComponent(access);
            var api2 = 'https://payrollv2.herokuapp.com/employee/api/emp?empid=' + emp_id + "&id=" + encodeURIComponent(id) + '&platform=APP&admin=' + encodeURIComponent(admin) + '&id2=' + encodeURIComponent(id2) + "&off=" + encodeURIComponent(off) + "&access=" + encodeURIComponent(access)
            //console.log(api2)
            await api1(api, api2).then(() => { setLoader(true) })


        })
    }, [navigation,props])
    return (
        <View style={styles.container}>
            {loader ? <ScrollView refreshControl={
                <RefreshControl
                    refreshing={ref}
                    onRefresh={onRefresh}
                />}>
                {
                    edit ? <Text>Hi</Text> :
                        <View style={{marginTop:"3%"}}>

                            <View style={styles.avata}>
                                <Avatar.Image size={124} source={{ uri: myArray.photo }} />
                                <Text style={[styles.name, { color: colors.text }]}>
                                    {myArray.name}
                                </Text>
                                <Text style={[styles.des]}>
                                    {myArray.des}
                                </Text>
                            </View>
                            <Animatable.View
                                animation="fadeInUpBig"
                                style={[
                                    styles.card,
                                ]}>
                                <View style={styles.tab}>
                                    <Text style={[styles.heading,{color:'#006400',width:"80%"}]}>
                                    • Basic Information
                                    </Text>
                                    
                                </View>
                                <View style={styles.tab}>
                                    <Text style={styles.heading}>
                                        D . O . B
                                    </Text>
                                    <Text style={styles.val}>
                                        {myArray2.dob}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={styles.heading}>
                                        Gender
                                            </Text>
                                    <Text style={styles.val}>
                                        {myArray2.gender}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={styles.heading}>
                                        Father Name
                                            </Text>
                                    <Text style={styles.val}>
                                        {myArray2.fnum}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={styles.heading}>
                                        Mother Name
                                            </Text>
                                    <Text style={styles.val}>
                                        {myArray2.mname}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={styles.heading}>
                                        Father's Number
                                            </Text>
                                    <Text style={styles.val}>
                                        {myArray2.fnum}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={styles.heading}>
                                        Mother's Number
                                            </Text>
                                    <Text style={styles.val}>
                                        {myArray2.mnum}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={styles.heading}>
                                        Email ID
                                            </Text>
                                    <Text style={styles.val}>
                                        {myArray.email}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={styles.heading}>
                                        Landline
                                            </Text>
                                    <Text style={styles.val}>
                                        {myArray2.land}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={styles.heading}>
                                        Alternate Number
                                            </Text>
                                    <Text style={styles.val}>
                                        {myArray2.anum}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={styles.heading}>
                                        Address Line 1
                                            </Text>
                                    <Text style={styles.val} numberOfLines={5}>
                                        {myArray2.add1}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={styles.heading}>
                                        Address Line 2
                                            </Text>
                                    <Text style={styles.val}>
                                        {myArray2.add2}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={styles.heading}>
                                        Aadhaar Number
                                            </Text>
                                    <Text style={styles.val}>
                                        {myArray2.aadhaar}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={styles.heading}>
                                        Pan Number
                                            </Text>
                                    <Text style={styles.val}>
                                        {myArray2.pan}
                                    </Text>
                                </View>

                            </Animatable.View>
                            <Animatable.View
                                animation="fadeInUpBig"
                                style={[
                                    styles.card,
                                ]}>
                                    <View style={styles.tab}>
                                    <Text style={[styles.heading,{color:'#006400',width:"80%"}]}>
                                    • Work Information
                                    </Text>
                                    
                                </View>
                                <View style={styles.tab}>
                                    <Text style={styles.heading}>
                                        Employee ID
                                            </Text>
                                    <Text style={styles.val}>
                                        {myArray.emp_id}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={styles.heading}>
                                        Date of Joining
                                            </Text>
                                    <Text style={styles.val}>
                                        {myArray.doj}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={styles.heading}>
                                        Salary
                                            </Text>
                                    <Text style={styles.val}>
                                        {myArray.salary}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={styles.heading}>
                                        Department
                                            </Text>
                                    <Text style={styles.val}>
                                        {myArray.dep}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={styles.heading}>
                                        Status
                                            </Text>
                                    <Text style={styles.val}>
                                        {myArray.des}
                                    </Text>
                                </View>
                            </Animatable.View>
                            <Animatable.View
                                animation="fadeInUpBig"
                                style={[
                                    styles.card,
                                ]}>
                                    <View style={styles.tab}>
                                    <Text style={[styles.heading,{color:'#006400',width:"80%"}]}>
                                    • Bank Information
                                    </Text>
                                    
                                </View>
                                <View style={styles.tab}>
                                    <Text style={styles.heading}>
                                        Account Name
                                            </Text>
                                    <Text style={styles.val}>
                                        {myArray2.accname}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={styles.heading}>
                                        Account Number
                                            </Text>
                                    <Text style={styles.val}>
                                        {myArray2.accnum}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={styles.heading}>
                                        Bank Name
                                            </Text>
                                    <Text style={styles.val}>
                                        {myArray2.bname}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={styles.heading}>
                                        IFSC Code
                                            </Text>
                                    <Text style={styles.val}>
                                        {myArray2.ifsc}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={styles.heading}>
                                        Branch
                                            </Text>
                                    <Text style={styles.val}>
                                        {myArray2.branch}
                                    </Text>
                                </View>
                            </Animatable.View>


                        </View>
                }

            </ScrollView> : <ActivityIndicator style={styles.loader} size="large" color="green" />}
        </View>
    )
}

const EditEmpStackScreen = ({ route, navigation }) => {
    var emp_id = route.params.emp_id
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
                name="EditEmpStackScreen"
                options={{
                    title: 'Edit Employees',
                    headerLeft: () => (
                        <FontAwesome.Button name="bars" size={25} backgroundColor="green" onPress={() => navigation.openDrawer()} />

                    )
                }}
            >{props => <EditEmpScreen {...props} empid={emp_id} />}</Stack.Screen>

        </Stack.Navigator>
    );
}
export default EditEmpStackScreen;

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
    }, list: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: "3%",
        marginRight: "3%",
        marginTop: "2%"
    }, table: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: "10%",
        marginRight: "15%"
    }, avata: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    }, name: {
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: "1%"
    }, des: {
        fontWeight: 'bold',
        fontSize: 14,
        marginTop: "0.5%",
        color: '#9e9d9d'
    }, tab: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5,
        flexWrap:'wrap'

    }, heading: {
        fontWeight: 'bold',
        width:"40%"
    }, val: {
        flexDirection: 'column',
        width:"40%"

    }, card: {
        marginTop: '2%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e5e8e3',
        margin: '3%',
        marginTop: "1%",
        marginBottom: "1%",
        padding: 2,


    }
});
