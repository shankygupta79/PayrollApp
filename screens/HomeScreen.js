import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  StatusBar,
  ScrollView,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Animatable from 'react-native-animatable';

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [loader, setLoader] = React.useState(false)
  const [data, setData] = React.useState({
    total: '0',
    present: '0',
    absent: '0',
    dep: '0',
  });
  const[ref,setRef]=React.useState(false)
  const onRefresh = () => {
    setRef(true);
    setTimeout(function(){ setRef(false) }, 1500);
    
  }
  React.useEffect(() => {
    var id = '';
    var adm = '';
    AsyncStorage.getItem('userToken', (err, result) => {
      id = result;
      AsyncStorage.getItem('admin', (err, result) => {
        adm = result;
        setLoader(false)
        api='https://payrollv2.herokuapp.com/dashboard/api/dash?id=' +encodeURIComponent(id) +'&platform=APP&admin=' +encodeURIComponent(adm);
        console.log(api)
        fetch(api)
          .then((response) => response.json())
          .then((responseJson) => {
            setData({
              present : responseJson[2],
              absent : responseJson[3],
              dep : responseJson[1],
              total : responseJson[0]
            })
            setLoader(true)
          })
          .catch((error) => {
            console.error(error);
          });
      });
    });
  }, [navigation]);

  const theme = useTheme();

  return (
    <ScrollView refreshControl={
          <RefreshControl
            refreshing={ref}
            onRefresh={onRefresh}
          />}
        >
          {loader?
    <View style={styles.container}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      <View style={styles.row}>
        <View
          style={{
            flex: 2,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View>
            <AnimatedCircularProgress
              size={180}
              width={10}
              fill={90}
              padding={20}
              tintColor="#00e0ff"
              backgroundColor="#3d5875">
              {(fill) => <View>
                <Text style={[styles.xx, { fontSize: 24,color:colors.text  }]}>{data.total}</Text>
                <Text style={[styles.xx, { color:colors.text  }]}>Employees </Text>
              </View>}
            </AnimatedCircularProgress>
          </View>
          <View>
            <AnimatedCircularProgress
              size={180}
              width={10}
              fill={99.9}
              padding={20}
              tintColor="#fcb612"
              backgroundColor="#fced12">
              {(fill) => <View>
                <Text style={[styles.xx, { fontSize: 24,color:colors.text }]}>{data.dep}</Text>
                <Text style={[styles.xx, { color:colors.text  }]}>Departments </Text>
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
            size={180}
            width={10}
            fill={90}
            padding={20}
            tintColor="#12b007"
            backgroundColor="#064a01">
            {(fill) => <View>
                <Text style={[styles.xx, { fontSize: 24,color:colors.text }]}>{data.present}</Text>
                <Text style={[styles.xx, { color:colors.text  }]}>Present </Text>
              </View>}
          </AnimatedCircularProgress>
          <AnimatedCircularProgress
            size={180}
            width={10}
            fill={90}
            padding={20}
            tintColor="#fa1414"
            backgroundColor="#730101">
            {(fill) => (
              <View>
                <Text style={[styles.xx, { fontSize: 24 ,color:colors.text }]}>{data.absent}</Text>
                <Text style={[styles.xx, { color:colors.text  }]}>Absents </Text>
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
    </View>:<ActivityIndicator style={styles.loader}size="large" color="purple"/>}
    </ScrollView>
  );
};
class HomScreen extends React.Component {}
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: '3%',
  },
  row: {
    flexDirection: 'column',
    flex: 1,
  },
  xx: {
    fontWeight: 'bold',
    fontSize: 12,
    justifyContent: 'center',
  },loader:{
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 50,
    marginTop:"50%",
  }
});
