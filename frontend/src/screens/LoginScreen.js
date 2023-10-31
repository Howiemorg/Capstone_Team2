import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../store/Users/user-actions";
import { userActions } from "../store/Users/user-slice";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const { error : userError, loading, userID } = useSelector((state) => state.user);

  const loginSubmit = async () => {
    if (!username || !password) {
      setError("*Username or Password can not be empty");
      return;
    }
    dispatch(login(username, password));
  };

  useEffect(() => {
    if (userID) {
      navigation.navigate("Home");
      dispatch(userActions.userReset());
    } 
    setError("");
  }, [userID, username, password]);

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
          {userError && <Text style={styles.error}>{userError}</Text>}
          <TouchableOpacity onPress={loginSubmit} style={styles.button}>
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
    marginTop: "10%",
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

export default LoginScreen;
