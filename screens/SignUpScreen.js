import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar,
    Alert,
    ActivityIndicator
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from 'react-native-paper';
const SignInScreen = ({ navigation }) => {
    
    const [button,setButton]=React.useState(true)
    const [data, setData] = React.useState({
        username: '',
        password: '',
        confirm_password: '',
        mail: '',
        name: '',
        check_textInputChange: false,
        check_name: false,
        check_mail: false,
        secureTextEntry: true,
        confirm_secureTextEntry: true,
    });
    const { colors } = useTheme();
    const textInputChange = (val) => {
        if (val.length !== 0) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true
            });
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false
            });
        }
    }
    const namefun = (val) => {
        if (val.length !== 0) {
            setData({
                ...data,
                name: val,
                check_name: true
            });
        } else {
            setData({
                ...data,
                name: val,
                check_name: false
            });
        }
    }
    const mailfun = (val) => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)) {
            setData({
                ...data,
                mail: val,
                check_mail: true
            });
        } else {
            setData({
                ...data,
                mail: val,
                check_mail: false
            });
        }
    }

    const handlePasswordChange = (val) => {
        setData({
            ...data,
            password: val
        });
    }

    const handleConfirmPasswordChange = (val) => {
        setData({
            ...data,
            confirm_password: val
        });
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }
    const signup = (userName, password, name, mail) => {
        setButton(false)
        if (data.check_name==false) {
            Alert.alert('Wrong Input!', 'Name field cannot be empty.', [
                { text: 'Okay' }
            ]);
            setButton(true)
            return;
            
        }
        if (data.check_mail==false) {
            Alert.alert('Wrong Email!', 'Invalid E-Mail entered.', [
                { text: 'Okay' }
            ]);
            setButton(true)
            return;
        }
        if (data.password<8) {
            Alert.alert('Wrong Input!', 'Password field cannot be empty and password should have more than 8 characters.', [
                { text: 'Okay' }
            ]);
            setButton(true)
            return;
        }
        if (data.check_textInputChange==false) {
            Alert.alert('Wrong Input!', 'Username field cannot be empty.', [
                { text: 'Okay' }
            ]);
            setButton(true)
            return;
        }
        if(data.password!=data.confirm_password ){
            Alert.alert('Password Doesnt Match','Check your password again',[
                { text: 'Okay' }
            ])
            setButton(true)
            return
        }
        fetch('https://payrollv2.herokuapp.com/signup', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: data.name.toUpperCase(),
                email: data.mail.toLowerCase(),
                password: data.password,
                username: data.username,
            })
        }).then((response) => response.json())
            .then((data) => {
                console.log(data)
                if(data.data=="ms"){
                
                    Alert.alert('Hurry! Account created','An activtion Mail Has Been Sent to your Mail and you will be redirected automatically to the login page', [
                        { text: 'Okay' ,onPress:()=> navigation.goBack()}
                    ]);
                    setButton(true)
                    return
                }
                if(data.data=="ae"){
                
                    Alert.alert('Email Already Registered','Email Already Registered, Login with your email Id', [
                        { text: 'Okay',onPress:()=> navigation.goBack() }
                    ]);
                    setButton(true)
                    return
                }
                if(data.data=="ug"){
                
                    Alert.alert('Email Registered with Google','Email already Registered with Google,Please sign in with Google', [
                        { text: 'Okay',onPress:()=> navigation.goBack()}
                    ]);
                    setButton(true)
                    return
                }
                if(data.data=="uf"){
                
                    Alert.alert('Email Registered with Facebook','Email already Registered with Google,Please sign in with Facebook', [
                        { text: 'Okay',onPress:()=> navigation.goBack() }
                    ]);
                    setButton(true)
                    return
                }
                if(data.data=="error"){
                
                    Alert.alert('Database Error','Please try again Later.', [
                        { text: 'Okay',onPress:()=> navigation.goBack()}
                    ]);
                    setButton(true)
                    
                    return
                }
            }).catch((error) => {
                console.error(error);
                Alert.alert('Database Error','Please try again Later.', [
                    { text: 'Okay' }
                ]);
                setButton(true)
                return false
            })


    }
    const updateConfirmSecureTextEntry = () => {
            setData({
                ...data,
                confirm_secureTextEntry: !data.confirm_secureTextEntry
            });
        }

        return (
            <View style={styles.container}>
                <StatusBar backgroundColor='#ed3749' barStyle="light-content" />
                <View style={styles.header}>
                    <Text style={styles.text_header}>Register Now!</Text>
                </View>
                <Animatable.View
                    animation="fadeInUpBig"
                    style={[styles.footer, {
                        backgroundColor: colors.background
                    }]}
                >
                    <ScrollView>
                        <Text style={[styles.text_footer,{color:colors.text}]}>Full Name</Text>
                        <View style={styles.action}>
                            <FontAwesome
                                name="id-card-o"
                                color="red"
                                size={20}
                            />
                            <TextInput
                                placeholder="Your Full Name"
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => namefun(val)}
                            />
                            {data.check_name ?
                                <Animatable.View
                                    animation="bounceIn"
                                >
                                    <Feather
                                        name="check-circle"
                                        color="green"
                                        size={20}
                                    />
                                </Animatable.View>
                                : null}
                        </View>
                        <Text style={[styles.text_footer, {
                            marginTop: 15,color:colors.text
                        }]}>Username</Text>
                        <View style={styles.action}>
                            <FontAwesome
                                name="user-o"
                                color="red"
                                size={20}
                            />
                            <TextInput
                                placeholder="Your Username"
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => textInputChange(val)}
                            />
                            {data.check_textInputChange ?
                                <Animatable.View
                                    animation="bounceIn"
                                >
                                    <Feather
                                        name="check-circle"
                                        color="green"
                                        size={20}
                                    />
                                </Animatable.View>
                                : null}
                        </View>
                        
                        <Text style={[styles.text_footer, {
                            marginTop: 15,color:colors.text
                        }]}>Email</Text>
                        <View style={styles.action}>
                            <FontAwesome
                                name="envelope"
                                color="red"
                                size={20}
                            />
                            <TextInput
                                placeholder="Your Email"
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => mailfun(val)}
                            />
                            {data.check_mail ?
                                <Animatable.View
                                    animation="bounceIn"
                                >
                                    <Feather
                                        name="check-circle"
                                        color="green"
                                        size={20}
                                    />
                                </Animatable.View>
                                : null}
                        </View>
                        <Text style={[styles.text_footer, {
                            marginTop: 15,color:colors.text
                        }]}>Password</Text>
                        <View style={styles.action}>
                            <Feather
                                name="lock"
                                color="red"
                                size={20}
                            />
                            <TextInput
                                placeholder="Your Password"
                                secureTextEntry={data.secureTextEntry ? true : false}
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => handlePasswordChange(val)}
                            />
                            <TouchableOpacity
                                onPress={updateSecureTextEntry}
                            >
                                {data.secureTextEntry ?
                                    <Feather
                                        name="eye-off"
                                        color="grey"
                                        size={20}
                                    />
                                    :
                                    <Feather
                                        name="eye"
                                        color="grey"
                                        size={20}
                                    />
                                }
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.text_footer, {
                            marginTop: 15,color:colors.text
                        }]}>Confirm Password</Text>
                        <View style={styles.action}>
                            <Feather
                                name="lock"
                                color="red"
                                size={20}
                            />
                            <TextInput
                                placeholder="Confirm Your Password"
                                secureTextEntry={data.confirm_secureTextEntry ? true : false}
                                style={styles.textInput}
                                autoCapitalize="none"
                                onChangeText={(val) => handleConfirmPasswordChange(val)}
                            />
                            <TouchableOpacity
                                onPress={updateConfirmSecureTextEntry}
                            >
                                {data.secureTextEntry ?
                                    <Feather
                                        name="eye-off"
                                        color="grey"
                                        size={20}
                                    />
                                    :
                                    <Feather
                                        name="eye"
                                        color="grey"
                                        size={20}
                                    />
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={styles.textPrivate}>
                            <Text style={styles.color_textPrivate}>
                                By signing up you agree to our
                </Text>
                            <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Terms of service</Text>
                            <Text style={styles.color_textPrivate}>{" "}and</Text>
                            <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Privacy policy</Text>
                        </View>
                        <View style={styles.button}>
                            <TouchableOpacity
                                style={styles.signIn}
                                onPress={() => { signup(data.username, data.password, data.name, data.mail) }}
                            >
                                <LinearGradient
                                    colors={['#FFDF00', '#FFD700', '#CFB53B', '#FFDF00']}
                                    style={styles.signIn}
                                    start={[-1, 0]}
                                    end={[1, 0]}
                                >
                                    <Text style={[styles.textSign, {
                                        color: '#fff'
                                    }]}>Sign Up</Text>
                                     {!button?<ActivityIndicator style={{marginLeft:"5%"}} size="small" color="white"/>:null}
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={[styles.signIn, {
                                    borderColor: '#FFDF00',
                                    borderWidth: 1,
                                    marginTop: 15
                                }]}
                            >
                                <Text style={[styles.textSign, {
                                    color: '#FFDF00'
                                }]}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Animatable.View>
            </View>
        );
    };

    export default SignInScreen;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#ed3749'
        },
        header: {
            flex: 1,
            justifyContent: 'flex-end',
            paddingHorizontal: 20,
            paddingBottom: 50
        },
        footer: {
            flex: Platform.OS === 'ios' ? 3 : 5,
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingHorizontal: 20,
            paddingVertical: 30
        },
        text_header: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 30
        },
        text_footer: {
            color: '#05375a',
            fontSize: 18
        },
        action: {
            flexDirection: 'row',
            marginTop: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#f2f2f2',
            paddingBottom: 5
        },
        textInput: {
            flex: 1,
            marginTop: Platform.OS === 'ios' ? 0 : -12,
            paddingLeft: 10,
            color: '#05375a',
        },
        button: {
            alignItems: 'center',
            marginTop: 50
        },
        signIn: {
            width: '100%',
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            flexDirection:'row'
        },
        textSign: {
            fontSize: 18,
            fontWeight: 'bold'
        },
        textPrivate: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 20
        },
        color_textPrivate: {
            color: 'grey'
        }
    });
