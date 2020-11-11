import React from 'react';
import { View, Text, Button, StyleSheet, StatusBar } from 'react-native';
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from 'react-native-animatable';
import { ScrollView } from 'react-native-gesture-handler';
const HomeScreen = ({ navigation }) => {

  const { colors } = useTheme();
  const [data, setData] = React.useState({
    total: '',
    present: '',
    absent: '',
    dep: ''
  });
  React.useEffect(() => {
    var id = ''
    var adm = ''
    AsyncStorage.getItem('userToken', (err, result) => {
      id = result
      AsyncStorage.getItem('admin', (err, result) => {
        adm = result
        fetch('https://payrollv2.herokuapp.com/dashboard/api/dash?id=' + id + '=&platform=APP&admin=' + adm, {
          method: 'GET'
        })
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson);
            data.present = responseJson[2]
            data.absent = responseJson[3]
            data.dep = responseJson[1]
            data.total = responseJson[0]

          })
          .catch((error) => {
            console.error(error);
          });
      });
    });


  }, [navigation])

  const theme = useTheme();

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
      <View style={styles.row}>
        <View style={{ flex: 2, flexDirection: "row", justifyContent: 'space-between' }}>
          <View style={[{ borderColor: 'brown'},styles.circle]}>
          <Text style={[styles.xx,{fontSize:48}]}>{data.total}</Text>
          <Text style={styles.xx}>Total</Text>
          </View>
          <View style={[{ borderColor: 'yellow'},styles.circle]}>
          <Text style={[styles.xx,{fontSize:48}]}>{data.dep}</Text>
          <Text style={styles.xx}>Department </Text>
          </View>
        </View>
        <View style={{ flex: 2, flexDirection: "row", justifyContent: 'space-between' }}>
          <View style={[{ borderColor: 'green'},styles.circle]}>
          <Animatable.Text animation="pulse" easing="ease-out" iterationCount="infinite" style={[styles.xx,{fontSize:48}]}>{data.present}</Animatable.Text>
          
            <Text style={styles.xx}>Present</Text>
          </View>
          
          <View style={[{ borderColor: 'red'},styles.circle]}>
            
            <Animatable.Text animation="pulse" easing="ease-out" iterationCount="infinite" style={[styles.xx,{fontSize:48}]}>{data.absent}</Animatable.Text>
          <Text style={styles.xx}>Absent </Text>
          </View>

        </View>

        <View style={{ flex: 2, flexDirection: "row", justifyContent: 'space-between' }}>
          

        </View>


      </View>
      <Animatable.View
        animation="fadeInUpBig"
        style={[styles.footer, {
          backgroundColor: colors.background
        }]}
      >

      </Animatable.View>

    </View>
  );
};
class HomScreen extends React.Component {

}
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: "3%",
  },
  row: {
    flexDirection: 'column',
    flex: 1
  },
  circle: {
    width: "40%",
    borderRadius: 100,
    borderWidth: 5,
    margin: '5%',
    justifyContent:'center',
    fontWeight: 'bold',
    alignItems:'center',


  },xx:{
    fontWeight: 'bold',
    fontSize:20,
    justifyContent:'center',
  }
});
