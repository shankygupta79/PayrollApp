import React from 'react';
import * as Google from 'expo-google-app-auth';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    StatusBar,
    Alert,
    ActivityIndicator
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import * as AppAuth from 'expo-app-auth'; // you will use this in your logInAsync method
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from 'react-native-paper';
import { AuthContext } from '../components/context';

async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
        const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Your Notifications for our App is Closed !');
            return;
        }
        console.log("AYA")
        expotoken = (await Notifications.getExpoPushTokenAsync()).data;
        token = expotoken

    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}
var expotoken = ''
const SignInScreen = ({ navigation }) => {
    const [expoPushToken, setExpoPushToken] = React.useState('');
    const [notification, setNotification] = React.useState(false);
    const notificationListener = React.useRef();
    const responseListener = React.useRef();

    React.useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener);
            Notifications.removeNotificationSubscription(responseListener);
        };

    }, []);
    const [data, setData] = React.useState({
        username: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
    });
    const [button, setButton] = React.useState(true)
    const [button2, setButton2] = React.useState(true)
    const { colors } = useTheme();
    //let redirectUrl = Linking.makeUrl('path/into/app', { hello: 'world', goodbye: 'now' });
    const { signIn } = React.useContext(AuthContext);

    const textInputChange = (val) => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false,
                isValidUser: false
            });
        }
    }

    const handlePasswordChange = (val) => {
        if (val.trim().length >= 8) {
            setData({
                ...data,
                password: val,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false
            });
        }
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const handleValidUser = (val) => {
        if (val.trim().length >= 4) {
            setData({
                ...data,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                isValidUser: false
            });
        }
    }

    const loginGoogle = () => {
        setButton2(false)
        signInWithGoogleAsync()
        async function signInWithGoogleAsync() {
            try {
                console.log("G-")
                const result = await Google.logInAsync({
                    iosClientId: "324297696097-v4s7k340rtkprsf3bg85p2pncimg4krb.apps.googleusercontent.com",
                    androidClientId: "324297696097-7and849kka8idqrk8moq91ubbs8fliiu.apps.googleusercontent.com",
                    androidStandaloneAppClientId: "324297696097-7and849kka8idqrk8moq91ubbs8fliiu.apps.googleusercontent.com",
                    iosStandaloneAppClientId: "324297696097-v4s7k340rtkprsf3bg85p2pncimg4krb.apps.googleusercontent.com",
                    scopes: ['profile', 'email'],
                    redirectUrl: "com.shankygupta79.payrollapp:/oauth2redirect/google" 
                });
                if (result.type === 'success') {
                    console.log("SUC")

                    return fetch('https://payrollv2.herokuapp.com/auth/googleapp', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            user: result.user,
                            expotoken: expotoken,
                        })
                    }).then((response) => response.json())
                        .then((data) => {
                            //console.log(data)
                            if (data[0] == 'true') {
                                const founduser = [{ username: data.username, userToken: data[1], fullname: data[2], access: data[3], currency: data[4], office_close: data[5], logo: data[6], admin: data[7], userToken2: data[8] }]
                                console.log("Verified")
                                signIn(founduser);
                                return true
                            }
                            if (data[0] == "false") {

                                Alert.alert('Error in Authentication', 'Try Again ! ', [
                                    { text: 'Okay' }
                                ]);
                                setButton2(true)
                                return
                            }
                        })
                } else {
                    Alert.alert('Try Again', 'Error in authorizing your google account !', [
                        { text: 'Okay' }
                    ]);
                    setButton2(true)
                    return { cancelled: true };
                }
            } catch (e) {
                Alert.alert('Error Occured', 'Error Logging using Google' + e, [
                    { text: 'Okay' }
                ]);
                setButton2(true)
                return { error: true };
            }
        }
    }
    const loginHandle = (userName, password) => {
        if (data.username.length == 0 || data.password.length == 0) {
            Alert.alert('Wrong Input!', 'Email or password field cannot be empty.', [
                { text: 'Okay' }
            ]);
            return;
        }
        setButton(false)
        fetch('https://payrollv2.herokuapp.com/auth/local', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: data.username + ";" + expotoken,
                password: data.password,
            })
        }).then((response) => response.json())
            .then((data) => {
                //console.log(data)
                if (data[0] == 'true') {
                    const founduser = [{ username: data.username, userToken: data[1], fullname: data[2], access: data[3], currency: data[4], office_close: data[5], logo: data[6], admin: data[7], userToken2: data[8] }]
                    console.log("Verified")
                    signIn(founduser);
                    return true
                }
                if (data[0] == "ue") {

                    Alert.alert('User Not Exists', 'User not exists ! Please signup with us .', [
                        { text: 'Okay' }
                    ]);
                    setButton(true)
                    return
                }
                if (data[0] == "wp") {

                    Alert.alert('Wrong Password', 'You have entered wrong password', [
                        { text: 'Okay' }
                    ]);
                    setButton(true)
                    return
                }
                if (data[0] == "ve") {

                    Alert.alert('Validation Error', 'Please activate your account by tapping on the link mailed to you.', [
                        { text: 'Okay' }
                    ]);
                    setButton(true)
                    return
                }
                if (data[0] == "ag") {

                    Alert.alert('Already a User', 'You have previously logged in using Google.', [
                        { text: 'Okay' }
                    ]);
                    setButton(true)
                    return
                }
                if (data[0] == "af") {

                    Alert.alert('Already a User', 'You have previously logged in using Facebook.', [
                        { text: 'Okay' }
                    ]);
                    setButton(true)
                    return
                }

            })
            .catch((error) => {
                console.error(error);
                Alert.alert('Database Error', 'Please try again Later.', [
                    { text: 'Okay' }
                ]);
                setButton(true)
                return false
            });



        //signIn(foundUser);
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#ed3749' barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>Welcome!</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={[styles.footer, {
                    backgroundColor: colors.background
                }]}
            >
                <Text style={[styles.text_footer, {
                    color: colors.text
                }]}>Email</Text>
                <View style={styles.action}>
                    <FontAwesome
                        name="envelope"
                        color={colors.text}
                        size={20}
                    />
                    <TextInput
                        placeholder="Your Email"
                        placeholderTextColor="#666666"
                        editable={button}
                        selectTextOnFocus={button}
                        style={[styles.textInput, {
                            color: colors.text
                        }]}

                        autoCapitalize="none"
                        onChangeText={(val) => textInputChange(val)}
                        onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
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
                {data.isValidUser ? null :
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Enter a  Valid Email.</Text>
                    </Animatable.View>
                }


                <Text style={[styles.text_footer, {
                    color: colors.text,
                    marginTop: 35
                }]}>Password</Text>
                <View style={styles.action}>
                    <Feather
                        name="lock"
                        color={colors.text}
                        size={20}
                    />
                    <TextInput
                        placeholder="Your Password"
                        placeholderTextColor="#666666"
                        secureTextEntry={data.secureTextEntry ? true : false}
                        style={[styles.textInput, {
                            color: colors.text
                        }]}
                        autoCapitalize="none"
                        editable={button}
                        selectTextOnFocus={button}
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
                {data.isValidPassword ? null :
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Password must be 8 characters long.</Text>
                    </Animatable.View>
                }


                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassScreen')}>
                    <Text style={{ color: '#ed3749', marginTop: 15 }}>Forgot password?</Text>
                </TouchableOpacity>
                <View style={styles.button}>
                    <TouchableOpacity
                        style={styles.signIn}
                        onPress={() => { loginHandle(data.username, data.password) }}
                    >
                        <LinearGradient
                            colors={['#FFDF00', '#FFD700', '#CFB53B', '#FFDF00']}
                            style={styles.signIn}
                            start={[-1, 0]}
                            end={[1, 0]}
                        >

                            <Text style={[styles.textSign, {
                                color: '#fff'
                            }]}>Sign In
                            </Text>
                            {!button ? <ActivityIndicator style={{ marginLeft: "5%" }} size="small" color="white" /> : null}
                        </LinearGradient>
                    </TouchableOpacity>


                    <TouchableOpacity
                        style={[styles.signIn, {
                            marginTop: 15
                        }]}
                        onPress={() => { loginGoogle() }}
                    >
                        <LinearGradient
                            colors={['#466afa', '#2041c7', '#6482fa', '#466afa']}
                            style={styles.signIn}
                            start={[-1, 0]}
                            end={[1, 0]}
                        >

                            <Text style={[styles.textSign, {
                                color: '#fff'
                            }]}>
                                <FontAwesome
                                    name="google-plus"
                                    color="#ffff"
                                    size={20}
                                    alignItems='flex-start'
                                />    Google Login</Text>
                            {!button2 ? <ActivityIndicator style={{ marginLeft: "5%" }} size="small" color="white" /> : null}
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('SignUpScreen')}
                        style={[styles.signIn, {
                            borderColor: '#FFDF00',
                            borderWidth: 1,
                            marginTop: 15
                        }]}
                    >
                        <Text style={[styles.textSign, {
                            color: '#FFDF00'
                        }]}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ed3749' //Red
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
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
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
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
        borderRadius: Platform.OS === 'ios' ? 20 : 50,
        flexDirection: 'row'
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});
