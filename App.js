import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme
} from 'react-native-paper';

import { DrawerContent } from './screens/DrawerContent';

import SettingsStackScreen from './screens/SettingsStackScreen';
import ChangePassStackScreen from './screens/ChangePassStackScreen';
import AttendanceStackScreen from './screens/AttendanceStackScreen';
import EmployeeStackScreen from './screens/EmployeeStackScreen';
import EditEmpStackScreen from './screens/EditEmpStackScreen';
import AddEmpStackScreen from './screens/AddEmpStackScreen';
import AddHolStackScreen from './screens/AddHolStackScreen';
import AddLoanStackScreen from './screens/AddLoanStackScreen';
import AddAdvStackScreen from './screens/AddAdvStackScreen';
import EditHolStackScreen from './screens/EditHolStackScreen';
import AddDepStackScreen from './screens/AddDepStackScreen';
import AddUserStackScreen from './screens/AddUserStackScreen';
import EditUserStackScreen from './screens/EditUserStackScreen';
import HolidayStackScreen from './screens/HolidayStackScreen';
import PayslipsStackScreen from './screens/PayslipsStackScreen';
import AttReportStackScreen from './screens/AttReportStackScreen';
import LoanStackScreen from './screens/LoanStackScreen';
import AdvStackScreen from './screens/AdvStackScreen';
import CalcStackScreen from './screens/CalcStackScreen';
import DepStackScreen from './screens/DepStackScreen';
import UsersStackScreen from './screens/UsersStackScreen';
import { AuthContext } from './components/context';
import RootStackScreen from './screens/RootStackScreen';
import AsyncStorage from '@react-native-community/async-storage';
import BottomNav from './screens/BottomNav.js'
import HomeStackScreen from './screens/HomeStackScreen';
import LedgerStackScreen from './screens/LedgerStackScreen';
const Drawer = createDrawerNavigator();
const mylink = {
  prefixes: ['https://payroll.com', 'payroll://'],
}
const App = () => {
  // const [isLoading, setIsLoading] = React.useState(true);
  // const [userToken, setUserToken] = React.useState(null); 

  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#333333',
      back2: "#edeef0",
    }
  }

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#333333',
      text: '#ffffff',
      back2: '#4d4c4c'
    }
  }

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };


  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async (foundUser) => {
      // setUserToken('fgkj');
      // setIsLoading(false);
      const userToken = String(foundUser[0].userToken);
      const userName = foundUser[0].username;

      try {
        console.log(foundUser[0])
        await AsyncStorage.setItem('userToken', userToken);
        if (foundUser[0].fullname != null) {
          await AsyncStorage.setItem('fullname', foundUser[0].fullname);
        }else{
          await AsyncStorage.setItem('fullname', "Undefined");
        }
        await AsyncStorage.setItem('access', foundUser[0].access);
        await AsyncStorage.setItem('currency', foundUser[0].currency);
        await AsyncStorage.setItem('office_close', foundUser[0].office_close);
        await AsyncStorage.setItem('logo', foundUser[0].logo)
        await AsyncStorage.setItem('admin', foundUser[0].admin);
        await AsyncStorage.setItem('userToken2', foundUser[0].userToken2);
      } catch (e) {
        console.log(e);
      }
      // console.log('user token: ', userToken);
      dispatch({ type: 'LOGIN', id: userName, token: userToken });
    },
    signOut: async () => {
      // setUserToken(null);
      // setIsLoading(false);
      try {
        await AsyncStorage.removeItem('userToken');
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'LOGOUT' });
    },
    signUp: () => {
      // setUserToken('fgkj');
      // setIsLoading(false);
    },

    toggleTheme: () => {
      setIsDarkTheme(isDarkTheme => !isDarkTheme);
    }
  }), []);

  useEffect(() => {
    setTimeout(async () => {
      // setIsLoading(false);
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.log(e);
      }
      // console.log('user token: ', userToken);
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
    }, 1000);
  }, []);

  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <PaperProvider theme={theme}>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer theme={theme} linking={mylink}>
          {loginState.userToken !== null ? (
            <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
              <Drawer.Screen name="HomeStackScreen" component={HomeStackScreen} />
              <Drawer.Screen name="ChangePassStackScreen" component={ChangePassStackScreen} />
              <Drawer.Screen name="SettingsStackScreen" component={SettingsStackScreen} />
              <Drawer.Screen name="EmployeeStackScreen" component={EmployeeStackScreen} />
              <Drawer.Screen name="AttendanceStackScreen" component={AttendanceStackScreen} />
              <Drawer.Screen name="EditEmpStackScreen" component={EditEmpStackScreen} />
              <Drawer.Screen name="LoanStackScreen" component={LoanStackScreen} />
              <Drawer.Screen name="AdvStackScreen" component={AdvStackScreen} />
              <Drawer.Screen name="AddEmpStackScreen" component={AddEmpStackScreen} />
              <Drawer.Screen name="AddHolStackScreen" component={AddHolStackScreen} />
              <Drawer.Screen name="AddAdvStackScreen" component={AddAdvStackScreen} />
              <Drawer.Screen name="AddLoanStackScreen" component={AddLoanStackScreen} />
              <Drawer.Screen name="EditHolStackScreen" component={EditHolStackScreen} />
              <Drawer.Screen name="AddUserStackScreen" component={AddUserStackScreen} />
              <Drawer.Screen name="CalcStackScreen" component={CalcStackScreen} />
              <Drawer.Screen name="PayslipsStackScreen" component={PayslipsStackScreen} />
              <Drawer.Screen name="AttReportStackScreen" component={AttReportStackScreen} />
              <Drawer.Screen name="EditUserStackScreen" component={EditUserStackScreen} />
              <Drawer.Screen name="HolidayStackScreen" component={HolidayStackScreen} />
              <Drawer.Screen name="AddDepStackScreen" component={AddDepStackScreen} />
              <Drawer.Screen name="DepStackScreen" component={DepStackScreen} />
              <Drawer.Screen name="UsersStackScreen" component={UsersStackScreen} />
              <Drawer.Screen name="LedgerStackScreen" component={LedgerStackScreen} />
              <Drawer.Screen name="BottomNav" component={BottomNav} />
            </Drawer.Navigator>
          )
            :
            <RootStackScreen />
          }
        </NavigationContainer>
      </AuthContext.Provider>
    </PaperProvider>
  );
}

export default App;

