import React from 'react';
import { View, Alert, Text, Image, ScrollView, StyleSheet, Dimensions, RefreshControl, FlatList, TouchableHighlight } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ActivityIndicator, Avatar, } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';
import { useTheme } from '@react-navigation/native';
const { width, height } = Dimensions.get("screen");
import Ripple from 'react-native-material-ripple';
import BottomNav from './BottomNav.js';
const Stack = createStackNavigator();
var myArray = []
var apix = ""
var sortfield = "Date"
var total = 0
var map = ['Name', 'Loan']
var keys = ['admin', 'office_close', 'userToken', 'access', 'userToken2']
const LoanScreen = ({ route, navigation }) => {
    const { colors } = useTheme();
    const [loader, setLoader] = React.useState(false)
    const [select1, setSelect1] = React.useState("None")
    const [visible1, setVisible1] = React.useState(false)
    const [total2,setTotal2]=React.useState(0)
    const [ref, setRef] = React.useState(false)
    const onRefresh = () => {
        if (ref == true) {
            return
        }
        setRef(true);
        api1(apix)
        setTimeout(function () { setRef(false) }, 1500);

    }
    const sort = (key) => {
        console.log(key)
        sortfield = key
        if (key == 'Loan') {
            sortfield = "loan"
            myArray.sort(compare)
        } else if (key == "Name") {
            sortfield = "name"
            myArray.sort(compare)
        }
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
    const api1 = async (api) => {
        try {
            const response = await fetch(api);
            const responseJson = await response.json();
            if(responseJson==false){
                Alert.alert('No Access!', 'Ask Admin to provide you the access of this page !.', [
                  { text: 'Okay' }
                ]); 
                setRef(false)
                setSaving(false)
                setLoader(true)
                return
            }
            myArray = [];
            total = 0
            for (var i = 0; i < responseJson.length; i++) {
                myArray.push({ name: responseJson[i].name, loan: responseJson[i].totalloan })
                total += myArray[i].loan
            }
            setTotal2(total)
            sort('Name')
        } catch (error) {
            console.error(error);
            return await Promise.reject(false);
        }

    }
    const deletefun = () => {
        Alert.alert('Delete Holiday !', 'Are you sure to selete the Holiday ?', [
            { text: 'Cancel' },
            { text: 'Okay', onPress: () => console.log("OK Pressed") }

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
            apix = 'https://payrollv2.herokuapp.com/employee/api/quickemp?id=' + encodeURIComponent(id) + '&platform=APP&admin=' + encodeURIComponent(admin) + '&id2=' + encodeURIComponent(id2) + "&off=" + encodeURIComponent(off) + "&access=" + encodeURIComponent(access);
            setLoader(true)
            total = 0
            for (var i = 0; i < myArray.length; i++) {
                total += myArray[i].loan
            }
            setTotal2(total)



        })
    }, [navigation,])
    return (

        <View style={styles.container}>
            
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
                    <View style={styles.headig}>
                        <Text style={[styles.headig2, { color: colors.text }]}>
                            Total Loan is ₹  {total2}
                        </Text>
                    </View>
                    <View style={[styles.blck, { backgroundColor: '#4d47f5' }]}>
                        <View style={styles.table}>
                            <Text style={[styles.text2, { color: 'white' }]}>
                                Name
                            </Text>
                            <Text style={[styles.text2, { color: 'white' }]}>
                                Loan
                             </Text >

                        </View>
                    </View>
                    {
                        myArray.map((item, key) => {
                            return (
                                <Ripple key={item.name} onPress={() => navigation.navigate('LedgerStackScreen')}>

                                    <View style={[styles.blck, { backgroundColor: colors.back2 }]} onPress={() => { }}>
                                        <View style={styles.table}>

                                            <Text style={[styles.text, { color: colors.text }]}>
                                                {item.name}
                                            </Text>

                                            <Text style={[styles.text, { color: colors.text }]}>
                                                {"₹"} {item.loan}
                                            </Text>




                                        </View>

                                    </View>

                                </Ripple>
                            )
                        })
                    }
                    <SinglePickerMaterialDialog
                        title={'Select Sort By '}
                        items={map.map((row, index) => ({ value: index, label: row }))}
                        visible={visible1}
                        selectedItem={select1}
                        colorAccent={'#4d47f5'}
                        onCancel={() => setVisible1(false)}
                        scrolled={true}
                        onOk={result => {
                            setVisible1(false);
                            sort(result.selectedItem.label)
                            setSelect1(result.selectedItem.label);
                        }}
                    />

                </View> : <ActivityIndicator style={styles.loader} size="large" color="#4d47f5" />}

            </ScrollView>
            <BottomNav name="" color='#4d47f5' navigation={navigation}></BottomNav>
        </View>
    )
}

const LoanStackScreen = ({ route, navigation }) => {
    myArray = route.params.totalloan
    return (
        <Stack.Navigator screenOptions={{
            headerStyle: {
                backgroundColor: '#4d47f5',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold'
            }
        }}>
            <Stack.Screen
                name="View Loans"
                component={LoanScreen}
                options={{
                    title: ' View Loans ',
                    headerLeft: () => (
                        <FontAwesome.Button name="bars" size={25} backgroundColor="#4d47f5" onPress={() => navigation.openDrawer()} />
                    )
                }}
            />
        </Stack.Navigator>
    );
}
export default LoanStackScreen;

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
    }, blck: {
        padding: "2%",
        margin: '0.5%',
        borderRadius: 20,
    }, text: {
        width: width / 2,
        fontSize: 15
    }, text2: {
        width: width / 2,
        fontSize: 15,
        fontWeight: 'bold'
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
        backgroundColor: '#4d47f5',

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
    } ,headig: {
        flex: 1,
        justifyContent: "center",
        flexDirection: "row",
      }, headig2: {
        fontWeight: 'bold',
        fontSize: 20,
      }, 
})