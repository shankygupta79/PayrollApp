import React from 'react';
import { Alert, View, Text, Image, ScrollView, StyleSheet, Dimensions, RefreshControl, FlatList, TouchableHighlight } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ActivityIndicator, Avatar, } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { useTheme } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';
import Ripple from 'react-native-material-ripple';
import BottomNav from './BottomNav';
const { width, height } = Dimensions.get("screen");
const Stack = createStackNavigator();
var keys = ['admin', 'office_close', 'userToken', 'access', 'userToken2']
var myArray = []
var monthlist = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var arr = ['01-', '02-', '03-', '04-', '05-', '06-', '07-', '08-', '09-', '10-', '11-', '12-'];
var yearlist = []
var idx = []
var admin = "";
var off = "";
var id = "";
var access = "";
var id2 = "";
var adv = []
var adv1 = 0;
var adv2 = 0;
var apix = ""
var list = {
}


const AdvScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [loader, setLoader] = React.useState(false)
  const [ref, setRef] = React.useState(false)
  const [select1, setSelect1] = React.useState("")
  const [visible1, setVisible1] = React.useState(false)
  const [select2, setSelect2] = React.useState("")
  const [visible2, setVisible2] = React.useState(false)
  const [select3, setSelect3] = React.useState("")
  const [visible3, setVisible3] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [viewsat, setViewSat] = React.useState(false)
  const [data, setData] = React.useState(false)

  const onRefresh = () => {
    setRef(true);
    api1(apix);
    setTimeout(function () { setRef(false) }, 1500);

  }
  const year = () => {
    if (yearlist.length == 0) {
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
  }
  const api1 = async (api) => {
    try {
      const response = await fetch(api);
      const responseJson = await response.json();
      
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
  const view = async () => {
    setData(false)
    if (saving == true) {
      return
    }
    if (select1 == "") {
      Alert.alert('Select Employee!', 'Employee Name Field Cannot Be Empty.', [
        { text: 'Okay' }
      ]);
      setSaving(false)
      return;
    }
   adv1 = 0; adv2 = 0
    var z = '&id=' + encodeURIComponent(id) + '&platform=APP&admin=' + encodeURIComponent(admin) + '&id2=' + encodeURIComponent(id2) + "&off=" + encodeURIComponent(off) + "&access=" + encodeURIComponent(access);
    var ap2 = 'http://payrollv2.herokuapp.com/payslips/getadv?idx=' + idx[myArray.indexOf(select1)] + '&monthyear=' + (arr[monthlist.indexOf(select2)] + select3) + z
    try {



      const response2 = await fetch(ap2);
      adv = await response2.json();
      if(adv==false){
        Alert.alert('No Access!', 'Ask Admin to provide you the access of this page !.', [
          { text: 'Okay' }
        ]);
        setRef(false)
        setSaving(false)
        setLoader(true)
        return
    }
      adv.reverse();
      for (var i = 0; i < adv.length; i++) {
        if (adv[i].type == 0) {
          adv1 += adv[i].amount
        } else {
          adv2 += adv[i].amount
        }
      }
      setData(true)
    } catch (error) {
      console.error(error);
      Alert.alert('Some Error Occured!', 'Error is .' + error, [
        { text: 'Okay' }
      ]);
      setSaving(false)
      return await Promise.reject(false);
    }
    setSaving(false)
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
  }, [navigation, id])
  return (
    <View style={styles.container}>
      
      <ScrollView refreshControl={
        <RefreshControl
          refreshing={ref}
          onRefresh={onRefresh}
        />}>
        {loader ? <View>
          <Ripple style={[styles.blck, { backgroundColor: colors.back2 }]} onPress={() => { setVisible1(!visible1) }}>
            <View style={styles.table}>
              <Text style={[{ fontSize: 18, color: colors.text }]}>
                Employee
                        </Text>
              <Text style={[{ fontSize: 18, color: colors.text }]}>
                {select1} {"  >"}
              </Text>
            </View>
          </Ripple>
          <Ripple style={[styles.blck, { backgroundColor: colors.back2 }]} onPress={() => { setVisible2(!visible2) }}>
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
              onPress={() => { console.log("CLICKED"); setSaving(true); view() }} >
              <LinearGradient
                colors={['#fc03d3', '#fc03d3', '#215cdb']}
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
              if(result.selectedItem==undefined){
                return
            }
              setSelect1(result.selectedItem.label);
            }}
          />
          <SinglePickerMaterialDialog
            title={'Select Month'}
            items={monthlist.map((row, index) => ({ value: index, label: row }))}
            visible={visible2}
            selectedItem={select2}
            colorAccent={'#4d47f5'}
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
            colorAccent={'#4d47f5'}
            onCancel={() => setVisible3(false)}
            onOk={result => {
              
              setVisible3(false);
              if(result.selectedItem==undefined){
                return
            }
              setSelect3(result.selectedItem.label);
            }}
          />
          <View>
            <Text>

            </Text>
          </View>

          {data ? <View>
            



            
            <View style={styles.headig}>
              <Text style={[styles.headig2, { color: colors.text }]}>
                {select1}
              </Text>
            </View>
            <View style={styles.headig}>
              <Text style={[styles.headig2, { color: colors.text }]}>
                Total Advance is ₹  {adv1 - adv2}
              </Text>
            </View>
            <View style={[styles.blck, { backgroundColor: '#4d47f5' }]}>
              <View style={styles.table}>
                <Text style={[styles.text, { color: 'white' }]}>
                  Date
            </Text>
                <Text style={[styles.text, { color: 'white' }]}>
                  Given
            </Text >
                <Text style={[styles.text, { color: 'white' }]}>
                  Recieved
            </Text>
              </View>
            </View>
            {
              adv.map((item, key) => {
                return (
                  <View key={item.id}>

                    <Ripple style={[styles.blck, { backgroundColor: colors.back2 }]} onPress={() => { setViewSat(!viewsat) }}>
                      <View style={styles.table}>

                        <Text style={[styles.text, { color: colors.text }]}>
                          {item.date}
                        </Text>
                        {
                          item.type == 0 ?
                            <Text style={[styles.text, { color: colors.text }]}>
                              ₹ {item.amount}
                            </Text> : <Text style={[styles.text, { color: colors.text }]}></Text>
                        }
                        {
                          item.type == 1 ?
                            <Text style={[styles.text, { color: colors.text }]}>
                              ₹ {item.amount}
                            </Text> : <Text style={[styles.text, { color: colors.text }]}></Text>
                        }

                      </View>
                      {viewsat ? <Text style={{ paddingLeft: 10, color: colors.text }}>
                        {item.text}
                      </Text> : null}
                    </Ripple>

                  </View>
                )
              })
            }
            <View style={[styles.blck, { backgroundColor: colors.back2 }]}>
              <View style={styles.table}>
                <Text style={[styles.text, { color: colors.text, fontWeight: 'bold' }]}>
                  Total
            </Text>
                <Text style={[styles.text, { color: colors.text, fontWeight: 'bold' }]}>
                  ₹  {adv1}
                </Text >
                <Text style={[styles.text, { color: colors.text, fontWeight: 'bold' }]}>
                  ₹  {adv2}
                </Text>
              </View>
            </View>

            <View>
              <Text>

              </Text>
            </View>




          </View> : null}
          <View>
            <Text>

            </Text>
          </View>



        </View> : <ActivityIndicator style={styles.loader} size="large" color="#4d47f5" />}

      </ScrollView>

      <BottomNav name="" color='#4d47f5' navigation={navigation}></BottomNav>
    </View>
  )
}

