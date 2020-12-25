import React from 'react';
import { Alert, View, Text, TextInput, Image, ScrollView, StyleSheet, Dimensions, RefreshControl, FlatList, TouchableHighlight } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ripple from 'react-native-material-ripple';
import { ActivityIndicator, RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from 'react-native-animatable';

import { SinglePickerMaterialDialog } from 'react-native-material-dialog';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@react-navigation/native';
import BottomNav from './BottomNav.js';
import { set } from 'react-native-reanimated';
const Stack = createStackNavigator();
var keys = ['admin', 'office_close', 'userToken', 'access', 'userToken2']
var myArray = []
var idx = []
var apix = ""
const api1 = async (api) => {
    try {
        const response = await fetch(api);
        const responseJson = await response.json();
        console.log("Refreshed")
        myArray = [];
        idx = []
        for (var i = 0; i < responseJson.length; i++) {
            myArray.push(responseJson[i].name);
            idx.push(responseJson[i].emp_id);
        }
    } catch (error) {
        console.error(error);
        return await Promise.reject(false);
    }

};
const { width, height } = Dimensions.get("screen");
const AddLoanScreen = ( { route, navigation }) => {
    const { colors } = useTheme();
    const [checked, setChecked] = React.useState('0');
    const [loader, setLoader] = React.useState(false)
    const [saving, setSaving] = React.useState(false)
    const [ref, setRef] = React.useState(false)
    const [select1, setSelect1] = React.useState("")
    const [visible1, setVisible1] = React.useState(false)
    const handleNameChange = (val) => { setData({ ...data, name: val }); }
    const handleAmountChange = (val) => { setData({ ...data, amount: val }); }
    const onRefresh = () => {
        setRef(true);
        api1(apix);
        setTimeout(function () { setRef(false) }, 1500);

    }
    const [data, setData] = React.useState({
        name: '',
        amount: 0,
    })

    const save = () => {
        console.log(select1)
        console.log(checked)
        console.log(data.name)
        console.log(data.amount)
        if (select1 == "") {
            Alert.alert('Select Employee!', 'Employee Name Field Cannot Be Empty.', [
                { text: 'Okay' }
            ]);
            setSaving(false)
            return;
        }
        if (data.name == "") {
            Alert.alert('Enter Name!', 'Narration Field Cannot Be Empty.', [
                { text: 'Okay' }
            ]);

            setSaving(false)
            return

        }
        if (data.amount == "0") {
            Alert.alert('Enter Amount !', 'Amount Field Cannot Be Empty.', [
                { text: 'Okay' }
            ]);

            setSaving(false)
            return

        }
        setSaving(true)
        setSaving(false)
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
            apix = 'https://payrollv2.herokuapp.com/employee/api/quickemp?id=' + encodeURIComponent(id) + '&platform=APP&admin=' + encodeURIComponent(admin) + '&id2=' + encodeURIComponent(id2) + "&off=" + encodeURIComponent(off) + "&access=" + encodeURIComponent(access);
            //console.log(api2)
            //await api1(api).then(() => { setLoader(true) })


        })
    }, [navigation ])
    return (
        <View style={styles.container}>
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={ref}
                    onRefresh={onRefresh}
                />}>
                {loader ? <View>
                    <Animatable.View
                        animation="bounceInRight"
                        style={[
                            styles.card, { backgroundColor: colors.backgroundColor, marginTop: '5%' }
                        ]}>
                        <View style={[styles.tab, { backgroundColor: colors.backgroundColor, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                            <RadioButton
                                value="first"
                                status={checked === '0' ? 'checked' : 'unchecked'}
                                color="coral"
                                onPress={() => setChecked('0')}
                            />
                            <Text style={[styles.heading, { color: colors.text }]}>
                                Give
                            </Text>
                            <RadioButton
                                value="second"
                                color="coral"
                                status={checked === '1' ? 'checked' : 'unchecked'}
                                onPress={() => setChecked('1')}
                            />
                            <Text style={[styles.heading, { color: colors.text }]}>
                                Recieve
                            </Text>

                        </View>

                        <View style={[styles.tab, { backgroundColor: colors.backgroundColor, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]} >

                            <Text style={[styles.heading,{  color: colors.text, }]}>
                                Employee
                        </Text>
                            <Ripple style={styles.xyz} onPress={() => { setVisible1(!visible1) }}>
                                <Text style={[{ color: colors.text, }]}>
                                    {select1}
                                </Text>
                                <Text style={[{ color: colors.text, }]}>
                                    {"  >"}
                                </Text>
                            </Ripple >

                        </View>




                        <SinglePickerMaterialDialog
                            title={'Select one Employee'}
                            items={myArray.map((row, index) => ({ value: index, label: row }))}
                            visible={visible1}
                            selectedItem={select1}
                            onCancel={() => setVisible1(false)}
                            scrolled={true}
                            colorAccent={'#4d47f5'}
                            onOk={result => {
                                setVisible1(false);
                                setSelect1(result.selectedItem.label);
                            }}
                        />
                        <View style={styles.tab}>
                            <Text style={[styles.heading, { color: colors.text }]}>
                                Amount
                                </Text>
                            <View style={[styles.textInput, { flexDirection: 'row' }]}>
                                <Text style={{ marginRight: 8, color: colors.text }}>
                                    ₹
                                    </Text>
                                <TextInput
                                    placeholder="0"
                                    style={[{ color: colors.text }]}
                                    autoCapitalize="none"
                                    keyboardType="numeric"
                                    onChangeText={(val) => handleAmountChange(val)}
                                />
                            </View>
                        </View>

                        <View style={styles.tab}>
                            <Text style={[styles.heading, { color: colors.text }]}>
                                Narration
                                </Text>
                            <TextInput
                                placeholder="Add some narration"
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
                                    colors={['#562fcc', '#4d47f5', '#3f3ba8']}
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

                </View> : <ActivityIndicator style={styles.loader} size="large" color="#4d47f5" />}

            </ScrollView>
            <BottomNav name="" color='#4d47f5' navigation={navigation}></BottomNav>
        </View>
    )
}

const AddLoanStackScreen = ({ route, navigation }) => {
    myArray = route.params.myArray
    idx = route.params.idx
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
                name="Add Loan"
                component={AddLoanScreen}
                options={{
                    title: 'Add Loan',
                    headerLeft: () => (
                        <FontAwesome.Button name="bars" size={25} backgroundColor="#4d47f5" onPress={() => navigation.openDrawer()} />
                    )
                }}
            />
        </Stack.Navigator>
    );
}
export default AddLoanStackScreen;

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
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row'
    }, textInput: {
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 1,
        flexDirection: 'column',
        width: width * 0.5,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
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
        borderRadius: 10,
        marginLeft: '3%',
        marginRight: '3%',
        padding: 2,
    }, xyz: {
        fontSize: 16,
        width: width * 0.5,
        borderColor: 'grey',
        borderRadius: 5,
        borderWidth: 1,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexDirection: 'row',
        padding: 2, paddingLeft: 10, paddingRight: 10,
    }
})