import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useSelector } from 'react-redux'; 
import vercel from "../api/vercel";

console.log("Hello")

const UserProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
  
    const { userID } = useSelector(state => state.user);

    useEffect(() => {
      if (!userID) {
        navigation.navigate('LoginScreen');
      } else {
        fetchUserData();
      }
    }, [userID]);
  
    const fetchUserData = async () => {
      try {
        const response = await vercel.get(`/get-user-info?user_id=${userID}`);
        console.log(response.data)
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Could not fetch user data.');
      }
    };
    console.log(user)
    if (!user) {
      return <View style={styles.container}><Text>Loading...</Text></View>;
    }
  
    return (
      <View style={styles.container}>
        <Text style={styles.name}>First Name:{user[0].user_first_name}</Text>
        <Text style={styles.name}>Last Name: {user[0].user_last_name}</Text>
        <Text style={styles.time}>Wake Time: {user[0].wake_time}</Text>
        <Text style={styles.time}>Sleep Time: {user[0].sleep_time}</Text>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    name: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    time: {
      fontSize: 16,
      marginVertical: 5,
    },
  });
  
  export default UserProfileScreen;