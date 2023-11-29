import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Button, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import vercel from "../api/vercel";
import DateTimePicker from '@react-native-community/datetimepicker';
import { LineChart } from 'react-native-chart-kit';
import { logout } from '../store/Users/user-actions';
import moment from 'moment-timezone';

const UserProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [sleepTime, setSleepTime] = useState(new Date());
    const [wakeTime, setWakeTime] = useState(new Date());
    const [showSleepPicker, setShowSleepPicker] = useState(false);
    const [showWakePicker, setShowWakePicker] = useState(false);

    const { userID } = useSelector(state => state.user);

    useEffect(() => {
        if (!userID) {
            navigation.navigate('Login');
        } else {
            fetchUserData();
        }
    }, [userID]);

    const fetchUserData = async () => {
        try {
            const response = await vercel.get(`/get-user-info?user_id=${userID}`);
            setUser(response.data);
            
            const sleepDate = new Date();
            sleepDate.setHours(response.data[0].sleep_time.split(':')[0]);
            sleepDate.setMinutes(response.data[0].sleep_time.split(':')[1]);
            setSleepTime(sleepDate);

            const wakeDate = new Date();
            wakeDate.setHours(response.data[0].wake_time.split(':')[0]);
            wakeDate.setMinutes(response.data[0].wake_time.split(':')[1]);
            setWakeTime(wakeDate);
        } catch (error) {
            Alert.alert('Error', 'Could not fetch user data.');
        }
    };
    

    const onChangeSleepTime = (event, selectedDate) => {
        const currentDate = selectedDate || sleepTime;
        setSleepTime(currentDate); 
    };

    const onConfirmSleepTime = async () => {
        setShowSleepPicker(false); 
        let modifiedSleepTime = new Date(sleepTime);
        modifiedSleepTime.setMilliseconds(modifiedSleepTime.getMilliseconds() - 6 * 60 * 60 * 1000);
        const formattedSleepTime = modifiedSleepTime.toISOString().split('T')[1].substr(0, 8);
    
        try {
            await vercel.post(`/update-user-sleep-time`, {
                user_id: userID,
                sleep_time: formattedSleepTime
            });
            Alert.alert('Success', 'Sleep time updated successfully.');
            fetchUserData(); 
        } catch (error) {
            Alert.alert('Error', 'Could not update sleep time.');
        }
    };


    

    const onChangeWakeTime = (event, selectedDate) => {
        const currentDate = selectedDate || wakeTime;
        setWakeTime(currentDate); 
    };

    const onConfirmWakeTime = async () => {
        setShowWakePicker(false); 
        let modifiedWakeTime = new Date(wakeTime);
        modifiedWakeTime.setMilliseconds(modifiedWakeTime.getMilliseconds() - 6 * 60 * 60 * 1000);
        const formattedWakeTime = modifiedWakeTime.toISOString().split('T')[1].substr(0, 8);
    
        try {
            await vercel.post(`/update-user-wake-time`, {
                user_id: userID,
                wake_time: formattedWakeTime
            });
            Alert.alert('Success', 'Wake time updated successfully.');
            fetchUserData(); 
        } catch (error) {
            Alert.alert('Error', 'Could not update wake time.');
        }
    };

    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    if (!user) {
        return <View style={styles.container}><Text>Loading...</Text></View>;
    }

    const screenWidth = Dimensions.get('window').width;

    const numericCircadianData = user[0].circadian_rhythm.map(value => parseFloat(value));

    const labels = Array.from({ length: 48 }, (_, index) => {
        if (index % 6 === 0) { 
            const hour = Math.floor(index / 2);
            const minute = index % 2 === 0 ? '00' : '30';
            return `${hour}:${minute}`;
        }
        return ''; 
    });

    return (
        <View style={styles.container}>
            <Text style={styles.name}>First Name: {user[0].user_first_name}</Text>
            <Text style={styles.name}>Last Name: {user[0].user_last_name}</Text>
            <Text style={styles.time}>Current Wake Time: {user[0].wake_time}</Text>
            <Text style={styles.time}>Current Sleep Time: {user[0].sleep_time}</Text>

            <Button onPress={() => setShowWakePicker(true)} title="Change Wake Time" />
            {showWakePicker && (
                <>
                    <DateTimePicker
                        value={wakeTime}
                        mode="time"
                        is24Hour={false}
                        display="default"
                        onChange={onChangeWakeTime}
                        minuteInterval={30}
                    />
                    <Button title="Done" onPress={onConfirmWakeTime} />
                </>
            )}

            <Button onPress={() => setShowSleepPicker(true)} title="Change Sleep Time" />
            {showSleepPicker && (
                <>
                    <DateTimePicker
                        value={sleepTime}
                        mode="time"
                        is24Hour={false}
                        display="default"
                        onChange={onChangeSleepTime}
                        minuteInterval={30}
                    />
                    <Button title="Done" onPress={onConfirmSleepTime} />
                </>
            )}

            <Text style={styles.chartTitle}>{`Your Circadian Rhythm Graph`}</Text>
            <LineChart
                data={{
                    labels: labels,
                    datasets: [{
                        data: numericCircadianData
                    }]
                }}
                width={screenWidth}
                height={220}
                chartConfig={{
                    backgroundColor: '#e26a00',
                    backgroundGradientFrom: '#fb8c00',
                    backgroundGradientTo: '#ffa726',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                    propsForDots: {
                        r: '6',
                        strokeWidth: '2',
                        stroke: '#ffa726'
                    },
                    padding: 16,
                    marginLeft: 16,
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
                formatYLabel={(y) => {
                    return (typeof y === 'number') ? y.toFixed(2) : y;
                }}
                withDots
                withHorizontalLabels
                withVerticalLabels
                withInteractiveXLabels
            />

            <Button
                title="Logout"
                onPress={handleLogout}
                color="#841584"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        paddingHorizontal: 20,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    time: {
        fontSize: 16,
        marginVertical: 5,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 40,
    },
});

export default UserProfileScreen;