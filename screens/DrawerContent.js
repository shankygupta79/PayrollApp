import React from 'react';
import { View, StyleSheet,Image } from 'react-native';
import {
    useTheme,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch,
} from 'react-native-paper';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { AuthContext } from '../components/context';
import AsyncStorage from '@react-native-community/async-storage';
export function DrawerContent(props) {
    const paperTheme = useTheme();
    const [logo, setLogo] = React.useState("https://res.cloudinary.com/shankygupta79/image/upload/v1592489600/love_bird_transparent_bg_dlwkpq.png");
    const [fullname, setFullname] = React.useState("User name");
    React.useEffect(() => {
        AsyncStorage.getItem('logo', (err, result) => {
            setLogo(result);
            console.log(result)
        });
        AsyncStorage.getItem('fullname', (err, result) => {
            
            setFullname(result);
        });
    });
    const { signOut, toggleTheme } = React.useContext(AuthContext);

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                            <Image
                                source={{
                                    uri: logo
                                }}
                                style={
                                    styles.image
                                }
                            />
                            <View style={{ marginLeft: 12, flexDirection: 'column' }}>
                            <Title style={styles.title} numberOfLines={2}>{fullname}</Title>
                                <Caption style={styles.caption}>Welcome</Caption>
                            </View>
                        </View>

                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem
                            icon={({ color, size }) => (
                                <FontAwesome
                                    name="home"
                                    color="#7b79fc"
                                    size={size}
                                />
                            )}
                            label="Home"
                            onPress={() => {
                                props.navigation.navigate('Home');
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <FontAwesome
                                    name="users"
                                    color="green"
                                    size={size}
                                />
                            )}
                            label="Employees"
                            onPress={() => {
                                props.navigation.navigate('EmployeeStackScreen');
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <FontAwesome
                                    name="calendar-check-o"
                                    color="lightgreen"
                                    size={size}
                                />
                            )}
                            label="Attendance"
                            onPress={() => {
                                props.navigation.navigate('AttendanceStackScreen');
                            }}
                        />
                        
                        <DrawerItem
                            icon={({ color, size }) => (
                                <FontAwesome
                                    name="book"
                                    color="#1cffd2"
                                    size={size}
                                />
                            )}
                            label="Salary Ledger"
                            onPress={() => {
                                props.navigation.navigate('SupportScreen');
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <FontAwesome
                                    name="credit-card"
                                    color="red"
                                    size={size}
                                />
                            )}
                            label="Loans & Advance"
                            onPress={() => {
                                props.navigation.navigate('SupportScreen');
                            }}
                        />
                        
                        <DrawerItem
                            icon={({ color, size }) => (
                                <FontAwesome
                                    name="plane"
                                    color="orange"
                                    size={size}
                                />
                            )}
                            label="Holidays"
                            onPress={() => {
                                props.navigation.navigate('SupportScreen');
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <FontAwesome
                                    name="fort-awesome"
                                    color="#e6d737"
                                    size={size}
                                />
                            )}
                            label="Departments"
                            onPress={() => {
                                props.navigation.navigate('SettingsScreen');
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <FontAwesome
                                    name="user-plus"
                                    color="pink"
                                    size={size}
                                />
                            )}
                            label="Users"
                            onPress={() => {
                                props.navigation.navigate('SupportScreen');
                            }}
                        />
                    </Drawer.Section>
                    <Drawer.Section title="Preferences">
                        <TouchableRipple
                            onPress={() => {
                                toggleTheme();
                            }}>
                            <View style={styles.preference}>
                                <Text>Dark Theme</Text>
                                <View pointerEvents="none">
                                    <Switch value={paperTheme.dark} />
                                </View>
                            </View>
                        </TouchableRipple>
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                    icon={({ color, size }) => (
                        <FontAwesome
                                    name="sign-out"
                                    color={color}
                                    size={size}
                                />
                    )}
                    label="Sign Out"
                    onPress={() => {
                        signOut();
                    }}
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    image:{
        width:"30%"
    },
    userInfoSection: {
        paddingLeft: 10,
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        flex: 0.8,
        fontWeight: 'bold',
        flexWrap: 'wrap'
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1,
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});
