import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import axios from "axios";

const TaskScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [estimatedTime, setEstimatedTime] = useState(0.0);
  const [dueDate, setDueDate] = useState("")


  const TaskSubmit = async () => {
    if (!username || !password) {
      setError("*Username or Password can not be empty");
      return;
    }
    const response = await axios.get(`https://capstonebackend-ibrahimsemary.vercel.app/Task-validation?user_email=${username}&user_password=${password}`);
    if(response.data.success){
      navigation.navigate("Home")
    }
    else{
      setError("*Incorrect username or password")
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
          <Text
            style={{
              marginLeft: "17.5%",
              fontSize: 12,
              marginTop: "2%",
            }}
          >
            <Text>Don't have an account? </Text>
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
          <TouchableOpacity onPress={TaskSubmit} style={styles.button}>
            <Text style={{ color: "white", alignSelf: "center" }}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginTop: "3%",
    marginBottom: "5%",
    alignSelf: "center",
  },
  button: {
    width: "45%",
    borderRadius: 24,
    backgroundColor: "black",
    alignSelf: "center",
    color: "white",
    padding: 8,
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

export default TaskScreen;
