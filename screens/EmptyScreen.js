import React from 'react';
import { View, Text,Image, ScrollView, StyleSheet, Dimensions, RefreshControl, FlatList, TouchableHighlight } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ContentLoader from "react-native-easy-content-loader";
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ActivityIndicator, Avatar, } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { useTheme } from '@react-navigation/native';
const Stack = createStackNavigator();
var keys = ['admin', 'office_close', 'userToken', 'access', 'userToken2']
const AddHolScreen = (props,{route,navigation}) => {
    const { colors } = useTheme();
    const [loader, setLoader] = React.useState(false)
    const [ref, setRef] = React.useState(false)
    const onRefresh = () => {
        setRef(true);
        setTimeout(function () { setRef(false) }, 1500);

    }
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
            //await api1(api, api2).then(() => { setLoader(true) })


        })
    }, [navigation,props])
    return (
        <View style={styles.container}>
            {loader ? <ScrollView refreshControl={
                <RefreshControl
                    refreshing={ref}
                    onRefresh={onRefresh}
                />}>

                </ScrollView>:<ActivityIndicator style={styles.loader} size="large" color="green" />}
                    </View>
    )
}

const AddHolStackScreen = ({ navigation }) => {
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
          name="Holidays"
          component={AddHolScreen}
          options={{
            title: ' Holidays ',
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
    },
  })