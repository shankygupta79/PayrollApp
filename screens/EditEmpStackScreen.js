import React from 'react';
import { Alert, View, Text, TextInput, ScrollView, StyleSheet, ActivityIndicator, Dimensions, RefreshControl, } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Checkbox, Avatar, } from 'react-native-paper';
import Constants from 'expo-constants';
import { RNS3 } from 'react-native-aws3';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from '@react-native-community/async-storage';
import { useTheme } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import BottomNav from './BottomNav.js';
import { TouchableOpacity } from 'react-native-gesture-handler';
var { width, height } = Dimensions.get('window');
const Stack = createStackNavigator();
var keys = ['admin', 'office_close', 'userToken', 'access', 'userToken2']
var sorter = "Name"
var whichdate = -1
var myArray = {
}
var myArray2 = {
}

var symbol = ''
var emp_id = 0
var z = ""
var api = ""
var api2 = ""

const EditEmpScreen = (props, { route, navigation }) => {
    const { colors } = useTheme();
    navigation = props.navigation
    const [edit, setEdit] = React.useState(false)
    const [loader, setLoader] = React.useState(false)
    const [images, setImages] = React.useState("")
    const [imagesloading, setImageLoading] = React.useState(false)
    const [change, setChange] = React.useState(0);
    const [image, setImage] = React.useState(null);
    const [saving, setSaving] = React.useState(false)
    const [checked1, setChecked1] = React.useState(true);
    const [checked2, setChecked2] = React.useState(true);
    const [select1, setSelect1] = React.useState("")
    const [visible1, setVisible1] = React.useState(false)
    const [gender, setGender] = React.useState("")
    const [status, setStatus] = React.useState("")
    const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);

    const showDatePicker = (a) => {
        whichdate = a
        setDatePickerVisibility(true);
    };
    const api1 = async (api, api2) => {
        console.log("called")
        setLoader(false)
        return fetch(api)
            .then((response) => response.json())
            .then((responseJson) => {
                myArray = responseJson;
                setData(responseJson);
                return fetch(api2)
                    .then((response) => response.json())
                    .then((responseJson2) => {
                        myArray2 = responseJson2[0];
                        setData2(responseJson2[0]);
                        setStatus(responseJson.status)
                        setGender(responseJson2[0].gender)

                        if (responseJson2[0].gender == 'Male') {
                            setChecked2(true)
                        } else {
                            setChecked2(false)
                        }
                        if (responseJson.status == "Active") {
                            setChecked1(true)
                        } else {
                            setChecked1(false)
                        }
                        setLoader(true)
                        setRef(false)
                    })
                    .catch((error) => {
                        Alert.alert('Some Error!', 'Try Again Some Error.' + error, [
                            { text: 'Okay' }
                        ]);
                        setLoader(true)
                        setRef(false)
                        return
                    });
            })
            .catch((error) => {
                Alert.alert('Some Error!', 'Try Again Some Error.' + error, [
                    { text: 'Okay' }
                ]);
                setLoader(true)
                setRef(false)
                return
            });




    };

    const hideDatePicker = () => {

        setDatePickerVisibility(false);
    };
    const handleDesChange = (val) => { setData({ ...data, des: val }) }
    const handleBankChange = (val) => { setData2({ ...data2, bname: val }) }
    const handleIfscChange = (val) => { setData2({ ...data2, ifsc: val }) }
    const handleAccnumChange = (val) => { setData2({ ...data2, accnum: val }) }
    const handleAccnameChange = (val) => { setData2({ ...data2, accname: val }) }
    const handleBranchChange = (val) => { setData2({ ...data2, branch: val }) }
    const handleNameChange = (val) => { setData({ ...data, name: val }) }
    const handleSalaryChange = (val) => { setData({ ...data, salary: val }) }
    const handleLnumChange = (val) => { setData2({ ...data2, land: val }) }
    const handleMonumChange = (val) => { setData({ ...data, pnum: val }) }
    const handleMnumChange = (val) => { setData2({ ...data2, mnum: val }) }
    const handleFnumChange = (val) => { setData2({ ...data2, fnum: val }) }
    const handleMnameChange = (val) => { setData2({ ...data2, mname: val }) }
    const handleFnameChange = (val) => { setData2({ ...data2, fname: val }) }
    const handleMailChange = (val) => { setData({ ...data, email: val }) }
    const handleAnumChange = (val) => { setData2({ ...data2, anum: val }) }
    const handleAdd1Change = (val) => { setData2({ ...data2, add1: val }) }
    const handleAdd2Change = (val) => { setData2({ ...data2, add2: val }) }
    const handlePanChange = (val) => { setData2({ ...data2, pan: val }); }
    const handleAadhaarChange = (val) => { setData2({ ...data2, aadhaar: val }) }
    const handleConfirm = (dat) => {
        console.log("A date has been picked: ", dat);
        if (whichdate == 0) {
            setData2({ ...data2, dob: dat.getDate() + "-" + (dat.getMonth() + 1) + "-" + dat.getFullYear() })
        } else {
            setData({ ...data, doj: dat.getDate() + "-" + (dat.getMonth() + 1) + "-" + dat.getFullYear() })
        }


        hideDatePicker();
    };
    const pickImage = async () => {
        console.log("Gallery Opened")
        await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        }).then((datax) => {

            if (!datax.cancelled) {
                setImage(datax.uri);
            }
            setData({ ...data, photo: datax.uri })
            var d = new Date()
            const file = {
                uri: datax.uri,
                name: 'photo' + d.getTime() + '.jpg',
                type: 'image/jpeg'
            };

            const options = {
                keyPrefix: "uploads/",
                bucket: Constants.manifest.extra.bucket,
                region: Constants.manifest.extra.region,
                acl: 'public-read',
                accessKey: Constants.manifest.extra.accessKey,
                secretKey: Constants.manifest.extra.secretKey,
                successActionStatus: 201,
                awsUrl: Constants.manifest.extra.awsUrl

            };

            RNS3.put(file, options).then(response => {
                if (response.status !== 201) {
                    setImageLoading(false)
                    Alert.alert('Some Error in Image Uploading!', 'Try Again Some Error Occured in Image Uploading.' + response, [
                        { text: 'Okay' }
                    ]);
                    return
                } else {
                    console.log(response.body.postResponse.location)
                    setImages(response.body.postResponse.location)
                    setImageLoading(false)
                }
            });
        })
            .catch(err => {
                setImageLoading(false)
                Alert.alert('Some Error in Image Uploading!', 'Try Again Some Error Occured in Image Uploading.', [
                    { text: 'Okay' }
                ]);
                console.error(err)
            });

    };
    const [data, setData] = React.useState({})
    const [data2, setData2] = React.useState({})
    const [ref, setRef] = React.useState(false)
    const onRefresh = () => {
        setRef(true);
        api1(api, api2)

    }
    emp_id = props.empid
    React.useEffect(() => {

    }, [change])
    React.useEffect(() => {
        AsyncStorage.multiGet(keys, async (err, stores) => {
            setLoader(false)
            setEdit(false)
            var admin = stores[0][1];
            var off = stores[1][1];
            var id = stores[2][1];
            var access = stores[3][1];
            var id2 = stores[4][1];
            api = 'https://payrollv2.herokuapp.com/employee/api/quickemp?empid=' + emp_id + "&id=" + encodeURIComponent(id) + '&platform=APP&admin=' + encodeURIComponent(admin) + '&id2=' + encodeURIComponent(id2) + "&off=" + encodeURIComponent(off) + "&access=" + encodeURIComponent(access);
            api2 = 'https://payrollv2.herokuapp.com/employee/api/emp?empid=' + emp_id + "&id=" + encodeURIComponent(id) + '&platform=APP&admin=' + encodeURIComponent(admin) + '&id2=' + encodeURIComponent(id2) + "&off=" + encodeURIComponent(off) + "&access=" + encodeURIComponent(access)

            z = '&id=' + encodeURIComponent(id) + '&platform=APP&admin=' + encodeURIComponent(admin) + '&id2=' + encodeURIComponent(id2) + "&off=" + encodeURIComponent(off) + "&access=" + encodeURIComponent(access);
            api1(api, api2)

            //setLoader(true)



        })
    }, [navigation, props])
    const changestatus = async (xx) => {
        console.log("Changing Status")
        try {

            fetch('https://payrollv2.herokuapp.com/employee/api/active?empid=' + emp_id + z, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    emp_id: data.emp_id,
                    status: xx,
                })
            }).then((response) => response.json())
                .then((data) => {
                    if (data.message == 'true') {

                        return
                    } else {
                        Alert.alert('Some Error!', 'Try Again Some Error.', [
                            { text: 'Okay' }
                        ]);
                        return
                    }

                })

        } catch {
            Alert.alert('Some Error!', 'Try Again Some Error.', [
                { text: 'Okay' }
            ]);
            return

        }

    };
    const save = async () => {

        if (imagesloading == true) {
            Alert.alert('Image Uploading !', 'Try Again after Image Upload is Done.', [
                { text: 'Okay' }
            ]);
            return
        }


        var gender_f = ""
        var status_f = ""
        var photu = ""
        if (checked2 == true) {
            gender_f = "Male"
        } else {
            gender_f = "Female"
        }
        if (saving == true) {
            return
        }
        if (checked1 == true) {
            status_f = "Active"
        } else {
            status_f = "In-Active"
        }
        if (data.status != status_f) {
            changestatus(status_f)
        }
        if (images != "") {
            photu = "https://" + images
        } else {
            photu = data.photo
        }

        if (data.salary <= 0) {
            Alert.alert('Enter Valid Salary!', 'Salary must be valid Integer.', [
                { text: 'Okay' }
            ]);
        } else {
            setLoader(false)
            setSaving(true)
            try {

                fetch('https://payrollv2.herokuapp.com/employee/edit_empdata?empid=' + emp_id + z, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        empid: data.emp_id,
                        fname: data2.fname,
                        mname: data2.mname,
                        gender: gender_f,
                        dob: data2.dob,
                        aadhaar: data2.aadhaar,
                        pan: data2.pan,
                        fnum: data2.fnum,
                        mnum: data2.mnum,
                        anum: data2.anum,
                        add1: data2.add1,
                        add2: data2.add2,
                        land: data2.land,
                        salary: data.salary,
                        bname: data2.bname,
                        ifsc: data2.ifsc,
                        accnum: data2.accnum,
                        accname: data2.accname,
                        branch: data2.branch,
                        status: status_f,
                        name: data.name,
                        doj: data.doj,
                        des: data.des,
                        dep: data.dep,
                        email: data.email,
                        phone: data.pnum,
                        photo: photu,
                        doc1: data2.doc1,
                        doc2: data2.doc2,
                        doc3: data2.doc3,
                        doc4: data2.doc4,
                        doc5: data2.doc5,
                    })
                }).then((response) => response.json())
                    .then((data) => {
                        console.log(data)
                        if(data==false){
                            Alert.alert('No Access!', 'Ask Admin to provide you the access to edit this page !.', [
                              { text: 'Okay' }
                            ]);
                            setRef(false)
                            setLoader(true)
                            setSaving(false)
                            return 
                          }
                        setSaving(false)
                        setImages("")
                        setImage(false)
                        setLoader(true)
                        if (data.message == 'true') {
                            setChange(change + 1)
                            Alert.alert('Success', 'Employee Edited Successfully.', [
                                { text: 'Okay', }
                            ]);
                            return
                        } else {
                            Alert.alert('Some Error!', 'Try Again Some Error.', [
                                { text: 'Okay' }
                            ]);
                            return
                        }

                    })

            } catch {
                Alert.alert('Some Error!', 'Try Again Some Error.', [
                    { text: 'Okay' }
                ]);
                setSaving(false)
                setLoader(true)
                return

            }
        }
    };
    return (
        <View style={styles.container}>
            {edit ? <View style={styles.touchableOpacityStyle}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => { setEdit(!edit); save() }}>
                    <FontAwesome name="floppy-o" size={25} backgroundColor="green" color="white" />

                </TouchableOpacity>
            </View> :
                <View style={styles.touchableOpacityStyle}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => { setEdit(!edit) }}>
                        <FontAwesome name="pencil" size={25} backgroundColor="green" color="white" />

                    </TouchableOpacity>
                </View>}
            {loader ? <ScrollView refreshControl={
                <RefreshControl
                    refreshing={ref}
                    onRefresh={onRefresh}
                />}>
                {
                    edit ? <View>
                        <View style={styles.avata}>
                            <TouchableOpacity onPress={pickImage}>
                                <Avatar.Image size={100} source={{ uri: data.photo }} />
                            </TouchableOpacity>


                        </View>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"

                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                        />
                        <Animatable.View
                            animation="fadeInUpBig"
                            style={[
                                styles.card, { backgroundColor: colors.back2 }
                            ]}>
                            <View style={styles.tab}>
                                <Text style={[styles.heading, { color: '#13d648', width: "80%" }]}>
                                    • Basic Information
                                    </Text>
                            </View>
                            <View style={styles.tab}>
                                <Text style={[styles.heading, { color: colors.text }]}>
                                    Name
                                </Text>
                                <TextInput
                                    placeholder="Name"
                                    style={[styles.textInput, { color: colors.text }]}
                                    autoCapitalize="none"
                                    onChangeText={(val) => handleNameChange(val)}
                                    value={data.name}
                                />
                            </View>
                            <View style={styles.tab}>
                                <Text style={[styles.heading, { color: colors.text }]}>
                                    Gender
                                </Text>
                                <View style={[{ borderWidth: 0, flexDirection: 'row', width: "55%", alignItems: 'center' }]}>
                                    <Text style={{ color: colors.text }}>
                                        Male
                                </Text>
                                    <Checkbox
                                        status={checked2 ? 'checked' : 'unchecked'}
                                        onPress={() => {
                                            setChecked2(!checked2);
                                            setGender(!checked2 ? 'Female' : 'Male')
                                        }}
                                        color={'green'}
                                    />
                                    <Text>
                                        {"  "}
                                    </Text>

                                    <Text style={{ color: colors.text }}>
                                        Female
                                </Text>
                                    <Checkbox
                                        status={!checked2 ? 'checked' : 'unchecked'}
                                        onPress={() => {
                                            setChecked2(!checked2);
                                            setGender(!checked2 ? 'Female' : 'Male')
                                        }}
                                        color={'green'}
                                    />
                                </View>
                            </View>
                            <View style={styles.tab}>
                                <Text style={[styles.heading, { color: colors.text, }]}>
                                    Date of Birth
                                </Text>
                                <TouchableOpacity onPress={() => showDatePicker(0)} style={[styles.textInput, { flexDirection: 'row', width: width * 0.50 }]}>
                                    <FontAwesome name="calendar" size={20} color="#5e92e0" style={{ marginRight: 8 }} />
                                    <Text style={{ color: colors.text }}>
                                        {data2.dob}
                                    </Text>
                                </TouchableOpacity>

                            </View>
                            <View style={styles.tab}>
                                <Text style={[styles.heading, { color: colors.text }]}>
                                    Father Name
                                </Text>
                                <TextInput
                                    placeholder="Father Name"
                                    style={[styles.textInput, { color: colors.text }]}
                                    autoCapitalize="none"
                                    onChangeText={(val) => handleFnameChange(val)}
                                    value={data2.fname}
                                />
                            </View>
                            <View style={styles.tab}>
                                <Text style={[styles.heading, { color: colors.text }]}>
                                    Father's Number
                                </Text>
                                <TextInput
                                    keyboardType={'numeric'}
                                    placeholder="Father No."
                                    style={[styles.textInput, { color: colors.text }]}
                                    autoCapitalize="none"
                                    onChangeText={(val) => handleFnumChange(val)}
                                    value={data2.fnum}
                                />
                            </View>
                            <View style={styles.tab}>
                                <Text style={[styles.heading, { color: colors.text }]}>
                                    Mother Name
                                </Text>
                                <TextInput
                                    placeholder="Mother Name"
                                    style={[styles.textInput, { color: colors.text }]}
                                    autoCapitalize="none"
                                    onChangeText={(val) => handleMnameChange(val)}
                                    value={data2.mname}
                                />
                            </View>
                            <View style={styles.tab}>
                                <Text style={[styles.heading, { color: colors.text }]}>
                                    Mother's Number
                                </Text>
                                <TextInput
                                    keyboardType={'numeric'}
                                    placeholder="Mother's No."
                                    style={[styles.textInput, { color: colors.text }]}
                                    autoCapitalize="none"
                                    onChangeText={(val) => handleMnumChange(val)}
                                    value={data2.mnum}
                                />
                            </View>
                            <View style={styles.tab}>
                                <Text style={[styles.heading, { color: colors.text }]}>
                                    Mobile Number
                                </Text>
                                <View style={[styles.textInput, { flexDirection: 'row' }]}>
                                    <FontAwesome name="phone" size={20} color="green" style={{ marginRight: 8 }} />
                                    <TextInput
                                        keyboardType={'numeric'}
                                        placeholder="Mobile Number"
                                        style={{ color: colors.text }}
                                        autoCapitalize="none"
                                        onChangeText={(val) => handleMonumChange(val)}
                                        value={data.pnum}
                                    />
                                </View>
                            </View><View style={styles.tab}>
                                <Text style={[styles.heading, { color: colors.text }]}>
                                    Landline Number
                                </Text>
                                <TextInput
                                    keyboardType={'numeric'}
                                    placeholder="Landline Number"
                                    style={[styles.textInput, { color: colors.text }]}
                                    autoCapitalize="none"
                                    onChangeText={(val) => handleLnumChange(val)}
                                    value={data2.land}
                                />
                            </View>

                            <View style={styles.tab}>
                                <Text style={[styles.heading, { color: colors.text }]}>
                                    Alternate Num.
                                </Text>
                                <TextInput
                                    placeholder="Alternate Number"
                                    keyboardType={'numeric'}
                                    style={[styles.textInput, { color: colors.text }]}
                                    autoCapitalize="none"
                                    onChangeText={(val) => handleAnumChange(val)}
                                    value={data2.anum}
                                />
                            </View>
                            <View style={styles.tab}>
                                <Text style={[styles.heading, { color: colors.text }]}>
                                    Email
                                </Text>

                                <View style={[styles.textInput, { flexDirection: 'row' }]}>
                                    <FontAwesome name="envelope" size={20} color="brown" style={{ marginRight: 8 }} />
                                    <TextInput
                                        placeholder="Email"
                                        style={{ color: colors.text }}
                                        autoCapitalize="none"
                                        onChangeText={(val) => handleMailChange(val)}
                                        value={data.email}
                                    />
                                </View>

                            </View>
                            <View style={styles.tab}>
                                <Text style={[styles.heading, { color: colors.text }]}>
                                    Address Line 1
                                </Text>
                                <View style={[styles.textInput, { flexDirection: 'row' }]}>
                                    <FontAwesome name="home" size={20} color="orange" style={{ marginRight: 8 }} />
                                    <TextInput
                                        placeholder="Address Line 1"
                                        style={[{ color: colors.text }]}
                                        autoCapitalize="none"
                                        onChangeText={(val) => handleAdd1Change(val)}
                                        value={data2.add1}
                                    />
                                </View>

                            </View>
                            <View style={styles.tab}>
                                <Text style={[styles.heading, { color: colors.text }]}>
                                    Address Line 2
                                </Text>
                                <TextInput
                                    placeholder="Address Line 2"
                                    style={[styles.textInput, { color: colors.text }]}
                                    autoCapitalize="none"
                                    onChangeText={(val) => handleAdd2Change(val)}
                                    value={data2.add2}
                                />

                            </View>
                            <View style={styles.tab}>
                                <Text style={[styles.heading, { color: colors.text }]}>
                                    Aadhaar
                                </Text>

                                <View style={[styles.textInput, { flexDirection: 'row' }]}>
                                    <FontAwesome name="id-card-o" color={'brown'} size={20} style={{ marginRight: 8 }} />
                                    <TextInput
                                        placeholder="Aadhaar (India)"
                                        style={[{ color: colors.text }]}
                                        autoCapitalize="none"
                                        onChangeText={(val) => handleAadhaarChange(val)}
                                        value={data2.aadhaar}
                                    />
                                </View>


                            </View>
                            <View style={styles.tab}>
                                <Text style={[styles.heading, { color: colors.text }]}>
                                    PAN
                                </Text>
                                <TextInput
                                    placeholder="PAN (India)"
                                    style={[styles.textInput, { color: colors.text }]}
                                    autoCapitalize="none"
                                    onChangeText={(val) => handlePanChange(val)}
                                    value={data2.pan}
                                />

                            </View>
                        </Animatable.View>
                        <Animatable.View
                            animation="fadeInUpBig"
                            style={[
                                styles.card, { backgroundColor: colors.back2 }
                            ]}>
                            <View style={styles.tab}>
                                <Text style={[styles.heading, { color: '#13d648', width: "80%" }]}>
                                    • Work Information
                                    </Text>
                            </View>

                            <View style={styles.tab}>
                                <Text style={[styles.heading, { color: colors.text }]}>
                                    Salary
                                </Text>
                                <View style={[styles.textInput, { flexDirection: 'row' }]}>
                                    <Text style={{ marginRight: 8, color: colors.text }}>
                                        ₹
                                    </Text>
                                    <TextInput
                                        keyboardType='numeric'
                                        placeholder="Salary"
                                        autoCapitalize="none"
                                        style={{ color: colors.text }}
                                        onChangeText={(val) => handleSalaryChange(val)}
                                        value={data.salary}
                                    />
                                </View>

                            </View>
                            <View style={styles.tab}>
                                <Text style={[styles.heading, { color: colors.text }]}>
                                    Designation
                                </Text>
                                <TextInput
                                    placeholder="Designation"
                                    style={[styles.textInput, { color: colors.text }]}
                                    autoCapitalize="none"
                                    onChangeText={(val) => handleDesChange(val)}
                                    value={data.des}
                                />
                            </View>


                            <View style={styles.tab}>
                                <Text style={[styles.heading, { color: colors.text }]}>
                                    Status
                                </Text>
                                <View style={[{ borderWidth: 0, flexDirection: 'row', width: "55%", alignItems: 'center' }]}>

                                    <Text style={{ color: colors.text }}>
                                        Active
                                </Text><Checkbox
                                        status={checked1 ? 'checked' : 'unchecked'}
                                        onPress={() => {
                                            setChecked1(!checked1);
                                            setStatus(checked1 ? 'In-Active' : 'Active')
                                        }}
                                        color={'green'}
                                    />

                                    <Text>
                                        {"  "}
                                    </Text>
                                    <Text style={{ color: colors.text }}>
                                        In-Active
                                </Text>
                                    <Checkbox
                                        status={!checked1 ? 'checked' : 'unchecked'}
                                        onPress={() => {
                                            setChecked1(!checked1);
                                            setStatus(checked1 ? 'In-Active' : 'Active')
                                        }}
                                        color={'green'}
                                    />

                                </View>


                            </View>
                            <View style={styles.tab}>
                                <Text style={[styles.heading, { color: colors.text }]}>
                                    Date of Joining
                                </Text>
                                <TouchableOpacity onPress={() => showDatePicker(1)} style={[styles.textInput, { flexDirection: 'row', width: width * 0.50 }]}>
                                    <FontAwesome name="calendar" size={20} color="#5e92e0" style={{ marginRight: 8 }} />
                                    <Text style={{ color: colors.text }}>
                                        {data.doj}
                                    </Text>
                                </TouchableOpacity>

                            </View>


                        </Animatable.View>
                        <Animatable.View
                            animation="fadeInUpBig"
                            style={[
                                styles.card, { backgroundColor: colors.back2 }
                            ]}>
                            <View style={styles.tab}>
                                <Text style={[styles.heading, { color: '#13d648', width: "80%" }]}>
                                    • Bank Information
                                    </Text>
                            </View>
                            <View style={styles.tab}>
                                <Text style={[styles.heading, { color: colors.text }]}>
                                    Bank Name
                                </Text>
                                <View style={[styles.textInput, { flexDirection: 'row' }]}>
                                    <FontAwesome name="university" size={20} color="pink" style={{ marginRight: 8 }} />
                                    <TextInput
                                        placeholder="Bank Name"
                                        style={{ color: colors.text }}
                                        autoCapitalize="none"
                                        onChangeText={(val) => handleBankChange(val)}
                                        value={data2.bname}
                                    />
                                </View>
                            </View>
                            <View style={styles.tab}>
                                <Text style={[styles.heading, { color: colors.text }]}>
                                    Acc. Holder Name
                                </Text>
                                <TextInput
                                    placeholder="Acc. Holder Name"
                                    style={[styles.textInput, { color: colors.text }]}
                                    autoCapitalize="none"
                                    onChangeText={(val) => handleAccnameChange(val)}
                                    value={data2.accname}
                                />
                            </View>
                            <View style={styles.tab}>
                                <Text style={[styles.heading, { color: colors.text }]}>
                                    Acc. Number
                                </Text>
                                <TextInput
                                    placeholder="Account No."
                                    style={[styles.textInput, { color: colors.text }]}
                                    autoCapitalize="none"
                                    onChangeText={(val) => handleAccnumChange(val)}
                                    value={data2.accnum}
                                />
                            </View>
                            <View style={styles.tab}>
                                <Text style={[styles.heading, { color: colors.text }]}>
                                    IFSC
                                </Text>
                                <TextInput
                                    placeholder="IFSC Code"
                                    style={[styles.textInput, { color: colors.text }]}
                                    autoCapitalize="none"
                                    onChangeText={(val) => handleIfscChange(val)}
                                    value={data2.ifsc}
                                />
                            </View>
                            <View style={styles.tab}>
                                <Text style={[styles.heading, { color: colors.text }]}>
                                    Branch
                                </Text>
                                <TextInput
                                    placeholder="Branch"
                                    style={[styles.textInput, { color: colors.text }]}
                                    autoCapitalize="none"
                                    onChangeText={(val) => handleBranchChange(val)}
                                    value={data2.branch}
                                />

                            </View>
                            {imagesloading
                                ? <View style={{ flexDirection: "row", justifyContent: 'center' }}>
                                    <Text style={{ color: colors.text }}>
                                        Uploading Image . . . .
                        </Text>
                                </View> : null}
                        </Animatable.View>
                    </View> :
                        <View style={{ marginTop: "0%" }}>

                            <View style={styles.avata}>
                                <Avatar.Image size={124} source={{ uri: data.photo }} />
                                <Text style={[styles.name, { color: colors.text }]}>
                                    {data.name}
                                </Text>
                                <Text style={[styles.des]}>
                                    {data.des}
                                </Text>
                            </View>
                            <Animatable.View
                                animation="fadeInUpBig"
                                style={[
                                    styles.card, { backgroundColor: colors.back2 }
                                ]}>
                                <View style={styles.tab}>
                                    <Text style={[styles.heading, { color: '#13d648', width: "80%" }]}>
                                        • Basic Information
                                    </Text>

                                </View>
                                <View style={styles.tab}>
                                    <Text style={[styles.heading, { color: colors.text }]}>
                                        D . O . B
                                    </Text>
                                    <Text style={[styles.val, { color: colors.text }]}>
                                        {data2.dob}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={[styles.heading, { color: colors.text }]}>
                                        Gender
                                            </Text>
                                    <Text style={[styles.val, { color: colors.text }]}>
                                        {gender}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={[styles.heading, { color: colors.text }]}>
                                        Father Name
                                            </Text>
                                    <Text style={[styles.val, { color: colors.text }]}>
                                        {data2.fname}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={[styles.heading, { color: colors.text }]}>
                                        Mother Name
                                            </Text>
                                    <Text style={[styles.val, { color: colors.text }]}>
                                        {data2.mname}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={[styles.heading, { color: colors.text }]}>
                                        Father's Number
                                            </Text>
                                    <Text style={[styles.val, { color: colors.text }]}>
                                        {data2.fnum}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={[styles.heading, { color: colors.text }]}>
                                        Mother's Number
                                            </Text>
                                    <Text style={[styles.val, { color: colors.text }]}>
                                        {data2.mnum}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={[styles.heading, { color: colors.text }]}>
                                        Mobile Number
                                            </Text>
                                    <Text style={[styles.val, { color: colors.text }]}>
                                        {data.pnum}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={[styles.heading, { color: colors.text }]}>
                                        Email ID
                                            </Text>
                                    <Text style={[styles.val, { color: colors.text }]}>
                                        {data.email}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={[styles.heading, { color: colors.text }]}>
                                        Landline
                                            </Text>
                                    <Text style={[styles.val, { color: colors.text }]}>
                                        {data2.land}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={[styles.heading, { color: colors.text }]}>
                                        Alternate Number
                                            </Text>
                                    <Text style={[styles.val, { color: colors.text }]}>
                                        {data2.anum}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={[styles.heading, { color: colors.text }]}>
                                        Address Line 1
                                            </Text>
                                    <Text style={[styles.val, { color: colors.text }]} numberOfLines={5}>
                                        {data2.add1}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={[styles.heading, { color: colors.text }]}>
                                        Address Line 2
                                            </Text>
                                    <Text style={[styles.val, { color: colors.text }]}>
                                        {data2.add2}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={[styles.heading, { color: colors.text }]}>
                                        Aadhaar Number
                                            </Text>
                                    <Text style={[styles.val, { color: colors.text }]}>
                                        {data2.aadhaar}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={[styles.heading, { color: colors.text }]}>
                                        Pan Number
                                            </Text>
                                    <Text style={[styles.val, { color: colors.text }]}>
                                        {data2.pan}
                                    </Text>
                                </View>

                            </Animatable.View>
                            <Animatable.View
                                animation="fadeInUpBig"
                                style={[
                                    styles.card, { backgroundColor: colors.back2 }
                                ]}>
                                <View style={styles.tab}>
                                    <Text style={[styles.heading, { color: '#13d648', width: "80%" }]}>
                                        • Work Information
                                    </Text>

                                </View>
                                <View style={styles.tab}>
                                    <Text style={[styles.heading, { color: colors.text }]}>
                                        Employee ID
                                            </Text>
                                    <Text style={[styles.val, { color: colors.text }]}>
                                        {data.emp_id}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={[styles.heading, { color: colors.text }]}>
                                        Date of Joining
                                            </Text>
                                    <Text style={[styles.val, { color: colors.text }]}>
                                        {data.doj}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={[styles.heading, { color: colors.text }]}>
                                        Salary
                                            </Text>
                                    <Text style={[styles.val, { color: colors.text }]}>
                                        {data.salary}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={[styles.heading, { color: colors.text }]}>
                                        Department
                                            </Text>
                                    <Text style={[styles.val, { color: colors.text }]}>
                                        {data.dep}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={[styles.heading, { color: colors.text }]}>
                                        Designation
                                            </Text>
                                    <Text style={[styles.val, { color: colors.text }]}>
                                        {data.des}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={[styles.heading, { color: colors.text }]}>
                                        Status
                                            </Text>
                                    <Text style={[styles.val, { color: colors.text }]}>
                                        {status}
                                    </Text>
                                </View>
                            </Animatable.View>
                            <Animatable.View
                                animation="fadeInUpBig"
                                style={[
                                    styles.card, { backgroundColor: colors.back2 }
                                ]}>
                                <View style={styles.tab}>
                                    <Text style={[styles.heading, { color: '#13d648', width: "80%" }]}>
                                        • Bank Information
                                    </Text>

                                </View>
                                <View style={styles.tab}>
                                    <Text style={[styles.heading, { color: colors.text }]}>
                                        Account Name
                                            </Text>
                                    <Text style={[styles.val, { color: colors.text }]}>
                                        {data2.accname}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={[styles.heading, { color: colors.text }]}>
                                        Account Number
                                            </Text>
                                    <Text style={[styles.val, { color: colors.text }]}>
                                        {data2.accnum}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={[styles.heading, { color: colors.text }]}>
                                        Bank Name
                                            </Text>
                                    <Text style={[styles.val, { color: colors.text }]}>
                                        {data2.bname}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={[styles.heading, { color: colors.text }]}>
                                        IFSC Code
                                            </Text>
                                    <Text style={[styles.val, { color: colors.text }]}>
                                        {data2.ifsc}
                                    </Text>
                                </View>
                                <View style={styles.tab}>
                                    <Text style={[styles.heading, { color: colors.text }]}>
                                        Branch
                                            </Text>
                                    <Text style={[styles.val, { color: colors.text }]}>
                                        {data2.branch}
                                    </Text>
                                </View>
                            </Animatable.View>


                        </View>
                }

            </ScrollView> : <ActivityIndicator style={styles.loader} size="large" color="green" />}
            <BottomNav name="" color="green" navigation={navigation}></BottomNav>
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

    }, heading: {
        fontWeight: 'bold',
        width: "40%"
    }, val: {
        flexDirection: 'column',
        width: "40%"

    }, card: {
        marginTop: '2%',
        borderRadius: 10,
        margin: '3%',
        marginTop: "1%",
        marginBottom: "1%",
        padding: 2,


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

    }, avata: {
        flex: 1,
        marginTop: "8%",
        marginBottom: "3%",
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
