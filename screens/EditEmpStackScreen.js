import React from 'react';
import { View, Text, Button, ScrollView, StyleSheet, ActivityIndicator, Dimensions, RefreshControl, } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Avatar, } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { useTheme } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
var { width, height } = Dimensions.get('window');
const Stack = createStackNavigator();
var emp_id = 0;
const api1 = (api) => {
    fetch(api)
        .then((response) => response.json())
        .then((responseJson) => {

            console.log(responseJson)
        }
        )
        .catch((error) => {
            console.error(error);
        });
}
const EditEmpScreen = ({ route, navigation }) => {
    const { colors } = useTheme();
    const keys = ['admin', 'office_close', 'userToken', 'access', 'userToken2']
    const [loader, setLoader] = React.useState(false)
    const [myArray, setMyArray] = React.useState(false)
    const [sorter, setSorter] = React.useState("Name")
    console.log(emp_id)
    const [ref, setRef] = React.useState(false)
    const onRefresh = () => {
        setRef(true);
        setTimeout(function () { setRef(false) }, 1500);

    }
    React.useEffect(() => {
        AsyncStorage.multiGet(keys, (err, stores) => {
            setLoader(false)
            var admin = stores[0][1];
            var off = stores[1][1];
            var id = stores[2][1];
            var access = stores[3][1];
            var id2 = stores[4][1];
            api = 'https://payrollv2.herokuapp.com/employee/api/quickemp?empid=' + emp_id + "&id=" + encodeURIComponent(id) + '&platform=APP&admin=' + encodeURIComponent(admin) + '&id2=' + encodeURIComponent(id2) + "&off=" + encodeURIComponent(off) + "&access=" + encodeURIComponent(access);
            console.log(api)
            api1(api)

        })
    })
    return (
        <View style={styles.container}>
            {loader ? <ScrollView refreshControl={
                <RefreshControl
                    refreshing={ref}
                    onRefresh={onRefresh}
                />}>
                <Text>Hello</Text>
            </ScrollView> : null}
        </View>
    )
}

const EditEmpStackScreen = ({ route, navigation }) => {
    emp_id = route.params.emp_id
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
                component={EditEmpScreen}
                options={{
                    title: 'Edit Employees',
                    headerLeft: () => (
                        <FontAwesome.Button name="bars" size={25} backgroundColor="green" onPress={() => navigation.openDrawer()} />

                    )
                }}
            />
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
        marginTop: "10%",
    }, overlay: {
        width: width,
        height: 100
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
    }
});
