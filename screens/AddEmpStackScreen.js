import React from 'react';
import { Image, TouchableOpacity, TextInput, Button, View, Text, ScrollView, StyleSheet, ActivityIndicator, Dimensions, RefreshControl, } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar, } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import { useTheme } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { RNS3 } from 'react-native-aws3';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDownPicker from 'react-native-dropdown-picker';
const Stack = createStackNavigator();
const keys = ['admin', 'office_close', 'userToken', 'access', 'userToken2']
var admin = '';
var off = '';
var id = '';
var id2 = '';
var access = '';
var camera = ''
function takePicture() {
    this.camera.capture()

}
var whichdate = -1
var date = "01-01-2020"
var dateob = "01-01-2000"
const AddEmpScreen = ({ navigation }) => {
    const [image, setImage] = React.useState(null);
    const [saving, setSaving] = React.useState(false)
    const [loader, setLoader] = React.useState(false)
    const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
    const showDatePicker = (a) => {
        whichdate = a
        setDatePickerVisibility(true);
    };
    var deplist = [{ label: 'Dep1', value: 'Dep1', },
    { label: 'Dep2', value: 'Dep2', }]
    const hideDatePicker = () => {

        setDatePickerVisibility(false);
    };
    const handleDesChange = (val) => { setData({ ...data, des: val }); }
    const handleBankChange = (val) => { setData({ ...data, bank: val }); }
    const handleIfscChange = (val) => { setData({ ...data, ifsc: val }); }
    const handleAccnumChange = (val) => { setData({ ...data, accnum: val }); }
    const handleAccnameChange = (val) => { setData({ ...data, accname: val }); }
    const handleBranchChange = (val) => { setData({ ...data, branch: val }); }
    const handleNameChange = (val) => { setData({ ...data, name: val }); }
    const handleSalaryChange = (val) => { setData({ ...data, salary: val }); }
    const handleLnumChange = (val) => { setData({ ...data, landline: val }); }
    const handleMonumChange = (val) => { setData({ ...data, mobile: val }); }
    const handleMnumChange = (val) => { setData({ ...data, mnum: val }); }
    const handleFnumChange = (val) => { setData({ ...data, fnum: val }); }
    const handleMnameChange = (val) => { setData({ ...data, mname: val }); }
    const handleFnameChange = (val) => { setData({ ...data, fname: val }); }
    const handleMailChange = (val) => { setData({ ...data, email: val }); }
    const handleAnumChange = (val) => { setData({ ...data, anum: val }); }
    const handleAdd1Change = (val) => { setData({ ...data, add1: val }); }
    const handleAdd2Change = (val) => { setData({ ...data, add2: val }); }
    const handlePanChange = (val) => { setData({ ...data, pan: val }); }
    const handleAadhaarChange = (val) => { setData({ ...data, aadhaar: val }); }
    const handleConfirm = (dat) => {
        console.log("A date has been picked: ", dat);
        console.log(whichdate)
        if (whichdate == 0) {
            dateob = dat.getDate() + "-" + (dat.getMonth() + 1) + "-" + dat.getFullYear()
        } else {
            date = dat.getDate() + "-" + (dat.getMonth() + 1) + "-" + dat.getFullYear()
        }


        hideDatePicker();
    };

    const [selectedStatus, setSelectedStatus] = React.useState("Active")
    const [data, setData] = React.useState({
        name: '',
        gender: 'Male',
        dob: '',
        fname: '',
        mname: '',
        mnum: '',
        fnum: '',
        landline: '',
        email: '',
        mobile: '',
        salary: 0,
        des: 'bc',
        dep: '',
        bank: '',
        ifsc: '',
        accnum: '',
        accname: '',
        branch: '',
        pan: '',
        aadhaar: '',
        add1: '',
        add2: '',
        anum: '',
    });
    React.useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to upload image!');
                }
            }
        })();
    }, [navigation]);

    const pickImage = async () => {
        console.log("Gall")
        await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        }).then((data) => {

            if (!data.cancelled) {
                setImage(data.uri);
            }
            console.log(data.uri)
            var d = new Date()
            const file = {
                uri: data.uri,
                name: 'photo' + d.getTime() + '.jpg',
                type: 'image/jpeg'
            };

            const options2 = {
                keyPrefix: "uploads/",
                bucket: "payrollbucket2",
                region: "us-east-1",
                acl: 'public-read',
                accessKey: "07076BZYIHYRUCREHERE",
                secretKey: "zVg4Ycdht6TGUqVTPOoIWF5wqASQ6MZ6KeO04Bsd",
                successActionStatus: 201,
                awsUrl: "cellar-c2.services.clever-cloud.com/"

            };
            const options = {

            }

            /*RNS3.put(file, options).then(response => {
                if (response.status !== 201) {
                    console.log(response)
                    throw new Error('Failed to upload image to S3', response);
                }
                console.log(response.body.postResponse.location)
            });*/
        })
            .catch(err => console.error(err));

    };
    const [ref, setRef] = React.useState(false)
    const onRefresh = () => {
        setRef(true);
        setTimeout(function () { setRef(false) }, 1500);

    }
    const { colors } = useTheme();
    React.useEffect(() => {
        AsyncStorage.multiGet(keys, (err, stores) => {
            setLoader(false)
            admin = stores[0][1];
            off = stores[1][1];
            id = stores[2][1];
            access = stores[3][1];
            id2 = stores[4][1];
            setLoader(true)
        })
    }, [navigation])
    return (
        <View>
            { loader ? <View>
                <View style={styles.touchableOpacityStyle}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={pickImage}>
                        <Image
                            source={{
                                uri:
                                    "https://res.cloudinary.com/shankygupta79/image/upload/v1606070212/Pelfusion-Long-Shadow-Media-Camera-2_ap81uw.ico",
                            }}
                            style={styles.floatingButtonStyle}
                        />
                    </TouchableOpacity></View>
                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={ref}
                        onRefresh={onRefresh}
                    />}
                >


                    <View style={styles.avata}>
                        {
                            image ? <Avatar.Image size={100} source={{ uri: image }} /> :
                                <View>
                                    {data.gender == "Male" ? <Avatar.Image size={100} source={{ uri: 'https://res.cloudinary.com/shankygupta79/image/upload/v1606114463/Face-Profile-User-Man-Boy-Person-Avatar-512_su1roy.png' }} />

                                        : <Avatar.Image size={100} source={{ uri: 'https://res.cloudinary.com/shankygupta79/image/upload/v1606114873/user-profile-avatar-woman-icon-girl-avatar_ugm3qf.jpg' }} />}
                                </View>
                        }

                    </View>

                    <Animatable.View
                        animation="fadeInUpBig"
                        style={[
                            styles.card,
                        ]}>
                        <View style={styles.tab}>
                            <Text style={[styles.heading, { color: '#13d648', width: "80%" }]}>
                                • Basic Information
                                    </Text>
                        </View>
                        <View style={styles.tab}>
                            <Text style={[styles.heading,{color:colors.text}]}>
                                Name
                                </Text>
                            <TextInput
                                placeholder="Name"
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => handleNameChange(val)}
                            />
                        </View>
                        <View style={styles.tab}>
                            <Text style={[styles.heading,{color:colors.text}]}>
                                Gender
                                </Text>
                            <View style={[{ borderWidth: 0, flexDirection: 'column', width: "55%", }]}>
                                <DropDownPicker
                                    items={[{ label: 'Male', value: 'Male', },
                                    { label: 'Female', value: 'Female', },]}
                                    itemStyle={{
                                        justifyContent: 'flex-start',
                                        elevation: 10
                                    }}
                                    defaultValue={'Male'}
                                    containerStyle={{ height: 35, width: "100%" }}
                                    onChangeItem={item => { data.gender = item.value; setData({ ...data, gender: item.value }) }} />
                            </View>
                        </View>
                        <View style={styles.tab}>
                            <Text style={[styles.heading,{color:colors.text}]}>
                                Date of Birth
                                </Text>
                            <TouchableOpacity onPress={() => showDatePicker(0)} style={[styles.textInput, { flexDirection: 'row' }]}>
                                <FontAwesome name="calendar" size={20} color="blue" style={{ marginRight: 8 }} />
                                <Text >
                                    {dateob}
                                </Text>
                            </TouchableOpacity>

                        </View>
                        <View style={styles.tab}>
                            <Text style={[styles.heading,{color:colors.text}]}>
                                Father Name
                                </Text>
                            <TextInput
                                placeholder="Father Name"
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => handleFnameChange(val)}
                            />
                        </View>
                        <View style={styles.tab}>
                            <Text style={[styles.heading,{color:colors.text}]}>
                                Father's Number
                                </Text>
                            <TextInput
                                placeholder="Father No."
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => handleFnumChange(val)}
                            />
                        </View>
                        <View style={styles.tab}>
                            <Text style={[styles.heading,{color:colors.text}]}>
                                Mother Name
                                </Text>
                            <TextInput
                                placeholder="Mother Name"
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => handleMnameChange(val)}
                            />
                        </View>
                        <View style={styles.tab}>
                            <Text style={[styles.heading,{color:colors.text}]}>
                                Mother's Number
                                </Text>
                            <TextInput
                                placeholder="Mother's No."
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => handleMnumChange(val)}
                            />
                        </View>
                        <View style={styles.tab}>
                            <Text style={[styles.heading,{color:colors.text}]}>
                                Mobile Number
                                </Text>
                            <View style={[styles.textInput, { flexDirection: 'row' }]}>
                            <FontAwesome name="phone" size={20} color="green" style={{ marginRight: 8 }} />
                                <TextInput
                                    placeholder="Mobile Number"

                                    autoCapitalize="none"
                                    onChangeText={(val) => handleMonumChange(val)}
                                />
                            </View>
                        </View><View style={styles.tab}>
                            <Text style={[styles.heading,{color:colors.text}]}>
                                Landline Number
                                </Text>
                            <TextInput
                                placeholder="Landline Number"
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => handleLnumChange(val)}
                            />
                        </View>

                        <View style={styles.tab}>
                            <Text style={[styles.heading,{color:colors.text}]}>
                                Alternate Num.
                                </Text>
                            <TextInput
                                placeholder="Alternate Number"
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => handleAnumChange(val)}
                            />
                        </View>
                        <View style={styles.tab}>
                            <Text style={[styles.heading,{color:colors.text}]}>
                                Email
                                </Text>
                            
                            <View style={[styles.textInput, { flexDirection: 'row' }]}>
                            <FontAwesome name="envelope" size={20} color="brown" style={{ marginRight: 8 }} />
                                <TextInput
                                    placeholder="Email"

                                    autoCapitalize="none"
                                    onChangeText={(val) => handleMailChange(val)}
                                />
                            </View>

                        </View>
                        <View style={styles.tab}>
                            <Text style={[styles.heading,{color:colors.text}]}>
                                Address Line 1
                                </Text>
                                <View style={[styles.textInput, { flexDirection: 'row' }]}>
                            <FontAwesome name="home" size={20} color="orange" style={{ marginRight: 8 }} />
                                <TextInput
                                    placeholder="Address Line 1"

                                    autoCapitalize="none"
                                    onChangeText={(val) => handleAdd1Change(val)}
                                />
                            </View>

                        </View>
                        <View style={styles.tab}>
                            <Text style={[styles.heading,{color:colors.text}]}>
                                Address Line 2
                                </Text>
                            <TextInput
                                placeholder="Address Line 2"
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => handleAdd2Change(val)}
                            />

                        </View>
                        <View style={styles.tab}>
                            <Text style={[styles.heading,{color:colors.text}]}>
                                Aadhaar
                                </Text>
                            
                            <View style={[styles.textInput, { flexDirection: 'row' }]}>
                            <FontAwesome name="id-card-o" size={20} style={{ marginRight: 8 }} />
                                <TextInput
                                    placeholder="Aadhaar (India)"

                                    autoCapitalize="none"
                                    onChangeText={(val) => handleAadhaarChange(val)}
                                />
                            </View>
                            

                        </View>
                        <View style={styles.tab}>
                            <Text style={[styles.heading,{color:colors.text}]}>
                                PAN
                                </Text>
                            <TextInput
                                placeholder="PAN (India)"
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => handlePanChange(val)}
                            />

                        </View>
                    </Animatable.View>
                    <Animatable.View
                        animation="fadeInUpBig"
                        style={[
                            styles.card,
                        ]}>
                        <View style={styles.tab}>
                            <Text style={[styles.heading, { color: '#13d648', width: "80%" }]}>
                                • Work Information
                                    </Text>
                        </View>

                        <View style={styles.tab}>
                            <Text style={[styles.heading,{color:colors.text}]}>
                                Salary
                                </Text>
                            <View style={[styles.textInput, { flexDirection: 'row' }]}>
                                <Text style={{ marginRight: 8 }}>
                                    ₹
                                    </Text>
                                <TextInput
                                    keyboardType='numeric'
                                    placeholder="Salary"
                                    autoCapitalize="none"
                                    onChangeText={(val) => handleSalaryChange(val)}
                                />
                            </View>

                        </View>
                        <View style={styles.tab}>
                            <Text style={[styles.heading,{color:colors.text}]}>
                                Designation
                                </Text>
                            <TextInput
                                placeholder="Designation"
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => handleDesChange(val)}
                            />
                        </View>
                        <View style={styles.tab}>
                            <Text style={[styles.heading,{color:colors.text}]}>
                                Department
                                </Text>
                            <View style={[{ borderWidth: 0, flexDirection: 'column', width: "55%", }]}>
                                <DropDownPicker
                                    items={deplist}
                                    itemStyle={{
                                        justifyContent: 'flex-start',
                                        elevation: 10
                                    }}
                                    defaultValue={'Dep1'}
                                    containerStyle={{ height: 35, width: "100%" }}
                                    onChangeItem={item => { data.dep = item.value }} />
                            </View>
                        </View>

                        <View style={styles.tab}>
                            <Text style={[styles.heading,{color:colors.text}]}>
                                Status
                                </Text>
                            <View style={[{ borderWidth: 0, flexDirection: 'column', width: "55%", }]}>
                                <DropDownPicker
                                    items={[
                                        { label: 'Active', value: 'Active', },
                                        { label: 'Inactive', value: 'Inactive', },
                                    ]}
                                    itemStyle={{
                                        justifyContent: 'flex-start',
                                        elevation: 10
                                    }}
                                    defaultValue={'Active'}
                                    containerStyle={{ height: 35, width: "100%" }}
                                    onChangeItem={item => { data.status = item.value }} />
                            </View>


                        </View>
                        <View style={styles.tab}>
                            <Text style={[styles.heading,{color:colors.text}]}>
                                Date of Joining
                                </Text>
                            <TouchableOpacity onPress={() => showDatePicker(1)} style={[styles.textInput, { flexDirection: 'row' }]}>
                                <FontAwesome name="calendar" size={20} color="blue" style={{ marginRight: 8 }} />
                                <Text >
                                    {date}
                                </Text>
                            </TouchableOpacity>

                        </View>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"

                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                        />

                    </Animatable.View>
                    <Animatable.View
                        animation="fadeInUpBig"
                        style={[
                            styles.card,
                        ]}>
                        <View style={styles.tab}>
                            <Text style={[styles.heading, { color: '#13d648', width: "80%" }]}>
                                • Bank Information
                                    </Text>
                        </View>
                        <View style={styles.tab}>
                            <Text style={[styles.heading,{color:colors.text}]}>
                                Bank Name
                                </Text>
                                <View style={[styles.textInput, { flexDirection: 'row' }]}>
                            <FontAwesome name="university" size={20} color="pink" style={{ marginRight: 8 }} />
                                <TextInput
                                    placeholder="Bank Name"

                                    autoCapitalize="none"
                                    onChangeText={(val) => handleBankChange(val)}
                                />
                            </View>
                        </View>
                        <View style={styles.tab}>
                            <Text style={[styles.heading,{color:colors.text}]}>
                                Acc. Holder Name
                                </Text>
                            <TextInput
                                placeholder="Acc. Holder Name"
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => handleAccnameChange(val)}
                            />
                        </View>
                        <View style={styles.tab}>
                            <Text style={[styles.heading,{color:colors.text}]}>
                                Acc. Number
                                </Text>
                            <TextInput
                                placeholder="Account No."
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => handleAccnumChange(val)}
                            />
                        </View>
                        <View style={styles.tab}>
                            <Text style={[styles.heading,{color:colors.text}]}>
                                IFSC
                                </Text>
                            <TextInput
                                placeholder="IFSC Code"
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => handleIfscChange(val)}
                            />
                        </View>
                        <View style={styles.tab}>
                            <Text style={[styles.heading,{color:colors.text}]}>
                                Branch
                                </Text>
                            <TextInput
                                placeholder="Branch"
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => handleBranchChange(val)}
                            />

                        </View>
                    </Animatable.View>
                    <View style={styles.button}>
                        <TouchableOpacity
                            style={[styles.signIn, {
                                marginTop: 15
                            }]}
                            onPress={() => { console.log("SAVED"); setSaving(true); console.log(data) }}
                        >
                            <LinearGradient
                                colors={['#fbb034', '#ffdd00']}
                                style={styles.signIn}
                                start={[-1, 0]}
                                end={[1, 0]}
                            >

                                <Text style={[styles.textSign, {
                                    color: '#fffff0'
                                }]}>
                                    SAVE </Text>
                                {saving ? <ActivityIndicator style={{ marginLeft: "5%" }} size="small" color="#fffff0" /> : null}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                </ScrollView>

            </View> : <ActivityIndicator style={styles.loader} size="large" color="green" />}
        </View>
    );
}
const AddEmpStackScreen = ({ route, navigation }) => {
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
                name="AddEmpStackScreen"
                component={AddEmpScreen}
                options={{
                    title: 'Add Employees',
                    headerLeft: () => (
                        <FontAwesome.Button name="bars" size={25} backgroundColor="green" onPress={() => navigation.openDrawer()} />

                    )
                }}
            />
        </Stack.Navigator>
    );
}
export default AddEmpStackScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        
    }, loader: {
        flex: 1,
        justifyContent: "center",
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
        marginTop: "70%",
    }, avata: {
        flex: 1,
        marginTop: "8%",
        marginBottom: "3%",
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    }, textInput: {
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 1,
        flexDirection: 'column',
        width: "55%",
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
        paddingBottom: 5,
        marginTop: 5,
    }, tab: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5,
        flexWrap: 'wrap'

    }, card: {
        marginTop: '2%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e5e8e3',
        margin: '3%',
        marginTop: "1%",
        marginBottom: "1%",
        padding: 2,
    }, heading: {
        fontWeight: 'bold',
        width: "40%"
    }, val: {
        flexDirection: 'column',
        width: "40%"

    }, signIn: {
        width: '60%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
        flexDirection: 'row'
    }, button: {
        alignItems: 'center',
        marginTop: 5
    }, floatingButtonStyle: {
        resizeMode: 'contain',
        width: 50,
        height: 50,
        //backgroundColor:'black'
    }, touchableOpacityStyle: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        elevation: 300,
        right: 30,
        bottom: 30,
        position: 'absolute'

    },
});
