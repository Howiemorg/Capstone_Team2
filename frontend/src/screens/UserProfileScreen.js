import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useSelector } from 'react-redux'; 
import vercel from "../api/vercel";

const UserProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
  
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const userId = useSelector(state => state.auth.userId);
  
    useEffect(() => {
      if (!isAuthenticated) {
        navigation.navigate('LoginScreen');
      } else {
        fetchUserData();
      }
    }, [isAuthenticated, userId]);
  
    const fetchUserData = async () => {
      try {
        const response = await vercel.get(`/api/user/${userId}`);
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
        <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
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