const AdvStackScreen = ({ route, navigation }) => {
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
        name="View Advance"
        component={AdvScreen}
        options={{
          title: ' View Advance ',
          headerLeft: () => (
            <FontAwesome.Button name="bars" size={25} backgroundColor="#4d47f5" onPress={() => navigation.openDrawer()} />
          )
        }}
      />
    </Stack.Navigator>
  );
}
export default AdvStackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,

  }, loader: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    marginTop: "60%",
  }, table: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: "2%",
    marginRight: "2%", zIndex: 0,
  }, button: {
    alignItems: 'center',
    marginTop: 5
  }, signIn: {
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    flexDirection: 'row'
  }, blck: {
    padding: "2%",
    margin: '0.5%',
    borderRadius: 20,
  }, text: {
    width: width / 3,
    fontSize: 15
  }, text2: {
    width: width / 4,
    fontSize: 15
  }, text2: {
    width: width / 4,
    fontSize: 15,
    fontWeight: 'bold'
  }, headig: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  }, headig2: {
    fontWeight: 'bold',
    fontSize: 20,
  }, touchableOpacityStyle: {
    resizeMode: 'contain',
    padding: 10,
    height: 50,
    borderTopLeftRadius: 35,
    borderBottomEndRadius: 35,
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
    backgroundColor: 'coral',
    width: width / 2.5,
    right: 30,
    bottom: height * 0.1,
    position: 'absolute'

  },
  touchableOpacityStyle2: {
    padding: 10,
    borderTopLeftRadius: 35,
    borderBottomEndRadius: 35,
    alignItems: 'flex-start',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.19,
    shadowRadius: 4.65,
    zIndex: 7,

    elevation: 2,

    right: 30,
    bottom: height * 0.18,
    position: 'absolute'

  }, menu: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 10,
    width: width / 2.5,
    paddingTop: 5,
    borderBottomColor: 'white',

    borderBottomWidth: 1,
    borderRadius: 5,
  }
})