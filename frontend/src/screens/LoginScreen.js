import React, { useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity, Button } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import user from "../api/user";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    // send to backend
    try {
      const response = await user.get("/login");
      navigation.navigate("Home");
    } catch (err) {
      setError(err)
    }
  };

  return (
    <View>
      <Text style={styles.title}>Carpe DM</Text>
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        value={username}
        onChangeText={(newValue) => setUsername(newValue)}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        secureTextEntry={true}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        value={password}
        onChangeText={(newValue) => setPassword(newValue)}
      />
      <Text style={styles.label}>
        <Text>Don't have an account?{"     "}</Text>
        <Text
          style={{ fontSize: 12, color: "blue" }}
          onPress={() => {
            navigation.navigate("SignUp");
          }}
        >
          Sign up
        </Text>
      </Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity onPress={login}>Sign In</TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    alignSelf: "center",
    marginTop: "20%",
  },
  label: {
    fontSize: 12,
    marginTop: "10%",
    marginLeft: "17.5%",
  },
  error: {
    fontSize: 12,
    color: "red",
    marginTop: "7.5%",
    alignSelf: "center",
  },
  button: {
    marginTop: "7%",
    width: "55%",
    borderRadius: 20,
    backgroundColor: "black",
    color: "white",
  },
  input: {
    padding: 2.5,
    fontSize: 16,
    borderRadius: 12,
    borderWidth: 3,
    width: "65%",
    marginTop: "2%",
    alignSelf: "center",
  },
});

export default LoginScreen;
