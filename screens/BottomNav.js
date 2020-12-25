import React from 'react';
import {StatusBar, View, Text, StyleSheet, Dimensions, } from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Ripple from 'react-native-material-ripple';


const BottomNav = (props) => {
    const [val, setVal] = React.useState("Home")
    const [colorval, setColorVal] = React.useState('red')
    React.useEffect(() => {
        if (props.name != undefined) {
            setVal(props.name)
            setColorVal(props.color)
            console.log(props.val,props.color)
        }
        

    }, [val,colorval])
    return (
        <View>
            <StatusBar backgroundColor={'black'} barStyle='light-content' />
            <View style={{height:60,backgroundColor: 'rgba(52, 52, 52, alpha)'}}></View>
        <View style={styles.container} >
            
            <Ripple style={[styles.single,{backgroundColor:colorval}]} rippleColor="rgb(255,255,255)" rippleOpacity={0.7} onPress={() => { props.navigation.navigate('HomeStackScreen'); setVal("Home");setColorVal('red') }}>

                <FontAwesome name="home" size={'Home' === val ? 20 : 24} color={'Home' === val ? "#ffff" : "#c9c9c7"} />
                {val == 'Home' ? <Text style={styles.text}>Home</Text> : null}
                {val == "" ? <Text style={styles.text}></Text> : null}

            </Ripple>
            <Ripple style={[styles.single,{backgroundColor:colorval}]} rippleColor="rgb(255,255,255)" rippleOpacity={0.7} onPress={() => { props.navigation.navigate('AttendanceStackScreen'); setVal("Attendance");setColorVal('#47c72a') }}>
                <FontAwesome name="calendar-check-o" size={'Attendance' === val ? 20 : 25} color={'Attendance' === val ? "#ffff" : "#c9c9c7"} />
                {val == 'Attendance' ? <Text style={styles.text}>Attendance</Text> : null}
            </Ripple>
            <Ripple style={[styles.single,{backgroundColor:colorval}]} rippleColor="rgb(255,255,255)" rippleOpacity={0.7} onPress={() => { props.navigation.navigate('EmployeeStackScreen'), setVal("Employee");setColorVal('green') }}>
                <FontAwesome name="users" size={'Employee' === val ? 20 : 25} color={'Employee' === val ? "#ffff" : "#c9c9c7"} />
                {val == 'Employee' ? <Text style={styles.text}>Employee</Text> : null}
            </Ripple>
            <Ripple style={[styles.single,{backgroundColor:colorval}]} rippleColor="rgb(255,255,255)" rippleOpacity={0.7} onPress={() =>{ props.navigation.navigate('ChangePassStackScreen'), setVal("Settings");setColorVal('#d083fc')}}>
                <FontAwesome name="cogs" size={'Settings' === val ? 20 : 25} color={'Settings' === val ? "#ffff" : "#c9c9c7"} />
                {val == 'Settings' ? <Text style={styles.text}>Settings</Text> : null}
            </Ripple>
        </View>
        </View>
    )
}


export default BottomNav;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        position: 'absolute',
        bottom: 0,
    },
    single: {
        width: "25%",
        alignItems: 'center',
        paddingTop: '3%',
        paddingBottom: '0.5%'

    }, text: {
        fontSize: 12,
        color: 'white',
    },
})