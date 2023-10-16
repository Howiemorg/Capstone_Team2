import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import styles from "./styles";

const SignUpScreen = ({ navigation }) => {
    const SignUp = () => {
        navigation.navigate("Login");
    };

    return (
        <View>
            <Text style={styles.title}>Carpe DM</Text>

            <Text style={styles.label}>First Name</Text>
            <Text style={styles.input}></Text>

            <Text style={styles.label}>Last Name</Text>
            <Text style={styles.input}></Text>

            <Text style={styles.label}>Username</Text>
            <Text style={styles.input}></Text>

            <Text style={styles.label}>Password</Text>
            <Text style={styles.input}></Text>

            <Text style={styles.label}>Verify Password</Text>
            <Text style={styles.input}></Text>
            <TouchableOpacity style={styles.button}>
                <Text
                    style={{
                        color: "white",
                    }}
                >
                    Sign Up
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default SignUpScreen;
