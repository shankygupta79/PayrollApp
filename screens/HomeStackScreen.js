import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Animatable from 'react-native-animatable';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BottomNav from './BottomNav.js';
const { width, height } = Dimensions.get("screen");
var keys = ['admin', 'office_close', 'userToken', 'access', 'userToken2']
const Stack = createStackNavigator();
const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [loader, setLoader] = React.useState(false)
  const [change, setChange] = React.useState(0)
  const [data, setData] = React.useState({
    total: '0',
    present: '0',
    absent: '0',
    dep: '0',
  });
  const [ref, setRef] = React.useState(false)
  const onRefresh = () => {
    setRef(true);
    setChange(change + 1)
    setTimeout(function () { setRef(false) }, 1500);

  }
  React.useEffect(() => {
    var id = '';
    var adm = '';
    console.log(width, height)
    AsyncStorage.multiGet(keys, async (err, stores) => {
      setLoader(false)
      var admin = stores[0][1];
      var off = stores[1][1];
      var id = stores[2][1];
      var access = stores[3][1];
      var id2 = stores[4][1];
      var z = '?id=' + encodeURIComponent(id) + '&platform=APP&admin=' + encodeURIComponent(admin) + '&id2=' + encodeURIComponent(id2) + "&off=" + encodeURIComponent(off) + "&access=" + encodeURIComponent(access);

      setLoader(false)
      var api = 'https://payrollv2.herokuapp.com/dashboard/api/dash' + z
      console.log(api)
      fetch(api)
        .then((response) => response.json())
        .then((responseJson) => {
          setData({
            present: responseJson[2],
            absent: responseJson[3],
            dep: responseJson[1],
            total: responseJson[0]
          })
          setLoader(true)
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }, [navigation, change]);


  return (
    <View style={styles.container}>
      <ScrollView refreshControl={
        <RefreshControl
          refreshing={ref}
          onRefresh={onRefresh}
        />}
      >
        {loader ?
          <View style={styles.container}>


            <View style={styles.row}>
              <View
                style={{
                  flex: 2,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <AnimatedCircularProgress
                    size={0.9 * width / 2}
                    width={10}
                    fill={90}
                    padding={20}
                    tintColor="#00e0ff"
                    backgroundColor="#3d5875">
                    {(fill) => <View>
                      <Text style={[styles.xx, { fontSize: 24, color: colors.text }]}>{data.total}</Text>
                      <Text style={[styles.xx, { color: colors.text }]}>Employees </Text>
                    </View>}
                  </AnimatedCircularProgress>
                </View>
                <View>
                  <AnimatedCircularProgress
                    size={0.9 * width / 2}
                    width={10}
                    fill={90.0}
                    padding={20}
                    tintColor="#fcb612"
                    backgroundColor="#d4990f">
                    {(fill) => <View>
                      <Text style={[styles.xx, { fontSize: 24, color: colors.text }]}>{data.dep}</Text>
                      <Text style={[styles.xx, { color: colors.text }]}>Departments </Text>
                    </View>}
                  </AnimatedCircularProgress>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <AnimatedCircularProgress
                  size={0.9 * width / 2}
                  width={10}
                  fill={90}
                  padding={20}
                  tintColor="#12b007"
                  backgroundColor="#064a01">
                  {(fill) => <View>
                    <Text style={[styles.xx, { fontSize: 24, color: colors.text }]}>{data.present}</Text>
                    <Text style={[styles.xx, { color: colors.text }]}>Present </Text>
                  </View>}
                </AnimatedCircularProgress>
                <AnimatedCircularProgress
                  size={0.9 * width / 2}
                  width={10}
                  fill={90}
                  padding={20}
                  tintColor="#fa1414"
                  backgroundColor="#730101">
                  {(fill) => (
                    <View>
                      <Text style={[styles.xx, { fontSize: 24, color: colors.text }]}>{data.absent}</Text>
                      <Text style={[styles.xx, { color: colors.text }]}>Absents </Text>
                    </View>
                  )}
                </AnimatedCircularProgress>
              </View>

              <View
                style={{
                  flex: 2,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}></View>
            </View>
            <Animatable.View
              animation="fadeInUpBig"
              style={[
                styles.footer,
                {
                  backgroundColor: colors.background,
                },
              ]}></Animatable.View>
          </View> : <ActivityIndicator style={styles.loader} size="large" color="purple" />}

      </ScrollView>
      <BottomNav name="Home" color='red' navigation={navigation}></BottomNav>
    </View>

  );
};
const HomeStackScreen = ({ navigation }) => {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: 'red',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold'
      },
      footer: {

      }
    }}>
      <Stack.Screen
        name="Dashboard"
        component={HomeScreen}
        options={{
          title: 'Dashboard',
          headerLeft: () => (
            <FontAwesome.Button name="bars" size={25} backgroundColor="red" onPress={() => navigation.openDrawer()} />
          ),
          footer: { BottomNav }
        }}
      />
    </Stack.Navigator>
  );
}
export default HomeStackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'column',
    flex: 1,
  },
  xx: {
    fontWeight: 'bold',
    fontSize: 12,
    justifyContent: 'center',
  }, loader: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 50,
    marginTop: "50%",
  }
});
