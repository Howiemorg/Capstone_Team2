import React from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";

const LoginScreen = (props) => {
  return (<View>
    Don't have an account? <TouchableOpacity onPress={() => {props.navigation.navigate('SignUp')}}>Sign up</TouchableOpacity>
  </View>);
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
  },
});

export default LoginScreen;
