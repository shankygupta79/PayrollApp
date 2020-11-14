import React from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, Overlay } from 'react-native-elements';
const EmployeeScreen = () => {
  const [visible, setVisible] = useState(false);

  const [loader, setLoader] = React.useState(false)
  const toggleOverlay = () => {
    setVisible(!visible);
  };
  return (

    <View style={styles.container}>
      {loader ? <View>
        <Text>Employee Screen</Text>
        <Button
          title="Click Here"
          onPress={() => alert('Button Clicked!')}
        />
        <Button title="Open Overlay" onPress={toggleOverlay} />

        <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
          <Text>Hello from Overlay!</Text>
        </Overlay>
      </View> 
      : 
      <ActivityIndicator style={styles.loader} size="large" color="green" />}
    </View >
  );
};

const EmployeeStackScreen = ({ navigation }) => {
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
        name="Employees"
        component={AttendanceScreen}
        options={{
          title: 'All Employees',
          headerLeft: () => (
            <FontAwesome.Button name="bars" size={25} backgroundColor="#47c72a" onPress={() => navigation.openDrawer()} />
          )
        }}
      />
    </Stack.Navigator>
  );
}
export default EmployeeStackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }, loader: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    marginTop: "50%",
  }
});
