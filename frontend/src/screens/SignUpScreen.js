import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signup } from "../store/Users/user-actions";
import { userActions } from "../store/Users/user-slice";
import TimePickerInput from "../components/TimePickerInput";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Keyboard,
} from "react-native";
import styles from "./styles";
import axios from "axios";

const SignUpScreen = ({ navigation }) => {
    const [error, setError] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [wakeTime, setWakeTime] = useState(new Date());
    const [wakeTimeShow, setWakeTimeShow] = useState(false);
    const [sleepTime, setSleepTime] = useState(new Date());
    const [sleepTimeShow, setSleepTimeShow] = useState(false);

    const dispatch = useDispatch();

    const {
        error: userError,
        loading,
        userID,
    } = useSelector((state) => state.user);
    const formatTime = (date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

        return `${formattedHours}:${formattedMinutes}`;
    };
    const SignUp = async () => {
        // check if all the fields are filled & if passwords match
        if (!firstname || !lastname || !username || !password || !password2) {
            setError("*Fill in all required fields");
            return;
        } else if (password != password2) {
            setError("*Passwords do not match");
            return;
        }
        const newWakeTime = formatTime(wakeTime);
        const newSleepTime = formatTime(sleepTime);
        console.log({
            firstname,
            lastname,
            username,
            password,
            newWakeTime,
            newSleepTime,
        });
        dispatch(
            signup({
                firstname,
                lastname,
                username,
                password,
                newWakeTime,
                newSleepTime,
            })
        );
        if (!userError) {
            navigation.navigate("Login");
        }
    };

    useEffect(() => {
        if (userID) {
            navigation.navigate("Home");
            dispatch(userActions.userReset());
        }
        setError("");
    }, [userID, username, password, dispatch]);

    const wakeClick = () => {
        setWakeTimeShow(!wakeTimeShow);
        setSleepTimeShow(false);
        Keyboard.dismiss();
    };

    const sleepClick = () => {
        setSleepTimeShow(!sleepTimeShow);
        setWakeTimeShow(false);
        Keyboard.dismiss();
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
                    <Text style={styles.label}>Email</Text>
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

                    <Text style={styles.label}>Wake Time</Text>
                    <View style={styles.centeredViewPadding}>
                        <TimePickerInput
                            setEventTime={setWakeTime}
                            show={wakeTimeShow}
                            setShow={setWakeTimeShow}
                            onClick={wakeClick}
                            eventTime = {wakeTime}
                        />
                    </View>

                    <Text style={styles.label}>Sleep Time</Text>
                    <View style={styles.centeredViewPadding}>
                        <TimePickerInput
                            setEventTime={setSleepTime}
                            show={sleepTimeShow}
                            setShow={setSleepTimeShow}
                            onClick={sleepClick}
                            eventTime = {sleepTime}
                        />
                    </View>

                    <Text
                        style={{
                            marginLeft: "17.5%",
                            fontSize: 12,
                            marginTop: "4%",
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
                    {error && <Text style={styles.error}>{error}</Text>}
                    {userError && <Text style={styles.error}>{userError}</Text>}
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
