import React from 'react';
import { Alert, TextInput, View, Text, Image, ScrollView, StyleSheet, Dimensions, RefreshControl, FlatList, TouchableHighlight } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { RNS3 } from 'react-native-aws3';
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';
import * as Animatable from 'react-native-animatable';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { Checkbox, ActivityIndicator, Avatar, } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { useTheme } from '@react-navigation/native';
const Stack = createStackNavigator();
import BottomNav from './BottomNav.js';
import Ripple from 'react-native-material-ripple';
const { width, height } = Dimensions.get("screen");
var z = ""
var api=""
var keys = ['admin', 'office_close', 'userToken', 'access', 'userToken2', 'logo']
var map = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua ", " Barbuda", "Argentina", "Armenia", "Aruba",
  "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia",
  "Bosnia", "Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Cape Verde", "Cayman Islands", "Chad",
  "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica", "Cote D Ivoire", "Croatia", "Cruise Ship", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica",
  "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia",
  "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana",
  "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyz Republic", "Laos", "Latvia",
  "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico",
  "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria",
  "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre", " Miquelon", "Samoa", "San Marino", "Satellite",
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "St Kitts ", " Nevis", "St Lucia", "St Vincent", "St. Lucia", "Sudan", "Suriname", "Swaziland", "Sweden",
  "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad", " Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks", " Caicos", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "Uruguay",
  "Uzbekistan", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];
const SettingsScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const [change, setChange] = React.useState(0)
  const [loader, setLoader] = React.useState(false)
  const [ref, setRef] = React.useState(false)
  const [checked1, setChecked1] = React.useState(false);
  const [checked2, setChecked2] = React.useState(false);
  const [checked3, setChecked3] = React.useState(false);
  const [checked4, setChecked4] = React.useState(false);
  const [checked5, setChecked5] = React.useState(false);

  const [saving, setSaving] = React.useState(false)
  const [checked6, setChecked6] = React.useState(false);
  const [checked7, setChecked7] = React.useState(false);
  const [image, setImage] = React.useState("")
  const [imagelogo, setImageLogo] = React.useState("")
  const [imagesloading, setImageLoading] = React.useState(false)
  const [data, setData] = React.useState({
    name: '',
    phone: '',
    address: '',
    website: '',
    email: '',
    state: '',
  });
  const handleNameChange = (val) => { setData({ ...data, name: val }); }
  const handlePhoneChange = (val) => { setData({ ...data, phone: val }); }
  const handleAddressChange = (val) => { setData({ ...data, address: val }); }
  const handleWebsiteChange = (val) => { setData({ ...data, website: val }); }
  const handleEmailChange = (val) => { setData({ ...data, email: val }); }
  const [select3, setSelect3] = React.useState("")
  const [visible3, setVisible3] = React.useState(false)
  const handleStateChange = (val) => { setData({ ...data, state: val }); }
  const pickImage = async () => {
    console.log("Gallery")
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    }).then((data) => {

      if (!data.cancelled) {
        setImageLoading(true)
        setImage(data.uri);
        console.log(data.uri)
      }
      var d = new Date()
      const file = {
        uri: data.uri,
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
          console.log(response)
          setImageLoading(false)
          throw new Error('Failed to upload image to S3', response);
        } else {
          console.log(response.body.postResponse.location)
          setImageLogo("https://"+response.body.postResponse.location)
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
  const save = async () => {
    if (imagesloading == true) {
      Alert.alert('Image Uploading !', 'Try Again after Image Upload is Done.', [
        { text: 'Okay' }
      ]);
      return
    }
    if (saving == true) {
      return
    }
    setSaving(true)
    var abc = (checked1 + 0) + "" + (checked2 + 0) + "" + (checked3 + 0) + "" + (checked4 + 0) + "" + (checked5 + 0) + "" + (checked6 + 0) + "" + (checked7 + 0)
    try {
      fetch('http://payrollv2.herokuapp.com/settings/edit' + z, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          website: data.website,
          phone: data.phone,
          name: data.name,
          email: data.email,
          address: data.address,
          state: data.state,
          country: select3,
          currency: "INR (₹)",
          office: abc,
          logo: imagelogo,
        })
      }).then((response) => response.json())
        .then((data) => {
          console.log(data)
          if (data == false) {
            Alert.alert('No Access!', 'Ask Admin to provide you the access to add employee !.', [
              { text: 'Okay' }
            ]);
            setRef(false)
            setLoader(true)
            return
          }
          setSaving(false)
          if (data.message == 'true') {
            setChange(change + 1)
            Alert.alert('Success', 'Configurations Edited Successfully.', [
              { text: 'Okay' }
            ]);
            AsyncStorage.setItem('office_close', abc);
            AsyncStorage.setItem('logo', imagelogo);

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
      return

    }
  }
  const api1 = async (api) => {
    setLoader(false)
    console.log("API CALLED")
    fetch(api)
      .then((response) => response.json())
      .then((responseJson) => {
        setData({
          name: responseJson[0].name,
          phone: responseJson[0].phone,
          address: responseJson[0].add,
          website: responseJson[0].website,
          email: responseJson[0].email,
          state: responseJson[0].state,
        })
        setSelect3(responseJson[0].country)
        setLoader(true)
        setRef(false);

      }).catch((error) => {
        console.error(error);
        Alert.alert('Error Occured!', 'Some Error Occured.' + error, [
          { text: 'Okay' }
        ]);
        setLoader(true)
        setRef(false)
        return
      })
  }
  const onRefresh = () => {
    setRef(true);
    api1(api)


  }
  React.useEffect(() => {
    AsyncStorage.multiGet(keys, async (err, stores) => {
      setLoader(false)
      var admin = stores[0][1];
      var off = stores[1][1];
      var id = stores[2][1];
      var access = stores[3][1];
      var id2 = stores[4][1];
      //setImage(stores[5][1])
      setChecked1("1" == off[0])
      setChecked2("1" == off[1])
      setChecked3("1" == off[2])
      setChecked4("1" == off[3])
      setChecked5("1" == off[4])
      setChecked6("1" == off[5])
      setChecked7("1" == off[6])
      setImage(stores[5][1])
      setImageLogo(stores[5][1])
      z = '?id=' + encodeURIComponent(id) + '&platform=APP&admin=' + encodeURIComponent(admin) + '&id2=' + encodeURIComponent(id2) + "&off=" + encodeURIComponent(off) + "&access=" + encodeURIComponent(access);
      //console.log(api2)
      api = 'https://payrollv2.herokuapp.com/settings/api/setting' + z
      setLoader(true)
      api1(api)

    })

  }, [navigation, change])
  React.useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Sorry, we need camera roll permissions to upload image!');
        }
      }
    })();
  }, [navigation]);
  return (
    <View style={styles.container}>
      <ScrollView refreshControl={
        <RefreshControl
          refreshing={ref}
          onRefresh={onRefresh}
        />}>
        {loader ? <View>
          <Animatable.View
            animation="fadeInUpBig"
            style={[styles.footer, {
              backgroundColor: colors.background
            }]}>
            <Text style={[styles.text_footer, {
              marginTop: 0, color: colors.text
            }]}>Company</Text>
            <View style={styles.action}>

              <TextInput
                placeholder="Company Name"
                style={[styles.textInput, { color: colors.text }]}
                autoCapitalize="none"
                onChangeText={(val) => handleNameChange(val)}
                value={data.name}
              />
            </View>

            <Text style={[styles.text_footer, {
              marginTop: 0, color: colors.text
            }]}>Phone</Text>
            <View style={styles.action}>

              <TextInput
                placeholder="Phone Number"
                style={[styles.textInput, { color: colors.text }]}
                autoCapitalize="none"
                onChangeText={(val) => handlePhoneChange(val)}
                value={data.phone}
              />
            </View>

            <Text style={[styles.text_footer, {
              marginTop: 0, color: colors.text
            }]}>Email</Text>
            <View style={styles.action}>

              <TextInput
                placeholder="Email Address"
                style={[styles.textInput, { color: colors.text }]}
                autoCapitalize="none"
                onChangeText={(val) => handleEmailChange(val)}
                value={data.email}
              />
            </View>

            <Text style={[styles.text_footer, {
              marginTop: 0, color: colors.text
            }]}>Website</Text>
            <View style={styles.action}>

              <TextInput
                placeholder="Website URL"
                style={[styles.textInput, { color: colors.text }]}
                autoCapitalize="none"
                onChangeText={(val) => handleWebsiteChange(val)}
                value={data.website}
              />
            </View>
            <Text style={[styles.text_footer, {
              marginTop: 0, color: colors.text
            }]}>Company Address</Text>
            <View style={styles.action}>

              <TextInput
                placeholder="Company Address"
                style={[styles.textInput, { color: colors.text }]}
                autoCapitalize="none"
                onChangeText={(val) => handleAddressChange(val)}
                value={data.address}
              />
            </View>
            <Text style={[styles.text_footer, {
              marginTop: 0, color: colors.text
            }]}>State</Text>
            <View style={[styles.action, { marginBottom: 5 }]}>

              <TextInput
                placeholder="State"
                style={[styles.textInput, { color: colors.text }]}
                autoCapitalize="none"
                onChangeText={(val) => handleStateChange(val)}
                value={data.state}
              />
            </View>
            <Text style={[styles.text_footer, {
              marginTop: 0, color: colors.text
            }]}>Office Close</Text>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', width: width * 0.3 }}>
                <Checkbox
                  status={checked1 ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setChecked1(!checked1);
                  }}
                  color={'purple'}
                />
                <Text style={{ color: colors.text }}>
                  Monday
              </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', width: width * 0.3 }}>
                <Checkbox
                  status={checked2 ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setChecked2(!checked2);
                  }}
                  color={'purple'}
                />
                <Text style={{ color: colors.text }}>
                  Tuesday
              </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', width: width * 0.3 }}>
                <Checkbox
                  status={checked3 ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setChecked3(!checked3);
                  }}
                  color={'purple'}
                />
                <Text style={{ color: colors.text }}>
                  Wednesday
              </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', width: width * 0.3 }}>
                <Checkbox
                  status={checked4 ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setChecked4(!checked4);
                  }}
                  color={'purple'}
                />
                <Text style={{ color: colors.text }}>
                  Thursday
              </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', width: width * 0.3 }}>
                <Checkbox
                  status={checked5 ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setChecked5(!checked5);
                  }}
                  color={'purple'}
                />
                <Text style={{ color: colors.text }}>
                  Friday
              </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', width: width * 0.3 }}>
                <Checkbox
                  status={checked6 ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setChecked6(!checked6);
                  }}
                  color={'purple'}
                />
                <Text style={{ color: colors.text }}>
                  Saturday
              </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', width: width * 0.3 }}>
                <Checkbox
                  status={checked7 ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setChecked7(!checked7);
                  }}
                  color={'purple'}
                />
                <Text style={{ color: colors.text }}>
                  Sunday
              </Text>
              </View>
            </View>
            <Ripple style={[styles.blck, { backgroundColor: colors.back2 }]} onPress={() => { setVisible3(!visible3) }}>
              <View style={styles.table}>
                <Text style={[{ fontSize: 18, color: colors.text }]}>
                  Country
                        </Text>
                <Text style={[{ fontSize: 18, color: colors.text }]}>
                  {select3} {"  >"}
                </Text>
              </View>
            </Ripple>
            <SinglePickerMaterialDialog
              title={'Country '}
              items={map.map((row, index) => ({ value: index, label: row }))}
              visible={visible3}
              selectedItem={select3}
              colorAccent={'#fa50e2'}
              onCancel={() => setVisible3(false)}
              scrolled={true}
              onOk={result => {
                setVisible3(false);
                setSelect3(result.selectedItem.label);
              }}
            />
            <Ripple style={[styles.blck, { backgroundColor: colors.back2 }]} onPress={() => { navigation.navigate('ChangePassStackScreen') }}>
              <View style={styles.table}>
                <Text style={[{ fontSize: 18, color: colors.text }]}>
                  Change Password
                        </Text></View>

            </Ripple>

            <Text style={[styles.text_footer, {
              marginTop: 0, color: colors.text
            }]}>Logo</Text>
            <View style={{ width: width * 0.3, height: width * 0.3, backgroundColor: colors.back2, borderRadius: 20 }}>
              <Ripple onPress={() => { pickImage() }}>
                <Image
                  resizeMode='contain'
                  style={{ width: width * 0.3, height: width * 0.3 }}
                  source={{
                    uri: image,
                  }}
                />
              </Ripple>
            </View>
            {imagesloading
              ? <View style={{ flexDirection: "row", justifyContent: 'center' }}>
                <Text style={{ color: colors.text }}>
                  Uploading Image . . . .
                        </Text>
              </View> : null}
            <View style={styles.button}>

              <TouchableOpacity
                onPress={() => { console.log("CLICKED"); save() }} >
                <LinearGradient
                  colors={['#e774ed', '#eb38cd', '#e774ed']}
                  style={styles.signIn}
                  start={[-1, 0]}
                  end={[1, 0]}
                >

                  <Text style={[styles.textSign, { color: '#fffff0', fontWeight: "bold" }]}>
                    Save </Text>
                  {saving ? <ActivityIndicator style={{ marginLeft: "5%" }} size="small" color="#fffff0" /> : null}
                </LinearGradient>
              </TouchableOpacity>
            </View>

          </Animatable.View>
        </View> : <ActivityIndicator style={styles.loader} size="large" color="#d083fc" />}

      </ScrollView>
      <BottomNav name="Settings" color='#d083fc' navigation={navigation}></BottomNav>
    </View>
  )
}

const SettingsStackScreen = ({ navigation }) => {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#d083fc',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold'
      }
    }}>
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: ' Settings',
          headerLeft: () => (
            <FontAwesome.Button name="bars" size={25} backgroundColor="#d083fc" onPress={() => navigation.openDrawer()} />
          )
        }}
      />
    </Stack.Navigator>
  );
}
export default SettingsStackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,

  }, blck: {
    padding: "2%",
    marginTop: '1%',
    borderRadius: 20,
  }, table: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: "2%",
    marginRight: "2%", zIndex: 0,
  }, loader: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    marginTop: "50%",
  }, footer: {
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
    fontSize: 18,
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
  },
})