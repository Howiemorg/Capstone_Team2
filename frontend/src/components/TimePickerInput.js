import React, { useEffect, useState } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    Modal,
    Keyboard,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const TimePickerInput = ({ setEventTime, onClick, show, setShow, eventTime, txtColor }) => {

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            // Your timeout logic here
            setShow(false);
        }, 1500); // Wait for 2 seconds before executing

        // Cleanup function to clear the timeout when the component
        // unmounts or selectedPriority changes again
        return () => clearTimeout(timeoutId);
    }, [eventTime]);

    const onChange = (event, selectedTime) => {
        setEventTime(new Date(selectedTime)); // Ensure the new time is a Date object
    };

    // Helper function to format the time as a string
    const formatTime = (date) => {
        if(date == undefined){
            return "null"
        }
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12; // Converts "0" hours to "12"
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.timeDisplay} onPress={onClick}>
                <Text style={styles.timeText}>{formatTime(eventTime)}</Text>
            </TouchableOpacity>

            {show && (
                <DateTimePicker
                    testID='dateTimePicker'
                    value={eventTime}
                    mode='time'
                    is24Hour={true} // Use 24-hour format, set to false for AM/PM
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onChange}
                    style={styles.timePicker}
                    textColor={txtColor}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    timeDisplay: {
        // Style the time display box
        paddingHorizontal: 10,
        paddingVertical: 15,
        backgroundColor: "black",
        borderWidth: 1,
        borderColor: "white",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        width: 220,
    },
    timeText: {
        // Style the time text
        color: "white",
        fontSize: 16,
    },
    timePicker: {
        color: "black",
    }
});

export default TimePickerInput;
