import React, { useState } from "react";
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TextInput,
    Keyboard,
} from "react-native";
import EventDateInput from "./EventDateInput";
import TimePickerInput from "./TimePickerInput";
import axios from "axios";

const EventModal = ({ onAddEvent, onHideModal, userID }) => {
    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState(new Date());
    const [eventStartTime, setEventStartTime] = useState(new Date());
    const [eventEndTime, setEventEndTime] = useState(new Date());

    const [dateShow, setDateShow] = useState(false);
    const [startTimeShow, setStartTimeShow] = useState(false);
    const [endTimeShow, setEndTimeShow] = useState(false);

    const formatTime = (date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

        return `${formattedHours}:${formattedMinutes}`;
    };

    const formatDate = (date) => {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    };

    const dateClick = () => {
        Keyboard.dismiss();
        setDateShow(!dateShow);
        setStartTimeShow(false);
        setEndTimeShow(false);
    };

    const startTimeClick = () => {
        Keyboard.dismiss();
        setDateShow(false);
        setStartTimeShow(!startTimeShow);
        setEndTimeShow(false);
    };
    const endTimeClick = () => {
        Keyboard.dismiss();
        setDateShow(false);
        setStartTimeShow(false);
        setEndTimeShow(!endTimeShow);
    };
    const keyboardPress = () => {
        setDateShow(false);
        setStartTimeShow(false);
        setEndTimeShow(false);
    };

    const addEvent = async () => {
        const date = formatDate(eventDate);
        const startTime = formatTime(eventStartTime);
        const endTime = formatTime(eventEndTime);

        if(eventStartTime >= eventEndTime) {
            console.error("Start time must be before end time for the event.");
            return;
        }
        console.log(
            `https://capstone-backend-charles-tran.vercel.app/add-set-event?user_id=${userID}&event_name='${eventName}'&event_start_time='${startTime}'&event_end_time='${endTime}'&event_date='${date}'`
        );
        axios.post(
            `https://capstone-backend-charles-tran.vercel.app/add-set-event?user_id=${userID}&event_name='${eventName}'&event_start_time='${startTime}'&event_end_time='${endTime}'&event_date='${date}'`
        );
        onAddEvent();
        onHideModal();
    };
    const closeModal = () => {
        onHideModal();
    };
    return (
        <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                    accessible={false}
                >
                    <View style={styles.modalView}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={setEventName}
                                value={eventName}
                                onPressIn={keyboardPress}
                                placeholder='Enter event name'
                                placeholderTextColor='white'
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Date</Text>
                            <EventDateInput
                                setDate={setEventDate}
                                onClick={dateClick}
                                show={dateShow}
                                setShow = {setDateShow}
                                date = {eventDate}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Start Time</Text>
                            <TimePickerInput
                                setEventTime={setEventStartTime}
                                onClick={startTimeClick}
                                show={startTimeShow}
                                setShow= {setStartTimeShow}
                                eventTime={eventStartTime}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>End Time</Text>
                            <TimePickerInput
                                setEventTime={setEventEndTime}
                                onClick={endTimeClick}
                                show={endTimeShow}
                                setShow={setEndTimeShow}
                                eventTime = {eventEndTime}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={addEvent}
                        >
                            <Text style={styles.textStyle} onPress={addEvent}>
                                Add Event
                            </Text>
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
