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
  
    if (!user) {
      return <View style={styles.container}><Text>Loading...</Text></View>;
    }
  
    return (
      <View style={styles.container}>
        <Text style={styles.name}>{user.user_first_name} {user.user_last_name}</Text>
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
  });
  
  export default UserProfileScreen;