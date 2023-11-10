import React, { useState } from "react";
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Keyboard,
    Platform,
    TouchableWithoutFeedback,
    TextInput,
} from "react-native";
import EventDateInput from "./EventDateInput";

const EventModal = ({ onAddEvent, onHideModal }) => {
    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const handlePress = () => {
        console.log("pressed");
    };
    const closeModal = () => {
        onHideModal();
    };
    return (
        <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                    <View style={styles.modalView}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={setEventName}
                                value={eventName}
                                placeholder='Enter event name'
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Date</Text>
                            <EventDateInput onDateChange={setEventDate} />
                        </View>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={closeModal}
                        >
                            <Text style={styles.textStyle}>Add Event</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
    );
};
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent background
    },
    modalView: {
        margin: 20,
        backgroundColor: "black",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        backgroundColor: "white",
        borderColor: "white",
        borderWidth: 4,
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 15,
    },
    textStyle: {
        color: "black",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    inputContainer: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingHorizontal: 15,
        backgroundColor: "black",
        width: 250,
    },
    label: {
        fontSize: 16,
        color: "white",
        paddingBottom: 5,
    },
    input: {
        height: 40,
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
        color: "white",
        backgroundColor: "black",
    },
});
export default EventModal;
