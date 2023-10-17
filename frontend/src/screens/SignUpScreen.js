import { React, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
} from "react-native";
import styles from "./styles";

const SignUpScreen = ({ navigation }) => {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [error, setError] = useState("");
    const SignUp = async () => {
        // check if all the fields are filled & if passwords match
        if (!firstname || !lastname || !username || !password || !password2) {
            setError("*Fill in all required fields");
            return;
        } else if (password != password2) {
            setError("*Passwords do not match");
            return;
        }
        // send to backend
        try {
            // const response = await user.get("/login");
            navigation.navigate("Home");
        } catch (err) {
            setError("Sign up Unsuccessful");
            console.log(err);
        }
        navigation.navigate("Login");
    };
    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' enabled>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View>
                    <Text style={styles.title}>Carpe DM</Text>

                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                        style={styles.input}
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={firstname}
                        onChangeText={(newValue) => setFirstname(newValue)}
                    />

                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                        style={styles.input}
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={lastname}
                        onChangeText={(newValue) => setLastname(newValue)}
                    />
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={username}
                        onChangeText={(newValue) => setUsername(newValue)}
                    />

                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry={true}
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={password}
                        onChangeText={(newValue) => setPassword(newValue)}
                    />

                    <Text style={styles.label}>Verify Password</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry={true}
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={password2}
                        onChangeText={(newValue) => setPassword2(newValue)}
                    />
                    <Text
                        style={{
                            marginLeft: "17.5%",
                            fontSize: 12,
                            marginTop: "2%",
                        }}
                    >
                        <Text>Already have an account? </Text>
                        <Text
                            style={{ fontSize: 12, color: "blue" }}
                            onPress={() => {
                                navigation.navigate("Login");
                            }}
                        >
                            Login
                        </Text>
                    </Text>
                    <Text style={styles.error}>{error}</Text>
                    <TouchableOpacity onPress={SignUp} style={styles.button}>
                        <Text
                            style={{
                                color: "white",
                            }}
                        >
                            Sign Up
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default SignUpScreen;
