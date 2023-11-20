import React, { useState } from "react";
import {
    View,
    Platform,
    StyleSheet,
    TouchableOpacity,
    Text,
    Keyboard,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const EventDateInput = ({ onDateChange, onClick, show, setShow}) => {
    const [date, setDate] = useState(new Date());

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
        onDateChange(currentDate);
        setTimeout(() => {
            setShow(false);
        }, 2500);
    };

    const formatDate = (date) => {
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };

    return (
        <View style={styles.centeredView}>
            <TouchableOpacity
                style={styles.dateDisplay}
                onPress={onClick}
            >
                <Text style={styles.dateText}>{formatDate(date)}</Text>
            </TouchableOpacity>
            {show && (
                <DateTimePicker
                    testID='dateTimePicker'
                    value={date}
                    mode='date'
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onChange}
                    style={styles.datePickerContainer}
                    pickerContainerStyleIOS={{ backgroundColor: "black" }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    },
    datePickerContainer: {
        backgroundColor: "white",
        width: "100%",
    },
    dateDisplay: {
        // Style the date display box
        paddingHorizontal: 10,
        paddingVertical: 15,
        backgroundColor: "black",
        borderWidth: 1,
        borderColor: "white",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
    },
    dateText: {
        // Style the date text
        color: "white",
        fontSize: 16,
    },
});

export default EventDateInput;
