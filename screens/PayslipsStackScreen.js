import React from 'react';
import { View, Alert, Text, Image, ScrollView, StyleSheet, Dimensions, RefreshControl, FlatList, TouchableHighlight } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ActivityIndicator, } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';
import { useTheme } from '@react-navigation/native';
const { width, height } = Dimensions.get("screen");
import Ripple from 'react-native-material-ripple';
import BottomNav from './BottomNav.js';
const Stack = createStackNavigator();
var myArray = []
var api = ""
var sortfield = "Date"
var map = ['Name', 'Net Pay']
var keys = ['admin', 'office_close', 'userToken', 'access', 'userToken2']
var monthlist = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var arr = ['01-', '02-', '03-', '04-', '05-', '06-', '07-', '08-', '09-', '10-', '11-', '12-'];
var yearlist = []
var monthday = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var admin = "";
var off = "";
var id = "";
var access = "";
var id2 = "";
var api = ""
var list = []
const Payslipscreen = ({ route, navigation }) => {
    const { colors } = useTheme();
    const [loader, setLoader] = React.useState(false)
    const [select1, setSelect1] = React.useState("None")
    const [visible1, setVisible1] = React.useState(false)
    const [select2, setSelect2] = React.useState("")
    const [saving, setSaving] = React.useState(false)
    const [visible2, setVisible2] = React.useState(false)
    const [select3, setSelect3] = React.useState("")
    const [visible3, setVisible3] = React.useState(false)
    const [ref, setRef] = React.useState(false)
    const [data, setData] = React.useState(false)
    const download = () =>{
        Alert.alert('Use Web Version!', 'Sorry! This Feature is not available in app! Visit www.payrollv2.herokuapp.com.', [
            { text: 'Okay' }
        ]);
    }
    const view = async () => {
        if (saving == true) {
            return
        }
        setData(false)
        setSaving(true)

        var z = '&id=' + encodeURIComponent(id) + '&platform=APP&admin=' + encodeURIComponent(admin) + '&id2=' + encodeURIComponent(id2) + "&off=" + encodeURIComponent(off) + "&access=" + encodeURIComponent(access);
        var ap1 = 'https://payrollv2.herokuapp.com/payslips/api/data?date=' + arr[monthlist.indexOf(select2)] + select3 + z
        return fetch(ap1)
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson==false){
                    Alert.alert('No Access!', 'Ask Admin to provide you the access of this page !.', [
                      { text: 'Okay' }
                    ]);
                    setRef(false)
                    setSaving(false)
                    setLoader(true)
                    return
                }
                list = responseJson
                myArray = []
                if (list.length == 0) {
                    Alert.alert('No Record!', 'No Record Found.', [
                        { text: 'Okay' }
                    ]);
                    setSaving(false)
                    setRef(false)
                    return

                }

                for (var i = 0; i < list.length; i++) {
                    myArray.push({ name: list[i]['employee_quick'].name, netpay: list[i].netpay })
                }
                sort('Name')
                setSaving(false)
                setData(true)
                setRef(false)
            }).catch(error => {
                console.error(error);
                Alert.alert('Some Error Occured!', 'Error is .' + error, [
                    { text: 'Okay' }
                ]);
                setSaving(false)
                return;
            })
        setSaving(false)

    }

    const onRefresh = () => {
        if (ref == true) {
            return
        }
        setRef(true);
        view()

    }
    const sort = (key) => {
        console.log(key)
        sortfield = key
        if (key == 'Net Pay') {
            sortfield = "neypay"
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
    const year = () => {
        var d = new Date();
        var n = d.getFullYear() + 1;
        var y = 2020;
        do {
            yearlist.push(y + "")
            y++;
        } while (n != y);
        setSelect2(monthlist[d.getMonth()]);
        setSelect3("" + n - 1)
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
            myArray = responseJson
            sort('Name')
        } catch (error) {
            console.error(error);
            return await Promise.reject(false);
        }

    }

    React.useEffect(() => {
        AsyncStorage.multiGet(keys, async (err, stores) => {
            setLoader(false)
            admin = stores[0][1];
            off = stores[1][1];
            id = stores[2][1];
            access = stores[3][1];
            id2 = stores[4][1];
            year()
            setLoader(true)




        })
    }, [navigation,])
    return (

        <View style={styles.container}>



            <SinglePickerMaterialDialog
                title={'Select Month'}
                items={monthlist.map((row, index) => ({ value: index, label: row }))}
                visible={visible2}
                selectedItem={select2}
                colorAccent={'#fa50e2'}
                onCancel={() => setVisible2(false)}
                scrolled={true}
                onOk={result => {
                    setVisible2(false);
                    setSelect2(result.selectedItem.label);
                }}
            />
            <SinglePickerMaterialDialog
                title={'Select Year'}
                items={yearlist.map((row, index) => ({ value: index, label: row }))}
                visible={visible3}
                selectedItem={select3}
                colorAccent={'#fa50e2'}
                onCancel={() => setVisible3(false)}
                onOk={result => {
                    setVisible3(false);
                    setSelect3(result.selectedItem.label);
                }}
            />

            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={ref}
                    onRefresh={onRefresh}
                />}>
                {loader ? <View><Ripple style={[styles.blck, { backgroundColor: colors.back2 }]} onPress={() => { setVisible2(!visible2) }}>
                    <View style={styles.table}>
                        <Text style={[{ fontSize: 18, color: colors.text }]}>
                            Month
                        </Text>
                        <Text style={[{ fontSize: 18, color: colors.text }]}>
                            {select2} {"  >"}

                        </Text>
                    </View>
                </Ripple>
                    <Ripple style={[styles.blck, { backgroundColor: colors.back2 }]} onPress={() => { setVisible3(!visible3) }}>
                        <View style={styles.table}>
                            <Text style={[{ fontSize: 18, color: colors.text }]}>
                                Year
                        </Text>
                            <Text style={[{ fontSize: 18, color: colors.text }]}>
                                {select3} {"  >"}
                            </Text>
                        </View>
                    </Ripple>
                    <View style={styles.button}>

                        <TouchableOpacity
                            onPress={() => { console.log("CLICKED"); view() }} >
                            <LinearGradient
                                colors={['#e774ed', '#eb38cd', '#e774ed']}
                                style={styles.signIn}
                                start={[-1, 0]}
                                end={[1, 0]}
                            >

                                <Text style={[styles.textSign, { color: '#fffff0', fontWeight: "bold" }]}>
                                    SHOW </Text>
                                {saving ? <ActivityIndicator style={{ marginLeft: "5%" }} size="small" color="#fffff0" /> : null}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View> : <ActivityIndicator style={styles.loader} size="large" color="#fa50e2" />}

                {data ? <View>
                    <View>
                        <Text>

                        </Text>
                    </View>
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
                    <View style={[styles.blck, { backgroundColor: '#fa50e2' }]}>
                        <View style={styles.table}>
                            <Text style={[styles.text2, { color: 'white', width: width * 0.45 }]}>
                                Name
                            </Text>
                            <Text style={[styles.text2, { color: 'white', width: width * 0.25 }]}>
                                Net Pay
                             </Text >
                            <Text style={[styles.text2, { color: 'white', width: width * 0.20 }]}>
                                Actions
                            </Text>
                        </View>
                    </View>
                    {
                        myArray.map((item, key) => {
                            return (
                                <View key={item.name}>

                                    <View style={[styles.blck, { backgroundColor: colors.back2 }]} onPress={() => { }}>
                                        <View style={styles.table}>

                                            <Text style={[styles.text, { color: colors.text, width: width * 0.45 }]}>
                                                {item.name}
                                            </Text>

                                            <Text style={[styles.text, { color: colors.text, width: width * 0.25 }]}>
                                                {" ₹ "} {item.netpay}
                                            </Text>
                                            <View style={[styles.text, { color: colors.text, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: width * 0.2 }]}>
                                                <FontAwesome name="download" style={[styles.but, { backgroundColor: 'green' }]} size={25} onPress={() => { download()}} />
                                                <FontAwesome name="print" size={25} style={[styles.but, { backgroundColor: 'red' }]} onPress={() => { }} />
                                            </View>



                                        </View>

                                    </View>

                                </View>
                            )
                        })
                    }
                    <SinglePickerMaterialDialog
                        title={'Select Sort By '}
                        items={map.map((row, index) => ({ value: index, label: row }))}
                        visible={visible1}
                        selectedItem={select1}
                        colorAccent={'#fa50e2'}
                        onCancel={() => setVisible1(false)}
                        scrolled={true}
                        onOk={result => {
                            setVisible1(false);
                            sort(result.selectedItem.label)
                            setSelect1(result.selectedItem.label);
                        }}
                    />

                </View> : null}

            </ScrollView>
            <BottomNav name="" color='#fa50e2' navigation={navigation}></BottomNav>
        </View>
    )
}

const PayslipstackScreen = ({ navigation }) => {
    return (
        <Stack.Navigator screenOptions={{
            headerStyle: {
                backgroundColor: '#fa50e2',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold'
            }
        }}>
            <Stack.Screen
                name=" Payslips"
                component={Payslipscreen}
                options={{
                    title: ' Payslips ',
                    headerLeft: () => (
                        <FontAwesome.Button name="bars" size={25} backgroundColor="#fa50e2" onPress={() => navigation.openDrawer()} />
                    )
                }}
            />
        </Stack.Navigator>
    );
}
export default PayslipstackScreen;

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
        fontSize: 15
    }, text2: {
        width: width / 3,
        fontSize: 15,
        fontWeight: 'bold'
    }, table: {
        flexDirection: 'row',
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
        backgroundColor: '#fa50e2',

        right: 30,
        bottom: 72,
        position: 'absolute'

    }, table: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: "2%",
        marginRight: "2%", zIndex: 0,
    }, but: {
        padding: 3,
        borderRadius: 5,
        color: 'white',
        marginRight: '10%'
    }, button: {
        alignItems: 'center',
        marginTop: 10
    }, signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row',
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