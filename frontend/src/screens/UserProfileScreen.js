import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Button, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import vercel from "../api/vercel";
import { LineChart } from 'react-native-chart-kit';
import { logout } from '../store/Users/user-actions';

const UserProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
  
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
        } catch (error) {
            Alert.alert('Error', 'Could not fetch user data.');
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
            <Text style={styles.time}>Wake Time: {user[0].wake_time}</Text>
            <Text style={styles.time}>Sleep Time: {user[0].sleep_time}</Text>

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
                // yAxisLabel="Val: "
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    time: {
        fontSize: 16,
        marginVertical: 5,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default UserProfileScreen;