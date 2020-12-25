import React from 'react';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import HomeScreen from './HomeStackScreen';
import AttendanceScreen from './AttendanceStackScreen';
import ExploreScreen from './ExploreScreen';
import EmployeeScreen from './EmployeeStackScreen';

const HomeStack = createStackNavigator();

const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => (
  <Tab.Navigator
    initialRouteName="Home"
    activeColor="#fff"
  >
    <Tab.Screen
      name="Home"
      component={HomeStackScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarColor: '#7b79fc',
        tabBarIcon: ({ color }) => (
          <FontAwesome
            name="home"
            color={color}
            size={22}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Daily Attendance"
      component={AttendanceScreen}
      options={{
        tabBarLabel: 'Attendance',
        tabBarColor: '#47c72a',
        tabBarIcon: ({ color }) => (
          <FontAwesome
          name="calendar-check-o"
          color={color}
          size={22}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Employees"
      component={EmployeeScreen}
      options={{
        tabBarLabel: 'Employees',
        tabBarColor: 'green',
        tabBarIcon: ({ color }) => (
          <FontAwesome name="users"
          color={color}
          size={22} />
        ),
      }}
    />
    <Tab.Screen
      name="Settings"
      component={ExploreScreen}
      options={{
        tabBarLabel: 'Settings',
        tabBarColor: 'red',
        tabBarIcon: ({ color }) => (
          <FontAwesome name="cogs"
          color={color}
          size={22} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default MainTabScreen;

const HomeStackScreen = ({ navigation }) => (
  <HomeStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: '#7b79fc',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }}>
    <HomeStack.Screen name="Home" component={HomeScreen} options={{
      title: 'Dashboard',
      headerLeft: () => (
        <Icon.Button name="ios-menu" size={25} backgroundColor="#7b79fc" onPress={() => navigation.openDrawer()}></Icon.Button>
      )
    }} />
  </HomeStack.Navigator>
);


