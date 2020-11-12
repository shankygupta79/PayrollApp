import React from 'react';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import HomeScreen from './HomeScreen';
import DetailsScreen from './DetailsScreen';
import ExploreScreen from './ExploreScreen';
import ProfileScreen from './ProfileScreen';

const HomeStack = createStackNavigator();
const DetailsStack = createStackNavigator();

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
      component={DetailsStackScreen}
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
      component={ProfileScreen}
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

const DetailsStackScreen = ({ navigation }) => (
  <DetailsStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: '#47c72a',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }}>
    <DetailsStack.Screen name="Daily Attendance" component={DetailsScreen} options={{
      headerLeft: () => (
        <Icon.Button name="ios-menu" size={25} backgroundColor="#47c72a" onPress={() => navigation.openDrawer()}></Icon.Button>
      )
    }} />
  </DetailsStack.Navigator>
);
