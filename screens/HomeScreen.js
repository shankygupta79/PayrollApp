import React from 'react';
import { View, Text, Button, StyleSheet, StatusBar } from 'react-native';
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
const HomeScreen = ({ navigation }) => {

  const { colors } = useTheme();

  const theme = useTheme();
  AsyncStorage.getItem('userToken', (err, result) => {
    console.log(result);
  });
  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
      <Text style={{ color: colors.text }}>Home Screen</Text>
      <Button
        title="Go to details screen"
        onPress={() => navigation.navigate("Details")}
      />
      <Button
        title="Go to details screen"
        onPress={() => AsyncStorage.getItem('userToken', (err, result) => {
          console.log(result);
        })}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
